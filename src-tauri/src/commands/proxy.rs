use tauri::ipc::Channel;
use uuid::Uuid;

use crate::{
    app_state::AppState,
    daemon::{
        command::Command,
        request::{Request, RequestType},
        Daemon,
    },
    events::{emit_event, DevWebPenEvent},
    proxy::{Proxy, ProxyInner},
    view::ViewState,
};

use super::send_daemon_request;

#[tauri::command]
pub async fn start_proxy<'a>(
    daemon_state: tauri::State<'a, Daemon>,
    proxy_state: tauri::State<'a, Proxy>,
) -> Result<(), String> {
    let port = {
        let proxy = proxy_state.lock().unwrap();
        proxy.get_port()
    };

    let req = Request::new_text(
        RequestType::Command,
        format!("{}:{}", Command::StartProxy, port),
    );

    log::debug!("Starting proxy on port {}...", port);

    return send_daemon_request(daemon_state, req).await;
}

#[tauri::command]
pub async fn stop_proxy<'a>(daemon_state: tauri::State<'a, Daemon>) -> Result<(), String> {
    let req = Request::new_text(RequestType::Command, Command::StopProxy.to_string());

    return send_daemon_request(daemon_state, req).await;
}

#[tauri::command]
pub async fn get_proxy_state<'a>(
    proxy_state: tauri::State<'a, Proxy>,
) -> Result<ProxyInner, String> {
    let proxy = proxy_state.lock().unwrap();
    let proxy = proxy.clone();
    Ok(proxy)
}

#[tauri::command]
pub async fn set_proxy_port<'a>(
    port: u16,
    proxy_state: tauri::State<'a, Proxy>,
) -> Result<ProxyInner, String> {
    let mut proxy = proxy_state.lock().unwrap();
    proxy.set_port(port);
    let proxy = proxy.clone();
    Ok(proxy)
}

#[tauri::command]
pub async fn proxy_toggle_debugging<'a>(
    proxy_state: tauri::State<'a, Proxy>,
    daemon_state: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    let debug = {
        let proxy = proxy_state.lock().unwrap();
        proxy.get_debug()
    };

    let req = Request::new_text(
        RequestType::Command,
        format!("{}:{}", Command::ProxyDebug, !debug),
    );

    return send_daemon_request(daemon_state, req).await;
}

#[tauri::command]
pub async fn proxy_open_suspended<'a>(
    id: Uuid,
    app_handle: tauri::AppHandle,
    view_state: tauri::State<'a, ViewState>,
) -> Result<(), String> {
    let view = {
        let mut view = view_state.lock().unwrap();
        view.open_proxy_suspended(id)
    };

    return emit_event(&app_handle, DevWebPenEvent::ViewStateChanged(view))
        .map_err(|e| e.to_string());
}

#[tauri::command]
pub async fn proxy_forward_suspended<'a>(
    id: Uuid,
    app_handle: tauri::AppHandle,
    view_state: tauri::State<'a, ViewState>,
    daemon_state: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    let view = {
        let mut view = view_state.lock().unwrap();
        view.close_proxy_suspended()
    };

    emit_event(&app_handle, DevWebPenEvent::ViewStateChanged(view)).map_err(|e| e.to_string())?;

    let req = Request::new_text(
        RequestType::Command,
        format!("{}:{}", Command::ProxyForward, id),
    );

    return send_daemon_request(daemon_state, req).await;
}

#[tauri::command]
pub async fn proxy_forward_all_suspended<'a>(
    app_handle: tauri::AppHandle,
    view_state: tauri::State<'a, ViewState>,
    daemon_state: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    let view = {
        let mut view = view_state.lock().unwrap();
        view.close_proxy_suspended()
    };

    emit_event(&app_handle, DevWebPenEvent::ViewStateChanged(view)).map_err(|e| e.to_string())?;

    let req = Request::new_text(RequestType::Command, Command::ProxyForwardAll.to_string());

    return send_daemon_request(daemon_state, req).await;
}

#[tauri::command]
pub async fn proxy_drop_suspended<'a>(
    id: Uuid,
    app_handle: tauri::AppHandle,
    view_state: tauri::State<'a, ViewState>,
    daemon_state: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    let view = {
        let mut view = view_state.lock().unwrap();
        view.close_proxy_suspended()
    };

    emit_event(&app_handle, DevWebPenEvent::ViewStateChanged(view)).map_err(|e| e.to_string())?;

    let req = Request::new_text(
        RequestType::Command,
        format!("{}:{}", Command::ProxyDrop, id),
    );

    return send_daemon_request(daemon_state, req).await;
}

#[tauri::command]
pub async fn proxy_drop_all_suspended<'a>(
    app_handle: tauri::AppHandle,
    view_state: tauri::State<'a, ViewState>,
    daemon_state: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    let view = {
        let mut view = view_state.lock().unwrap();
        view.close_proxy_suspended()
    };

    emit_event(&app_handle, DevWebPenEvent::ViewStateChanged(view)).map_err(|e| e.to_string())?;

    let req = Request::new_text(RequestType::Command, Command::ProxyDropAll.to_string());

    return send_daemon_request(daemon_state, req).await;
}
#[tauri::command]
pub async fn proxy_get_suspended_content<'a>(
    id: Uuid,
    channel: Channel<serde_json::Value>,
    app_state: tauri::State<'a, AppState>,
    daemon_state: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    {
        let mut app_state = app_state.lock().unwrap();
        app_state.channels.insert(id.to_string(), channel);
    }

    let req = Request::new_text(
        RequestType::Command,
        format!("{}:{}", Command::ProxySuspendedContent, id),
    );

    return send_daemon_request(daemon_state, req).await;
}
