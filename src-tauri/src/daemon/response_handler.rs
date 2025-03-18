use tauri::{AppHandle, Manager};

use crate::{
    api_client::{HttpRequestError, HttpResponse},
    app_state,
    events::{emit_event, DevWebPenEvent},
    proxy::{Proxy, ProxyState},
};

use super::response::{Response, ResponseType};

pub fn handle_daemon_response(app_handle: &AppHandle, res: Response) {
    match res.header.response_type {
        ResponseType::ProxyStatus => {
            handle_proxy_status_response(app_handle, res.body);
        }
        ResponseType::HttpRequestError => {
            handle_http_request_error_response(app_handle, res.body);
        }
        ResponseType::HttpResponse => {
            handle_http_response(app_handle, res.body);
        }
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

    let port = body_lines.next();
    if let None = port {
        log::error!("Failed to parse proxy status, missing port");
        return;
    }
    let port = port.unwrap().parse::<u16>();
    if let Err(e) = port {
        log::error!("Failed to parse proxy port: {}", e);
        return;
    }
    let port = port.unwrap();

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

    let error = body_lines.next();
    let error = error.unwrap_or_default();

    let proxy = app_handle.state::<Proxy>();
    let mut proxy = proxy.lock().unwrap();

    match state {
        ProxyState::Error => {
            proxy.set_error(error.to_string());
        }
        _ => {
            proxy.set_state(state);
        }
    }
    proxy.set_port(port);
    proxy.set_debug(debug);

    let proxy = proxy.clone();

    let result = emit_event(app_handle, DevWebPenEvent::ProxyChanged(proxy));

    if let Err(e) = result {
        log::error!("{}", e);
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
