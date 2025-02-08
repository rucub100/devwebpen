use tauri::{AppHandle, Emitter};

use crate::{
    app_state::{project::Project, session::Session},
    daemon::DaemonState,
    proxy::ProxyInner,
    view::PartialViewState,
};

pub enum DevWebPenEvent {
    ViewStateChanged(PartialViewState),
    DaemonStateChanged(DaemonState),
    DaemonError(Option<String>),
    EphemeralSessionChanged(Option<Session>),
    ProjectChanged(Option<Project>),
    ProxyChanged(ProxyInner),
}

impl DevWebPenEvent {
    fn to_string(&self) -> &'static str {
        match self {
            DevWebPenEvent::ViewStateChanged(_) => "devwebpen://view-state-changed",
            DevWebPenEvent::DaemonStateChanged(_) => "devwebpen://daemon-state-changed",
            DevWebPenEvent::DaemonError(_) => "devwebpen://daemon-error",
            DevWebPenEvent::EphemeralSessionChanged(_) => "devwebpen://ephemeral-session-changed",
            DevWebPenEvent::ProjectChanged(_) => "devwebpen://project-changed",
            DevWebPenEvent::ProxyChanged(_) => "devwebpen://proxy-changed",
        }
    }
}

pub fn emit_event(app_handle: &AppHandle, event: DevWebPenEvent) -> Result<(), tauri::Error> {
    let event_name = event.to_string();
    match event {
        DevWebPenEvent::ViewStateChanged(payload) => app_handle.emit(event_name, payload),
        DevWebPenEvent::DaemonStateChanged(payload) => app_handle.emit(event_name, payload),
        DevWebPenEvent::DaemonError(payload) => app_handle.emit(event_name, payload),
        DevWebPenEvent::EphemeralSessionChanged(payload) => app_handle.emit(event_name, payload),
        DevWebPenEvent::ProjectChanged(payload) => app_handle.emit(event_name, payload),
        DevWebPenEvent::ProxyChanged(payload) => app_handle.emit(event_name, payload),
    }
}
