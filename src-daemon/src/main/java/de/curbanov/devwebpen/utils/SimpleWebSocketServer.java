package de.curbanov.devwebpen.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

public class SimpleWebSocketServer implements AutoCloseable {
    private final int port;
    private ServerSocket serverSocket;
    private Socket client;
    private BufferedReader in;
    private OutputStream out;

    public SimpleWebSocketServer(int port) {
        this.port = port;
    }

    public void start() throws IOException {
        stop();

        serverSocket = new ServerSocket(port);
        handshake(serverSocket.accept());
    }

    public void stop() throws IOException {
        try {
            if (serverSocket != null)
                serverSocket.close();
        } finally {
            try {
                if (client != null)
                    client.close();
            } finally {
                serverSocket = null;
                client = null;
                in = null;
                out = null;
            }
        }
    }

    public void sendText(String text) throws IOException {
        byte[] payload = text.getBytes(StandardCharsets.UTF_8);
        int payloadLength = payload.length;

        int frameHeader = 0x81;
        out.write(frameHeader);

        if (payloadLength < 126) {
            out.write(payloadLength);
        } else if (payloadLength < 65536) {
            out.write(126);
            out.write((payloadLength >> 8) & 0xFF);
            out.write(payloadLength & 0xFF);
        } else {
            out.write(127);
            out.write(0);
            out.write(0);
            out.write(0);
            out.write(0);
            out.write((payloadLength >> 56) & 0xFF);
            out.write((payloadLength >> 48) & 0xFF);
            out.write((payloadLength >> 40) & 0xFF);
            out.write((payloadLength >> 32) & 0xFF);
            out.write((payloadLength >> 24) & 0xFF);
            out.write((payloadLength >> 16) & 0xFF);
            out.write((payloadLength >> 8) & 0xFF);
            out.write(payloadLength & 0xFF);
        }

        out.write(payload);
        out.flush();
    }

    private void handshake(Socket client) throws IOException {
        this.client = client;
        this.in = new BufferedReader(new InputStreamReader(client.getInputStream()));
        this.out = client.getOutputStream();

        String secKey = null;
        String line;
        while ((line = in.readLine()) != null && !line.isEmpty()) {
            if (line.startsWith("Sec-WebSocket-Key:")) {
                secKey = line.substring(line.indexOf(":") + 2).trim();
                break;
            }
        }

        if (secKey == null) {
            throw new RuntimeException("Invalid handshake");
        }

        String acceptKey = generateAcceptKey(secKey);

        String response = "HTTP/1.1 101 Switching Protocols\r\n" +
                "Upgrade: websocket\r\n" +
                "Connection: Upgrade\r\n" +
                "Sec-WebSocket-Accept: " + acceptKey + "\r\n\r\n";

        out.write(response.getBytes(StandardCharsets.UTF_8));
        out.flush();
    }

    private String generateAcceptKey(String secKey) {
        String combined = secKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] hash = digest.digest(combined.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            e.printStackTrace(); // Handle exception appropriately
            return null;
        }
    }

    @Override
    public void close() throws Exception {
        stop();
    }
}
