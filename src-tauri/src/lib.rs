use app_state::AppState;
use log;
use tauri::Manager;

mod app_state;
mod daemon_connector;
mod daemon_sidecar;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    log::debug!("Starting application...");
    daemon_connector::start_connector();
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            log::debug!("Creating app state...");
            app.manage(AppState::default());
            log::debug!("Starting sidecar (daemon)...");
            daemon_sidecar::start_sidecar(app);
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        // .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
