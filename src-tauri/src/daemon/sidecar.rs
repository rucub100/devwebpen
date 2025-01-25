use tauri::{Emitter, Manager};
use tauri_plugin_shell::{
    process::{CommandChild, CommandEvent},
    Error,
};
use tokio::sync::mpsc::Receiver;

use super::Daemon;

pub fn send_daemon_token(child: &mut CommandChild, app_handle: &tauri::AppHandle) {
    let state = app_handle.state::<Daemon>();
    let daemon = state.lock().unwrap();
    if let Some(token) = daemon.get_token() {
        child.write(token.as_bytes()).unwrap();
    }
}

pub fn handle_daemon_stdout(app_handle: &tauri::AppHandle, mut rx: Receiver<CommandEvent>) {
    let app_handle = app_handle.clone();
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            if let CommandEvent::Stdout(line_bytes) = event {
                let line = String::from_utf8_lossy(&line_bytes);
                log::debug!("[DAEMON] {}", line);
                // write to stdin (make child mut for this)
                // child.write("message from Rust\n".as_bytes()).unwrap();
                app_handle.emit("daemon-message", Some(line)).unwrap();
                // TODO: update daemon state (Starting, Connecting, Running, Error)
            } else if let CommandEvent::Stderr(line_bytes) = event {
                let line = String::from_utf8_lossy(&line_bytes);
                log::error!("[DAEMON] {}", line);
                app_handle.emit("daemon-error", Some(line)).unwrap();
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
    }
}
