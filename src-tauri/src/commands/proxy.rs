use crate::{
    daemon::{
        command::Command,
        request::{Request, RequestType},
        Daemon,
    },
    proxy::{Proxy, ProxyInner},
};

use futures_util::SinkExt;
use tokio_tungstenite::tungstenite::Message;

#[tauri::command]
pub async fn start_proxy<'a>(
    daemon_state: tauri::State<'a, Daemon>,
    proxy_state: tauri::State<'a, Proxy>,
) -> Result<(), String> {
    let ws_out = {
        let daemon = daemon_state.lock().await;
        daemon.get_ws_out()
    };
    let port = {
        let proxy = proxy_state.lock().unwrap();
        proxy.get_port()
    };

    let mut ws_out = ws_out.lock().await;
    let ws_out = ws_out.as_mut().ok_or("Websocket not connected")?;

    let req = Request::new(
        RequestType::Command,
        format!("{}:{}", Command::StartProxy.as_ref(), port),
    );
    let msg = Message::text(req.to_string());

    ws_out.send(msg).await.map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn stop_proxy<'a>(daemon_state: tauri::State<'a, Daemon>) -> Result<(), String> {
    let ws_out = {
        let daemon = daemon_state.lock().await;
        daemon.get_ws_out()
    };

    let mut ws_out = ws_out.lock().await;
    let ws_out = ws_out.as_mut().ok_or("Websocket not connected")?;

    let req = Request::new(
        RequestType::Command,
        Command::StopProxy.as_ref().to_string(),
    );
    let msg = Message::text(req.to_string());

    ws_out.send(msg).await.map_err(|e| e.to_string())?;
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
