use uuid::Uuid;

use crate::{
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

    send_daemon_request(daemon_state, req).await?;

    Ok(())
}

#[tauri::command]
pub async fn stop_proxy<'a>(daemon_state: tauri::State<'a, Daemon>) -> Result<(), String> {
    let req = Request::new_text(RequestType::Command, Command::StopProxy.to_string());

    send_daemon_request(daemon_state, req).await?;

    Ok(())
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

    send_daemon_request(daemon_state, req).await?;

    Ok(())
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
