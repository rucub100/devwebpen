use crate::{
    daemon::{
        command::Command,
        request::{Request, RequestType},
        Daemon,
    },
    proxy::{Proxy, ProxyInner},
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
) -> Result<ProxyInner, String> {
    let mut proxy = proxy_state.lock().unwrap();
    proxy.toggle_debugging();
    let proxy = proxy.clone();
    Ok(proxy)
}
