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

use super::Daemon;

fn set_daemon_error(app: &AppHandle, error: String) {
    let state = app.state::<Daemon>();
    let mut daemon = state.lock().unwrap();

    daemon.set_error(error.to_string());
}

fn set_daemon_connecting(app: &AppHandle) {
    let state = app.state::<Daemon>();
    let mut daemon = state.lock().unwrap();

    if let Err(e) = daemon.set_connecting() {
        log::error!("{}", e);
    }
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

    // TODO: loop for result read stream and store write sink in the daemon state for later use
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
