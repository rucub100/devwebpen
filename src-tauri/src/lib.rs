use app_state::AppState;
use commands::{
    close_tab, create_project, get_ephemeral_session, get_project, init_view, navigate_to,
    open_project, open_welcome, select_tab, start_ephemeral_session,
};
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
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            init_view,
            get_ephemeral_session,
            navigate_to,
            close_tab,
            select_tab,
            open_welcome,
            start_ephemeral_session,
            get_project,
            create_project,
            open_project
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

            daemon_connector::start_connector(app);
            daemon_sidecar::start_sidecar(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
