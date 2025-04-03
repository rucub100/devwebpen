// Copyright 2025 Ruslan Curbanov
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use tauri::{AppHandle, Emitter};

use crate::{
    api_client::ApiClientInner,
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
    ApiClientChanged(ApiClientInner),
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
            DevWebPenEvent::ApiClientChanged(_) => "devwebpen://api-client-changed",
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
        DevWebPenEvent::ApiClientChanged(payload) => app_handle.emit(event_name, payload),
    }
}
