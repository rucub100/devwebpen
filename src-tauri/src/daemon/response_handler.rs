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

use tauri::{AppHandle, Manager};

use crate::{
    api_client::{HttpRequestError, HttpResponse},
    app_state,
    events::{emit_event, DevWebPenEvent},
    proxy::{Proxy, ProxyState, SuspendedRequest},
};

use super::response::{Response, ResponseType};

pub fn handle_daemon_response(app_handle: &AppHandle, res: Response) {
    match res.header.response_type {
        ResponseType::ProxyStatus => {
            handle_proxy_status_response(app_handle, res.body);
        }
        ResponseType::ProxySuspendedContent => {
            handle_proxy_suspended_content_response(app_handle, res.body);
        }
        ResponseType::HttpRequestError => {
            handle_http_request_error_response(app_handle, res.body);
        }
        ResponseType::HttpResponse => {
            handle_http_response(app_handle, res.body);
        }
    }
}

fn handle_proxy_suspended_content_response(app_handle: &AppHandle, body: String) {
    let suspended_request: Result<SuspendedRequest, String> = body.try_into();
    if let Err(e) = suspended_request {
        log::error!("Failed to parse suspended request content: {}", e);
        return;
    }
    let suspended_request = suspended_request.unwrap();

    let app_state = app_handle.state::<crate::AppState>();
    let app_state = app_state.lock().unwrap();

    let channel = app_state.channels.get(&suspended_request.id);
    if let None = channel {
        log::error!(
            "Failed to find channel for suspended request content: {}",
            &suspended_request.id
        );
        return;
    }
    let channel = channel.unwrap();

    let json_value = serde_json::to_value(&suspended_request);
    if let Err(e) = json_value {
        log::error!("Failed to serialize suspended request content: {}", e);
        return;
    }
    let json_value = json_value.unwrap();

    let result = channel.send(json_value);
    if let Err(e) = result {
        log::error!("Failed to send suspended request content: {}", e);
        return;
    }
}

fn handle_proxy_status_response(app_handle: &AppHandle, body: String) {
    let mut body_lines = body.lines();

    let state = body_lines.next();
    if let None = state {
        log::error!("Failed to parse proxy status, missing state");
        return;
    }
    let state = ProxyState::parse(state.unwrap());
    if let Err(e) = state {
        log::error!("{}", e);
        return;
    }
    let state = state.unwrap();

    let debug = body_lines.next();
    if let None = debug {
        log::error!("Failed to parse proxy status, missing debug");
        return;
    }
    let debug = debug.unwrap().parse::<bool>();
    if let Err(e) = debug {
        log::error!("Failed to parse proxy debug: {}", e);
        return;
    }
    let debug = debug.unwrap();

    let suspended_length = body_lines.next();
    if let None = suspended_length {
        log::error!("Failed to parse proxy status, missing suspended_length");
        return;
    }
    let suspended_length = suspended_length.unwrap().parse::<usize>();
    if let Err(e) = suspended_length {
        log::error!("Failed to parse proxy suspended_length: {}", e);
        return;
    }
    let suspended_length = suspended_length.unwrap();

    let mut suspended_requests = Vec::new();
    for _ in 0..suspended_length {
        let id = body_lines.next();
        if let None = id {
            log::error!("Failed to parse suspended proxy request, missing id");
            return;
        }
        let id = id.unwrap().to_string();

        let protocol_version = body_lines.next();
        if let None = protocol_version {
            log::error!("Failed to parse suspended proxy request, missing protocol_version");
            return;
        }
        let protocol_version = protocol_version.unwrap().to_string();

        let method = body_lines.next();
        if let None = method {
            log::error!("Failed to parse suspended proxy request, missing method");
            return;
        }
        let method = method.unwrap().to_string();

        let uri = body_lines.next();
        if let None = uri {
            log::error!("Failed to parse suspended proxy request, missing uri");
            return;
        }
        let uri = uri.unwrap().to_string();

        suspended_requests.push(SuspendedRequest {
            id,
            protocol_version,
            method,
            uri,
            headers: None,
            body: None,
        });
    }

    let error = body_lines.next();
    let error = error.unwrap_or_default();

    let proxy = app_handle.state::<Proxy>();
    let mut proxy = proxy.lock().unwrap();

    let view_state = app_handle.state::<crate::ViewState>();
    let mut view = view_state.lock().unwrap();

    if (proxy.get_suspended_requests_count() == 0 || view.get_proxy_suspended_id().is_none())
        && suspended_length > 0
    {
        let uuid = uuid::Uuid::parse_str(&suspended_requests[0].id);
        if let Err(e) = uuid {
            log::error!("Failed to parse UUID: {}", e);
            return;
        }
        let uuid = uuid.unwrap();

        let view = view.open_proxy_suspended(uuid);
        let result = emit_event(app_handle, DevWebPenEvent::ViewStateChanged(view));

        if let Err(e) = result {
            log::error!("{}", e);
        }
    }

    match state {
        ProxyState::Error => {
            proxy.set_error(error.to_string());
        }
        _ => {
            proxy.set_state(state);
        }
    }
    proxy.set_debug(debug);
    proxy.set_suspended_requests(suspended_requests.clone());

    let proxy = proxy.clone();

    let result = emit_event(app_handle, DevWebPenEvent::ProxyChanged(proxy));

    if let Err(e) = result {
        log::error!("{}", e);
    }

    let tab_suspended_id = view.get_proxy_suspended_id();
    let mut close_suspended = false;

    if tab_suspended_id.is_some() {
        let tab_suspended_id = tab_suspended_id.unwrap();
        close_suspended = suspended_requests
            .iter()
            .all(|req| req.id != tab_suspended_id.to_string());
    }

    if !debug || close_suspended {
        let view = view.close_proxy_suspended();
        let result = emit_event(app_handle, DevWebPenEvent::ViewStateChanged(view));

        if let Err(e) = result {
            log::error!("{}", e);
        }
    }
}

