use tauri::{Emitter, Manager};
use tauri_plugin_shell::{
    process::{CommandChild, CommandEvent},
    Error, ShellExt,
};

use tokio::sync::mpsc::Receiver;

use crate::app_state::AppState;

fn handle_daemon_stdio(app_handle: tauri::AppHandle, mut rx: Receiver<CommandEvent>) {
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

async fn set_daemon_error(app_handle: tauri::AppHandle, error: Error) {
    let state = app_handle.state::<AppState>();
    let mut state = state.lock().await;

    state.daemon.set_error(error.to_string());
}

async fn set_daemon_starting(app_handle: tauri::AppHandle, child: CommandChild) {
    let state = app_handle.state::<AppState>();
    let mut state = state.lock().await;

    if let Err(e) = state.daemon.set_starting(child) {
        log::error!("{}", e);
    }
}

pub fn start_sidecar(app: &tauri::App) {
    log::debug!("Starting sidecar (daemon)...");
    let app_handle = app.handle().clone();

    tauri::async_runtime::spawn(async {
        let sidecar_command = app_handle.shell().sidecar("devwebpen-daemon");
        if let Err(e) = sidecar_command {
            log::error!("Failed to create sidecar command: {}", e);
            set_daemon_error(app_handle, e).await;
            return;
        }

        let sidecar_command = sidecar_command.unwrap().spawn();
        if let Err(e) = sidecar_command {
            log::error!("Failed to spawn sidecar command: {}", e);
            set_daemon_error(app_handle, e).await;
            return;
        }

        let (rx, child) = sidecar_command.unwrap();
        log::debug!("Sidecar started, PID: {}", child.pid());

        // Store the child process in the app state to ensure it is not dropped
        set_daemon_starting(app_handle.clone(), child).await;

        handle_daemon_stdio(app_handle, rx);
    });
}
