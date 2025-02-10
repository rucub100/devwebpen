use std::sync::Arc;

use futures_util::stream::SplitSink;
use tauri::{AppHandle, Manager};
use tauri_plugin_shell::process::CommandChild;
use tauri_plugin_shell::ShellExt;
use tokio::{net::TcpStream, sync::Mutex};
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};
use uuid;

use connector::start_server;
use sidecar::{handle_daemon_stdout, send_daemon_init};

use crate::events::{emit_event, DevWebPenEvent};

pub mod command;
mod connector;
pub mod request;
pub mod response;
mod response_handler;
mod sidecar;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum DaemonState {
    Stopped,
    Starting,
    Connecting,
    Running,
    Error,
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DaemonInner {
    pub state: DaemonState,
    #[serde(skip)]
    sidecar: Option<CommandChild>,
    #[serde(skip)]
    token: Option<String>,
    #[serde(skip)]
    ws_out: Arc<Mutex<Option<SplitSink<WebSocketStream<TcpStream>, Message>>>>,
    pub error: Option<String>,
}

impl Default for DaemonInner {
    fn default() -> Self {
        DaemonInner {
            state: DaemonState::Stopped,
            sidecar: None,
            token: None,
            ws_out: Arc::new(Mutex::new(None)),
            error: None,
        }
    }
}

impl DaemonInner {
    pub fn set_token(&mut self, token: String) {
        self.token = Some(token);
    }

    pub fn get_token(&self) -> Option<&String> {
        self.token.as_ref()
    }

    pub async fn set_ws_out(&mut self, ws_out: SplitSink<WebSocketStream<TcpStream>, Message>) {
        self.ws_out.lock().await.replace(ws_out);
    }

    pub fn get_ws_out(&self) -> Arc<Mutex<Option<SplitSink<WebSocketStream<TcpStream>, Message>>>> {
        self.ws_out.clone()
    }

    pub fn set_starting(&mut self, sidecar: CommandChild) -> Result<(), String> {
        match self.state {
            DaemonState::Stopped => {
                self.state = DaemonState::Starting;
                self.error = None;
                self.sidecar = Some(sidecar);
                Ok(())
            }
            _ => Err(format!(
                "Invalid state transition from {:?} to Starting",
                self.state
            )),
        }
    }

    pub fn set_connecting(&mut self) -> Result<(), String> {
        match self.state {
            DaemonState::Starting => {
                self.state = DaemonState::Connecting;
                self.error = None;
                Ok(())
            }
            _ => Err(format!(
                "Invalid state transition from {:?} to Connecting",
                self.state
            )),
        }
    }

    pub fn set_running(&mut self) -> Result<(), String> {
        match self.state {
            DaemonState::Connecting => {
                self.state = DaemonState::Running;
                self.error = None;
                Ok(())
            }
            _ => Err(format!(
                "Invalid state transition from {:?} to Running",
                self.state
            )),
        }
    }

    pub fn set_error(&mut self, error: String) {
        self.state = DaemonState::Error;
        self.error = Some(error);
    }

    pub fn stop(&mut self) -> Result<(), String> {
        match self.sidecar.take() {
            Some(child) => {
                self.state = DaemonState::Stopped;
                self.error = None;
                child.kill().map_err(|e| e.to_string())
            }
            None => Err(format!(
                "Invalid state transition from {:?} to Stopped, or sidecar is not running",
                self.state
            )),
        }
    }
}

async fn generate_token(app_handle: &tauri::AppHandle) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().await;
    let token = uuid::Uuid::new_v4().to_string();
    daemon.set_token(token);
}

async fn set_daemon_error(app_handle: &AppHandle, error: String) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().await;

    daemon.set_error(error.to_string());

    if let Err(e) = emit_event(
        app_handle,
        DevWebPenEvent::DaemonStateChanged(daemon.state.clone()),
    ) {
        log::error!("{}", e);
    }

    if let Err(e) = emit_event(
        app_handle,
        DevWebPenEvent::DaemonError(Some(error.to_string())),
    ) {
        log::error!("{}", e);
    }
}

async fn set_daemon_starting(app_handle: &tauri::AppHandle, child: CommandChild) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().await;

    if let Err(e) = daemon.set_starting(child) {
        log::error!("{}", e);
    } else {
        if let Err(e) = emit_event(
            app_handle,
            DevWebPenEvent::DaemonStateChanged(daemon.state.clone()),
        ) {
            log::error!("{}", e);
        }

        if let Err(e) = emit_event(
            app_handle,
            DevWebPenEvent::DaemonError(daemon.error.clone()),
        ) {
            log::error!("{}", e);
        }
    }
}

async fn set_daemon_connecting(app_handle: &AppHandle) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().await;

    if let Err(e) = daemon.set_connecting() {
        log::error!("{}", e);
    } else if let Err(e) = emit_event(
        app_handle,
        DevWebPenEvent::DaemonStateChanged(daemon.state.clone()),
    ) {
        log::error!("{}", e);
    }
}

async fn set_daemon_running(app_handle: &AppHandle) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().await;

    if let Err(e) = daemon.set_running() {
        log::error!("{}", e);
    } else if let Err(e) = emit_event(
        app_handle,
        DevWebPenEvent::DaemonStateChanged(daemon.state.clone()),
    ) {
        log::error!("{}", e);
    }
}

async fn stop_sidecar(app_handle: &tauri::AppHandle) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().await;
    if let Err(e) = daemon.stop() {
        log::error!("{}", e);
    }
}

async fn start_sidecar(app_handle: &tauri::AppHandle) {
    log::debug!("Starting sidecar (daemon)...");
    let sidecar_command = app_handle.shell().sidecar("devwebpen-daemon");
    if let Err(e) = sidecar_command {
        log::error!("Failed to create sidecar command: {}", e);
        set_daemon_error(app_handle, e.to_string()).await;
        return;
    }

    let sidecar_command = sidecar_command.unwrap().spawn();
    if let Err(e) = sidecar_command {
        log::error!("Failed to spawn sidecar command: {}", e);
        set_daemon_error(app_handle, e.to_string()).await;
        return;
    }

    let (rx, mut child) = sidecar_command.unwrap();
    let daemon_pid = child.pid();
    log::debug!("Sidecar started, PID: {}", &daemon_pid);

    send_daemon_init(&mut child, app_handle).await;

    // Store the child process in the app state to ensure it is not dropped
    set_daemon_starting(app_handle, child).await;

    handle_daemon_stdout(rx, app_handle, daemon_pid);
}

async fn start_connector(app_handle: &tauri::AppHandle) {
    generate_token(app_handle).await;

    log::debug!("Starting daemon connector...");
    tauri::async_runtime::spawn(start_server(app_handle.clone()));
}

pub async fn start(app_handle: tauri::AppHandle) {
    start_connector(&app_handle).await;
    start_sidecar(&app_handle).await;
}

pub async fn restart(app_handle: &tauri::AppHandle) {
    stop_sidecar(app_handle).await;
    start_sidecar(app_handle).await;
}

pub type Daemon = Mutex<DaemonInner>;
