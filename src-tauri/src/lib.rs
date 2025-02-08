use log;
use tauri::Manager;

use app_state::AppState;
use commands::{
    close_ephemeral_session, close_project, close_tab, create_project, get_daemon_error,
    get_daemon_state, get_ephemeral_session, get_project, get_proxy_state, get_recent_projects,
    init_view, navigate_to, open_project, open_recent_project, open_welcome, restart_daemon,
    select_tab, start_ephemeral_session, start_proxy, stop_proxy,
};
use daemon::Daemon;
use proxy::Proxy;
use view::ViewState;
use window::window_event_handler;

mod app_state;
mod commands;
mod daemon;
mod events;
mod proxy;
mod store;
mod view;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    log::debug!("Starting application...");
    tauri::Builder::default()
        .manage(AppState::default())
        .manage(ViewState::default())
        .manage(Daemon::default())
        .manage(Proxy::default())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            init_view,
            get_ephemeral_session,
            navigate_to,
            close_tab,
            select_tab,
            open_welcome,
            start_ephemeral_session,
            close_ephemeral_session,
            get_project,
            get_recent_projects,
            create_project,
            open_project,
            open_recent_project,
            close_project,
            get_daemon_state,
            get_daemon_error,
            restart_daemon,
            start_proxy,
            stop_proxy,
            get_proxy_state
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

            let app_handle = app.handle().clone();
            store::load(&app_handle.clone())?;
            tauri::async_runtime::spawn(daemon::start(app_handle));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
