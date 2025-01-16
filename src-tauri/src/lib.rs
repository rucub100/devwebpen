use app_state::AppState;
use commands::{init_view, navigation};
use log;
use window::window_event_handler;

mod app_state;
mod commands;
mod daemon_connector;
mod daemon_sidecar;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    log::debug!("Starting application...");
    tauri::Builder::default()
        .manage(AppState::default())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![init_view, navigation])
        .on_window_event(window_event_handler)
        .setup(|app| {
            log::debug!("Starting daemon connector...");
            daemon_connector::start_connector(app);
            log::debug!("Starting sidecar (daemon)...");
            daemon_sidecar::start_sidecar(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
