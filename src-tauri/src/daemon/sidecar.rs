use tauri::Manager;
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tokio::sync::mpsc::Receiver;

use crate::daemon::set_daemon_error;

use super::Daemon;

pub async fn send_daemon_init(child: &mut CommandChild, app_handle: &tauri::AppHandle) {
    log::debug!("Sending init to daemon...");
    let state = app_handle.state::<Daemon>();
    let daemon = state.lock().await;
    if let Some(token) = daemon.get_token() {
        log::debug!("Sending token to daemon...");
        child.write(format!("{}\n", token).as_bytes()).unwrap();
    }
    // TODO: Send also port information to daemon
}

pub fn handle_daemon_stdout(
    mut rx: Receiver<CommandEvent>,
    app_handle: &tauri::AppHandle,
    daemon_pid: u32,
) {
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

                let current_daemon_pid = {
                    let state = app_handle.state::<Daemon>();
                    let daemon = state.lock().await;
                    daemon.sidecar.as_ref().unwrap().pid()
                };

                if current_daemon_pid == daemon_pid {
                    set_daemon_error(&app_handle, format!("Daemon terminated unexpectedly")).await;
                }

                rx.close();
            }
        }
    });
}
