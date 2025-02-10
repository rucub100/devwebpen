package de.curbanov.devwebpen.ipc;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.net.http.WebSocket.Listener;
import java.nio.ByteBuffer;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

import de.curbanov.devwebpen.ipc.request.Request;
import de.curbanov.devwebpen.ipc.request.TextRequestHandler;
import de.curbanov.devwebpen.ipc.response.Response;
import de.curbanov.devwebpen.ipc.response.ResponseSender;

public class WebSocketController implements WebSocket.Listener, ResponseSender {
    private final String token;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private CompletableFuture<WebSocket> cfWebSocket;
    private volatile WebSocket webSocket;

    private TextRequestHandler textRequestHandler = null;

    private StringBuilder text = new StringBuilder();

    public WebSocketController(String token) {
        this.token = token;
    }

    public void start(TextRequestHandler textRequestHandler) {
        this.textRequestHandler = textRequestHandler;

        this.cfWebSocket = httpClient.newWebSocketBuilder().buildAsync(URI.create("ws://127.0.0.1:8080/"),
                this);
        this.cfWebSocket.thenAccept(webSocket -> {
            this.webSocket = webSocket;
            System.out.println("[WebSocketController]: WebSocket connected");
        }).exceptionally(error -> {
            System.err.println("[WebSocketController]: WebSocket connection failed");
            error.printStackTrace();
            return null;
        });
    }

    @Override
    public void onOpen(WebSocket webSocket) {
        System.out.println("[WebSocketController]: WebSocket opened");
        // send token for authentication
        webSocket.sendText(token, true);
        Listener.super.onOpen(webSocket);
    }

    @Override
    public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
        System.out.println("[WebSocketController]: Text message received");

        text.append(data);
        if (last) {
            try {
                var request = Request.parseRequest(text.toString());
                if (textRequestHandler != null) {
                    textRequestHandler.onTextRequest(request);
                }
            } catch (Exception e) {
                System.err.println("[WebSocketController]: Error parsing text message");
            } finally {
                text = new StringBuilder();
            }
        }

        return Listener.super.onText(webSocket, data, last);

    }

    @Override
    public CompletionStage<?> onBinary(WebSocket webSocket, ByteBuffer data, boolean last) {
        System.out.println("[WebSocketController]: Binary message received");
        return Listener.super.onBinary(webSocket, data, last);
    }

    @Override
    public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) {
        System.out.println("[WebSocketController]: WebSocket closed");
        return Listener.super.onClose(webSocket, statusCode, reason);
    }

    @Override
    public void onError(WebSocket webSocket, Throwable error) {
        System.err.println("[WebSocketController]: WebSocket error");
        Listener.super.onError(webSocket, error);
    }

    @Override
    public CompletionStage<?> onPing(WebSocket webSocket, ByteBuffer message) {
        System.out.println("[WebSocketController]: Ping message received");
        return Listener.super.onPing(webSocket, message);
    }

    @Override
    public CompletionStage<?> onPong(WebSocket webSocket, ByteBuffer message) {
        System.out.println("[WebSocketController]: Pong message received");
        return Listener.super.onPong(webSocket, message);
    }

    public void stop() {
        if (webSocket != null) {
            webSocket.sendClose(WebSocket.NORMAL_CLOSURE, "Client closed").thenRun(() -> {
                System.out.println("[WebSocketController]: WebSocket closed");
            });
        }
    }

    @Override
    public void sendResponse(Response<?> response) {
        if (webSocket != null) {
            if (response.isBinary()) {
                var data = response.asBinary();
                synchronized (webSocket) {
                    webSocket.sendBinary(data, true);
                }
            } else if (response.isText()) {
                var text = response.asText();
                synchronized (webSocket) {
                    webSocket.sendText(text, true);
                }
            } else {
                throw new IllegalArgumentException("Unsupported response body type");
            }
        } else {
            throw new IllegalStateException("WebSocket is not connected");
        }
    }
}
