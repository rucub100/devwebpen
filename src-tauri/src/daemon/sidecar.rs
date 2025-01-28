use tauri::Manager;
use tauri_plugin_shell::{
    process::{CommandChild, CommandEvent},
    Error,
};
use tokio::sync::mpsc::Receiver;

use crate::events::{emit_event, DevWebPenEvent};

use super::Daemon;

pub fn send_daemon_init(child: &mut CommandChild, app_handle: &tauri::AppHandle) {
    let state = app_handle.state::<Daemon>();
    let daemon = state.lock().unwrap();
    if let Some(token) = daemon.get_token() {
        log::debug!("Sending token to daemon...");
        child.write(format!("{}\n", token).as_bytes()).unwrap();
    }
    // TODO: Send also port information to daemon
}

pub fn handle_daemon_stdout(mut rx: Receiver<CommandEvent>) {
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            if let CommandEvent::Stdout(line_bytes) = event {
                let line = String::from_utf8_lossy(&line_bytes);
                log::debug!("[DAEMON] {}", line);
            } else if let CommandEvent::Stderr(line_bytes) = event {
                let line = String::from_utf8_lossy(&line_bytes);
                log::error!("[DAEMON] {}", line);
            }
        }
    });
}

pub fn set_daemon_error(app_handle: &tauri::AppHandle, error: Error) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().unwrap();

    daemon.set_error(error.to_string());
}

pub fn set_daemon_starting(app_handle: &tauri::AppHandle, child: CommandChild) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().unwrap();

    if let Err(e) = daemon.set_starting(child) {
        log::error!("{}", e);
    } else if let Err(e) = emit_event(
        app_handle,
        DevWebPenEvent::DaemonStateChanged(daemon.state.clone()),
    ) {
        log::error!("{}", e);
    }
}
