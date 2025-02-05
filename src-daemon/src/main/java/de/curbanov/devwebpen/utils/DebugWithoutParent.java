package de.curbanov.devwebpen.utils;

import java.io.IOException;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.io.PrintStream;
import java.util.function.Consumer;

public class DebugWithoutParent implements AutoCloseable {
    private final SimpleWebSocketServer webSocketServer;
    private volatile boolean running = false;
    private PrintStream in;

    public DebugWithoutParent(int port) {
        this.webSocketServer = new SimpleWebSocketServer(port);
    }

    public void start() throws IOException {
        new Thread(() -> {
            try {
                webSocketServer.start();
                running = true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();

        // Simulate stdin
        var pipedInputStream = new PipedInputStream();
        var pipedOutputStream = new PipedOutputStream(pipedInputStream);
        System.setIn(pipedInputStream);
        in = new PrintStream(pipedOutputStream, true);
        in.println("SomeFakeToken");
    }

    public void inputln(String text) {
        in.println(text);
    }

    public void websocket(Consumer<SimpleWebSocketServer> consumer) {
        new Thread(() -> {
            try {
                while (!running) {
                    Thread.sleep(100);
                }

                consumer.accept(webSocketServer);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    @Override
    public void close() throws Exception {
        this.webSocketServer.stop();
    }
}
