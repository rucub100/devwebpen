use tauri::Manager;
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tokio::sync::mpsc::Receiver;

use crate::{
    daemon::set_daemon_error,
    events::{emit_event, DevWebPenEvent},
};

use super::Daemon;

pub fn send_daemon_init(child: &mut CommandChild, app_handle: &tauri::AppHandle) {
    log::debug!("Sending init to daemon...");
    let state = app_handle.state::<Daemon>();
    let daemon = state.lock().unwrap();
    if let Some(token) = daemon.get_token() {
        log::debug!("Sending token to daemon...");
        child.write(format!("{}\n", token).as_bytes()).unwrap();
    }
    // TODO: Send also port information to daemon
}

pub fn handle_daemon_stdout(mut rx: Receiver<CommandEvent>, app_handle: &tauri::AppHandle) {
    let app_handle = app_handle.clone();
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            if let CommandEvent::Stdout(line_bytes) = event {
                let line = String::from_utf8_lossy(&line_bytes);
                log::debug!("[DAEMON] {}", line);
            } else if let CommandEvent::Stderr(line_bytes) = event {
                let line = String::from_utf8_lossy(&line_bytes);
                log::error!("[DAEMON] {}", line);
            } else if let CommandEvent::Terminated(payload) = event {
                log::error!("[DAEMON] Terminated with : {:?}", payload);
                set_daemon_error(&app_handle, format!("Daemon terminated with {:?}", payload));
                rx.close();
            }
        }
    });
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
