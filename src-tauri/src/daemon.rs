use uuid;

use connector::start_server;
use sidecar::{handle_daemon_stdout, send_daemon_token, set_daemon_error};
use tauri::Manager;
use tauri_plugin_shell::ShellExt;

use crate::app_state::AppState;

mod connector;
mod sidecar;

fn generate_token(app_handle: &tauri::AppHandle) {
    let state = app_handle.state::<AppState>();
    let mut state = state.lock().unwrap();
    let token = uuid::Uuid::new_v4().to_string();
    state.daemon.set_token(token);
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

    send_daemon_token(&mut child, app_handle);

    // Store the child process in the app state to ensure it is not dropped
    sidecar::set_daemon_starting(app_handle, child);

    handle_daemon_stdout(app_handle, rx);
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
