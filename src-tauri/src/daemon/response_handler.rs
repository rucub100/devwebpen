use tauri::{AppHandle, Manager};

use crate::{
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
            todo!("TODO: Handle http request error");
        }
        ResponseType::HttpResponse => {
            todo!("TODO: Handle http response");
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

    let error = body_lines.next();

    if let None = error {
        log::error!("Failed to parse proxy error");
        return;
    }

    let error = error.unwrap();

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

    let proxy = proxy.clone();

    let result = emit_event(app_handle, DevWebPenEvent::ProxyChanged(proxy));

    if let Err(e) = result {
        log::error!("{}", e);
    }
}
