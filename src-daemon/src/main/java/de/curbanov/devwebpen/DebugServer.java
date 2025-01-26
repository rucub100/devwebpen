package de.curbanov.devwebpen;

import java.io.IOException;
import java.io.PrintStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Arrays;

public class DebugServer implements AutoCloseable {
    private final int port;
    private ServerSocket serverSocket;
    Socket client;

    public DebugServer(int port) {
        this.port = port;
    }

    public void start() throws IOException {
        serverSocket = new ServerSocket(port);
        client = serverSocket.accept();

        System.setIn(client.getInputStream());

        var teeOutputStream = new TeeOutputStream(Arrays.asList(client.getOutputStream(), System.out));
        System.setOut(new PrintStream(teeOutputStream, true));
    }

    @Override
    public void close() throws Exception {
        serverSocket.close();
    }
}
