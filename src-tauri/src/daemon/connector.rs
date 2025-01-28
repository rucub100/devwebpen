use std::{error::Error, time::Duration};

use futures_util::{
    stream::{SplitSink, SplitStream},
    StreamExt,
};
use tauri::{AppHandle, Manager};
use tokio::{
    net::{TcpListener, TcpStream},
    time::timeout,
};
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};

use super::{set_daemon_error, Daemon};
use crate::events::{emit_event, DevWebPenEvent};

fn set_daemon_connecting(app_handle: &AppHandle) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().unwrap();

    if let Err(e) = daemon.set_connecting() {
        log::error!("{}", e);
    } else if let Err(e) = emit_event(
        app_handle,
        DevWebPenEvent::DaemonStateChanged(daemon.state.clone()),
    ) {
        log::error!("{}", e);
    }
}

fn set_daemon_running(app_handle: &AppHandle) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().unwrap();

    if let Err(e) = daemon.set_running() {
        log::error!("{}", e);
    } else if let Err(e) = emit_event(
        app_handle,
        DevWebPenEvent::DaemonStateChanged(daemon.state.clone()),
    ) {
        log::error!("{}", e);
    }
}

fn set_daemon_ws_out(
    app_handle: &AppHandle,
    ws_out: SplitSink<WebSocketStream<TcpStream>, Message>,
) {
    let state = app_handle.state::<Daemon>();
    let mut daemon = state.lock().unwrap();
    daemon.set_ws_out(ws_out);
}

async fn authenticate_daemon(
    ws_stream: WebSocketStream<TcpStream>,
    app_handle: &AppHandle,
) -> Result<
    (
        SplitSink<WebSocketStream<TcpStream>, Message>,
        SplitStream<WebSocketStream<TcpStream>>,
    ),
    Box<dyn Error>,
> {
    log::debug!("Authenticating daemon...");
    let (write, mut read) = ws_stream.split();

    let msg = timeout(Duration::from_secs(30), read.next()).await;

    if let Err(e) = msg {
        return Err(Box::new(e));
    }

    let msg = msg.unwrap();
    if let None = msg {
        return Err(Box::<dyn Error>::from("Failed to receive message"));
    }

    let msg = msg.unwrap();
    if let Err(e) = msg {
        return Err(Box::new(e));
    }

    let msg = msg.unwrap();

    if !msg.is_text() {
        return Err(Box::<dyn Error>::from("Received non-text message"));
    }

    let received_token = msg.to_text().unwrap();
    let state = app_handle.state::<Daemon>();
    let daemon = state.lock().unwrap();
    let token = daemon.get_token();

    if let None = token {
        return Err(Box::<dyn Error>::from("Token not set"));
    }

    let token = token.unwrap();

    if token.eq(received_token) {
        log::debug!("Daemon authenticated");
    } else {
        return Err(Box::<dyn Error>::from("Invalid token"));
    }

    return Ok((write, read));
}

async fn accept_connection(app_handle: AppHandle, stream: TcpStream) {
    log::debug!(
        "Incoming TCP connection from: {}",
        stream.peer_addr().unwrap()
    );

    set_daemon_connecting(&app_handle);

    let ws_stream = tokio_tungstenite::accept_async(stream).await;

    if let Err(e) = ws_stream {
        log::error!("Error during WebSocket handshake: {}", e);
        set_daemon_error(&app_handle, e.to_string());
        return;
    }

    log::debug!("WebSocket connection established");
    let result = authenticate_daemon(ws_stream.unwrap(), &app_handle).await;

    if let Err(e) = result {
        log::error!("Failed to authenticate daemon: {}", e);
        set_daemon_error(&app_handle, e.to_string());
        return;
    }

    set_daemon_running(&app_handle);

    let (write, mut read) = result.unwrap();

    set_daemon_ws_out(&app_handle, write);

    loop {
        let msg = read.next().await;

        if let None = msg {
            log::error!("Failed to receive message");
            set_daemon_error(&app_handle, "Failed to receive message".to_string());
            return;
        }

        let msg = msg.unwrap();

        if let Err(e) = msg {
            log::error!("Error while receiving message: {}", e);
            set_daemon_error(&app_handle, e.to_string());
            return;
        }

        let msg = msg.unwrap();
        log::debug!("Received message: {:?}", msg);
        // TODO: Handle messages
    }
}

pub async fn start_server(app_handle: AppHandle) {
    let addr = "127.0.0.1:8080".to_string();

    let try_socket = TcpListener::bind(&addr).await;

    if let Err(e) = try_socket {
        log::error!("Failed to bind to address {}: {}", addr, e);
        set_daemon_error(&app_handle, e.to_string());
        return;
    }

    let listener = try_socket.unwrap();
    log::debug!("Listening on: {}", addr);

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(accept_connection(app_handle.clone(), stream));
    }
}
