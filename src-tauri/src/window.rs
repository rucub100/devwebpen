use tauri::{Manager, Window, WindowEvent};

use crate::app_state::AppState;

pub fn window_event_handler(window: &Window, event: &WindowEvent) {
    let app_handle = window.app_handle().clone();
    log::trace!("Window event: {:?}", event);
    match window.label() {
        "main" => match event {
            WindowEvent::CloseRequested { .. } => {
                log::debug!("Close requested on main window");
                let state = app_handle.state::<AppState>();
                let mut state = state.lock().unwrap();
                if let Err(e) = state.daemon.stop() {
                    log::error!("Error stopping daemon: {}", e);
                }
            }
            _ => {}
        },
        _ => {}
    }
}
