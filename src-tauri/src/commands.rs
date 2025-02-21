pub mod api_client;
pub mod daemon;
pub mod ephemeral_session;
pub mod project;
pub mod proxy;
pub mod view;

use crate::{
    daemon::{
        command::Command,
        request::{Request, RequestBody, RequestType},
        Daemon,
    },
    events::{emit_event, DevWebPenEvent},
    proxy::Proxy,
    view::ViewState,
};

use futures_util::SinkExt;
use tokio_tungstenite::tungstenite::Message;

pub async fn reset<'a>(
    app_handle: tauri::AppHandle,
    view_state: tauri::State<'a, ViewState>,
    proxy: tauri::State<'a, Proxy>,
    daemon: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    {
        let mut view_state = view_state.lock().unwrap();
        let view_state = view_state.reset();
        emit_event(&app_handle, DevWebPenEvent::ViewStateChanged(view_state))
            .map_err(|e| e.to_string())?;
    }
    {
        let mut proxy = proxy.lock().unwrap();
        let proxy = proxy.reset();
        emit_event(&app_handle, DevWebPenEvent::ProxyChanged(proxy)).map_err(|e| e.to_string())?;
    }
    {
        let ws_out = {
            let daemon = daemon.lock().await;
            daemon.get_ws_out()
        };

        let mut ws_out = ws_out.lock().await;
        let ws_out = ws_out.as_mut().ok_or("Websocket not connected")?;

        let uuid = uuid::Uuid::new_v4().to_string();
        let request_type = RequestType::Command;
        let command = Command::Reset;

        let msg = Message::text(format!("{}\n{}\n{}", uuid, request_type, command));

        ws_out.send(msg).await.map_err(|e| e.to_string())?;
    }

    Ok(())
}

pub async fn send_daemon_request<'a>(
    daemon_state: tauri::State<'a, Daemon>,
    req: Request,
) -> Result<(), String> {
    let ws_out = {
        let daemon = daemon_state.lock().await;
        daemon.get_ws_out()
    };

    let mut ws_out = ws_out.lock().await;
    let ws_out = ws_out.as_mut().ok_or("Websocket not connected")?;

    let msg = match req.body {
        RequestBody::Text(ref body) => Message::text(format!(
            "{}\n{}\n{}",
            req.header.request_id, req.header.request_type, body
        )),
        RequestBody::Binary(ref body) => todo!("Not supported yet"),
    };

    ws_out.send(msg).await.map_err(|e| e.to_string())?;
    Ok(())
}
