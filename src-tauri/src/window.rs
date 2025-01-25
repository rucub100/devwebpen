use tauri::{Manager, Window, WindowEvent};

use crate::daemon::Daemon;

pub fn window_event_handler(window: &Window, event: &WindowEvent) {
    let app_handle = window.app_handle().clone();
    log::trace!("Window event: {:?}", event);
    match window.label() {
        "main" => match event {
            WindowEvent::CloseRequested { .. } => {
                log::debug!("Close requested on main window");
                let state = app_handle.state::<Daemon>();
                let mut daemon = state.lock().unwrap();
                if let Err(e) = daemon.stop() {
                    log::error!("Error stopping daemon: {}", e);
                }
            }
            _ => {}
        },
        _ => {}
    }
}
