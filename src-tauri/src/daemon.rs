use std::sync::Mutex;

use futures_util::stream::SplitSink;
use tauri::Manager;
use tauri_plugin_shell::process::CommandChild;
use tauri_plugin_shell::ShellExt;
use tokio::net::TcpStream;
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};
use uuid;

use connector::start_server;
use sidecar::{handle_daemon_stdout, send_daemon_init, set_daemon_error};

mod connector;
mod sidecar;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
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
    ws_out: Option<SplitSink<WebSocketStream<TcpStream>, Message>>,
    pub error: Option<String>,
}

impl Default for DaemonInner {
    fn default() -> Self {
        DaemonInner {
            state: DaemonState::Stopped,
            sidecar: None,
            token: None,
            ws_out: None,
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

    pub fn set_ws_out(&mut self, ws_out: SplitSink<WebSocketStream<TcpStream>, Message>) {
        self.ws_out = Some(ws_out);
    }

    pub fn get_ws_out(&self) -> Option<&SplitSink<WebSocketStream<TcpStream>, Message>> {
        self.ws_out.as_ref()
    }

    pub fn set_starting(&mut self, sidecar: CommandChild) -> Result<(), String> {
        match self.state {
            DaemonState::Stopped => {
                self.state = DaemonState::Starting;
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
                child.kill().map_err(|e| e.to_string())
            }
            None => Err(format!(
                "Invalid state transition from {:?} to Stopped, or sidecar is not running",
                self.state
            )),
        }
    }
}

fn generate_token(app_handle: &tauri::AppHandle) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().unwrap();
    let token = uuid::Uuid::new_v4().to_string();
    daemon.set_token(token);
}

fn start_sidecar(app_handle: &tauri::AppHandle) {
    log::debug!("Starting sidecar (daemon)...");
    let sidecar_command = app_handle.shell().sidecar("devwebpen-daemon");
    if let Err(e) = sidecar_command {
        log::error!("Failed to create sidecar command: {}", e);
        set_daemon_error(app_handle, e);
        return;
    }

    let sidecar_command = sidecar_command.unwrap().spawn();
    if let Err(e) = sidecar_command {
        log::error!("Failed to spawn sidecar command: {}", e);
        set_daemon_error(app_handle, e);
        return;
    }

    let (rx, mut child) = sidecar_command.unwrap();
    log::debug!("Sidecar started, PID: {}", child.pid());

    send_daemon_init(&mut child, app_handle);

    // Store the child process in the app state to ensure it is not dropped
    sidecar::set_daemon_starting(app_handle, child);

    handle_daemon_stdout(rx);
}

fn start_connector(app_handle: &tauri::AppHandle) {
    generate_token(app_handle);

    log::debug!("Starting daemon connector...");
    tauri::async_runtime::spawn(start_server(app_handle.clone()));
}

pub fn start(app_handle: &tauri::AppHandle) {
    start_connector(app_handle);
    start_sidecar(app_handle);
}

pub type Daemon = Mutex<DaemonInner>;
