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

pub mod api_client;
pub mod daemon;
pub mod ephemeral_session;
pub mod project;
pub mod proxy;
pub mod view;

use crate::{
    api_client::ApiClient,
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
use tauri::{AppHandle, Manager};
use tokio_tungstenite::tungstenite::Message;

pub async fn reset(app_handle: &AppHandle) -> Result<(), String> {
    {
        let view_state = app_handle.state::<ViewState>();
        let mut view_state = view_state.lock().unwrap();
        let view_state = view_state.reset();
        emit_event(&app_handle, DevWebPenEvent::ViewStateChanged(view_state))
            .map_err(|e| e.to_string())?;
    }
    {
        let proxy = app_handle.state::<Proxy>();
        let mut proxy = proxy.lock().unwrap();
        let proxy = proxy.reset();
        emit_event(&app_handle, DevWebPenEvent::ProxyChanged(proxy)).map_err(|e| e.to_string())?;
    }
    {
        let api_client = app_handle.state::<ApiClient>();
        let mut api_client = api_client.lock().unwrap();
        let api_client = api_client.reset();
        emit_event(&app_handle, DevWebPenEvent::ApiClientChanged(api_client))
            .map_err(|e| e.to_string())?;
    }
    {
        let daemon = app_handle.state::<Daemon>();
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
    };

    ws_out.send(msg).await.map_err(|e| e.to_string())?;
    Ok(())
}
