package de.curbanov.webpen.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.concurrent.CompletableFuture;

public class WebSocketController implements WebSocket.Listener {
    private final Thread parentThread = Thread.currentThread();

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final CompletableFuture<WebSocket> cfWebSocket;
    private WebSocket webSocket;

    public WebSocketController() {
        this.cfWebSocket = httpClient.newWebSocketBuilder().buildAsync(URI.create("ws://127.0.0.1:8080/"),
                this);
        this.cfWebSocket.thenAccept(webSocket -> {
            this.webSocket = webSocket;
            System.out.println("[" + Thread.currentThread().getName() + "]: " + "WebSocket connected");
        }).exceptionally(error -> {
            System.err.println("[" + Thread.currentThread().getName() + "]: " + "WebSocket connection failed");
            error.printStackTrace();
            parentThread.interrupt();
            return null;
        });
    }

}
