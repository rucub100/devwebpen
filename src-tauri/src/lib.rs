use app_state::AppState;
use commands::{close_tab, init_view, navigate_to, open_welcome, select_tab};
use log;
use tauri::Manager;
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
        .invoke_handler(tauri::generate_handler![
            init_view,
            navigate_to,
            close_tab,
            select_tab,
            open_welcome
        ])
        .on_window_event(window_event_handler)
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let main_window = app.get_webview_window("main");
                if let Some(main_window) = main_window {
                    main_window.open_devtools();
                }
            }

            log::debug!("Starting daemon connector...");
            daemon_connector::start_connector(app);
            log::debug!("Starting sidecar (daemon)...");
            daemon_sidecar::start_sidecar(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
