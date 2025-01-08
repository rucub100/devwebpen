use app_state::AppState;
use tauri::Manager;

mod app_state;
mod daemon_connector;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    daemon_connector::start_connector();
    tauri::Builder::default()
        .setup(|app| {
            app.manage(AppState::default());
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        // .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
