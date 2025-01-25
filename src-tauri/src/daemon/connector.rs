use futures_util::StreamExt;
use tauri::{AppHandle, Manager};
use tokio::net::{TcpListener, TcpStream};

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

    // TODO: authenticate the connection (token)
    // What is the protocol within websocket messages?
    let (write, read) = ws_stream.unwrap().split();
    if let Err(e) = read.forward(write).await {
        log::error!("Error: {}", e);
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
