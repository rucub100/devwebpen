use futures_util::StreamExt;
use tokio::net::{TcpListener, TcpStream};

async fn accept_connection(stream: TcpStream) {
    let ws_stream = tokio_tungstenite::accept_async(stream)
        .await
        .expect("Error during the websocket handshake occurred");

    let (write, read) = ws_stream.split();
    if let Err(e) = read.forward(write).await {
        eprintln!("Error: {}", e);
    }
}

async fn start_server() {
    let addr = "127.0.0.1:8080".to_string();

    let try_socket = TcpListener::bind(&addr).await;
    let listener = try_socket.expect("Failed to bind to address");

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(accept_connection(stream));
    }
}

pub fn start_connector() {
    tauri::async_runtime::spawn(start_server());
}
