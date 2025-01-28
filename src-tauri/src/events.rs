use tauri::{AppHandle, Emitter};

use crate::daemon::DaemonState;

pub enum DevWebPenEvent {
    DaemonStateChanged(DaemonState),
    DaemonError(String),
}

impl DevWebPenEvent {
    fn to_string(&self) -> &'static str {
        match self {
            DevWebPenEvent::DaemonStateChanged(_) => "devwebpen://daemon-state-changed",
            DevWebPenEvent::DaemonError(_) => "devwebpen://daemon-error",
        }
    }
}

pub fn emit_event(app_handle: &AppHandle, event: DevWebPenEvent) -> Result<(), tauri::Error> {
    let event_name = event.to_string();
    match event {
        DevWebPenEvent::DaemonStateChanged(payload) => app_handle.emit(event_name, payload),
        DevWebPenEvent::DaemonError(payload) => app_handle.emit(event_name, payload),
    }
}
