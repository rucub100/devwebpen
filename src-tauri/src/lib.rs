use app_state::AppState;
use commands::{init_view, navigation};
use log;

mod app_state;
mod commands;
mod daemon_connector;
mod daemon_sidecar;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    log::debug!("Starting application...");
    tauri::Builder::default()
        .manage(AppState::default())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            log::debug!("Starting daemon connector...");
            daemon_connector::start_connector(app);
            log::debug!("Starting sidecar (daemon)...");
            daemon_sidecar::start_sidecar(app);
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![init_view, navigation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
