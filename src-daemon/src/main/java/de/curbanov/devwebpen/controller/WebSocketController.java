package de.curbanov.devwebpen.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.net.http.WebSocket.Listener;
import java.nio.ByteBuffer;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class WebSocketController implements WebSocket.Listener {
    private final String token;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final CompletableFuture<WebSocket> cfWebSocket;
    private WebSocket webSocket;

    public WebSocketController(String token) {
        this.token = token;
        this.cfWebSocket = httpClient.newWebSocketBuilder().buildAsync(URI.create("ws://127.0.0.1:8080/"),
                this);
        this.cfWebSocket.thenAccept(webSocket -> {
            this.webSocket = webSocket;
            System.out.println("[" + Thread.currentThread().getName() + "]: " + "WebSocket connected");
        }).exceptionally(error -> {
            System.err.println("[" + Thread.currentThread().getName() + "]: " + "WebSocket connection failed");
            error.printStackTrace();
            return null;
        });
    }

    @Override
    public void onOpen(WebSocket webSocket) {
        System.out.println("[" + Thread.currentThread().getName() + "]: " + "WebSocket opened");
        // send token for authentication
        webSocket.sendText(token, true);
        Listener.super.onOpen(webSocket);
    }

    @Override
    public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
        System.out.println("[" + Thread.currentThread().getName() + "]: " + "Text message received");
        return Listener.super.onText(webSocket, data, last);
    }

    @Override
    public CompletionStage<?> onBinary(WebSocket webSocket, ByteBuffer data, boolean last) {
        System.out.println("[" + Thread.currentThread().getName() + "]: " + "Binary message received");
        return Listener.super.onBinary(webSocket, data, last);
    }

    @Override
    public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) {
        System.out.println("[" + Thread.currentThread().getName() + "]: " + "WebSocket closed");
        return Listener.super.onClose(webSocket, statusCode, reason);
    }

    @Override
    public void onError(WebSocket webSocket, Throwable error) {
        System.err.println("[" + Thread.currentThread().getName() + "]: " + "WebSocket error");
        Listener.super.onError(webSocket, error);
    }

    @Override
    public CompletionStage<?> onPing(WebSocket webSocket, ByteBuffer message) {
        System.out.println("[" + Thread.currentThread().getName() + "]: " + "Ping message received");
        return Listener.super.onPing(webSocket, message);
    }

    @Override
    public CompletionStage<?> onPong(WebSocket webSocket, ByteBuffer message) {
        System.out.println("[" + Thread.currentThread().getName() + "]: " + "Pong message received");
        return Listener.super.onPong(webSocket, message);
    }

    public void stop() {
        if (webSocket != null) {
            webSocket.sendClose(WebSocket.NORMAL_CLOSURE, "Client closed").thenRun(() -> {
                System.out.println("[" + Thread.currentThread().getName() + "]: " + "WebSocket closed");
            });
        }
    }
}
