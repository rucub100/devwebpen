use tauri::{Emitter, Manager};
use tauri_plugin_shell::{process::CommandEvent, ShellExt};

use crate::app_state::AppState;

pub fn start_sidecar(app: &tauri::App) {
    let sidecar_command = app.shell().sidecar("webpen-daemon").unwrap();
    let (mut rx, child) = sidecar_command.spawn().expect("Failed to spawn sidecar");
    log::debug!("Sidecar started, PID: {}", child.pid());

    // Store the child process in the app state to ensure it is not dropped
    let state = app.handle().state::<AppState>();
    let mut state = state.lock().unwrap();

    state.deamon_sidecar = Some(child);

    let app_handle = app.handle().clone();
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