fn handle_http_request_error_response(app_handle: &AppHandle, body: String) {
    let app_state = app_handle.state::<crate::AppState>();
    let mut app_state = app_state.lock().unwrap();

    let error: Result<HttpRequestError, String> = body.try_into();

    if let Err(e) = error {
        app_state.add_error(format!("Failed to parse HTTP request error: {}", e));
    } else {
        let error = error.unwrap();
        app_state.add_error(format!("HTTP request error: {}", error));
    }

    _update_app_state(app_handle, &app_state);
}

fn handle_http_response(app_handle: &AppHandle, body: String) {
    let app_state = app_handle.state::<crate::AppState>();
    let mut app_state = app_state.lock().unwrap();

    log::debug!("Parsing HTTP response: {}", body);

    let result: Result<HttpResponse, String> = body.try_into();

    if let Err(e) = result {
        app_state.add_error(format!("Failed to parse HTTP response: {}", e));
        _update_app_state(app_handle, &app_state);
        return;
    }

    let response = result.unwrap();

    let api_client = app_handle.state::<crate::ApiClient>();
    let mut api_client = api_client.lock().unwrap();
    let result = api_client.add_response(response);

    if let Err(e) = result {
        app_state.add_error(format!("Failed to add HTTP response: {}", e));
        _update_app_state(app_handle, &app_state);
        return;
    }

    let result = emit_event(
        app_handle,
        DevWebPenEvent::ApiClientChanged(api_client.clone()),
    );

    if let Err(e) = result {
        log::error!("{}", e);
    }
}

fn _update_app_state(app_handle: &AppHandle, app_state: &app_state::AppStateInner) {
    if app_state.ephemeral.is_some() {
        let result = emit_event(
            app_handle,
            DevWebPenEvent::EphemeralSessionChanged(app_state.ephemeral.clone()),
        );

        if let Err(e) = result {
            log::error!("{}", e);
        }
    } else if app_state.project.is_some() {
        let result = emit_event(
            app_handle,
            DevWebPenEvent::ProjectChanged(app_state.project.clone()),
        );

        if let Err(e) = result {
            log::error!("{}", e);
        }
    }
}
