use futures_util::StreamExt;
use tokio::net::{TcpListener, TcpStream};

async fn accept_connection(stream: TcpStream) {
    log::debug!(
        "Incoming TCP connection from: {}",
        stream.peer_addr().unwrap()
    );

    let ws_stream = tokio_tungstenite::accept_async(stream)
        .await
        .expect("Error during the websocket handshake occurred");

    log::debug!("WebSocket connection established");

    let (write, read) = ws_stream.split();
    if let Err(e) = read.forward(write).await {
        log::error!("Error: {}", e);
    }
}

async fn start_server() {
    let addr = "127.0.0.1:8080".to_string();

    let try_socket = TcpListener::bind(&addr).await;
    let listener = try_socket.expect(format!("Failed to bind to address {}", addr).as_str());
    log::debug!("Listening on: {}", addr);

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(accept_connection(stream));
    }
}

pub fn start_connector() {
    log::debug!("Starting daemon connector...");
    tauri::async_runtime::spawn(start_server());
}
