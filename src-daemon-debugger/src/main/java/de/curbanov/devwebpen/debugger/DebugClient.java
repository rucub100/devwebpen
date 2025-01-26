package de.curbanov.devwebpen.debugger;

import java.io.IOException;
import java.net.Socket;

public class DebugClient {
    private final int port;
    private Socket socket;

    private final Thread transferInputThread = new Thread(() -> {
        try {
            System.in.transferTo(socket.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    });

    private final Thread transferOutputThread = new Thread(() -> {
        try {
            socket.getInputStream().transferTo(System.out);
        } catch (IOException e) {
            e.printStackTrace();
        }
    });

    public DebugClient(int port) {
        this.port = port;
    }

    public Thread getTransferInputThread() {
        return transferInputThread;
    }

    public Thread getTransferOutputThread() {
        return transferOutputThread;
    }

    public void start() throws IOException {
        socket = new Socket("localhost", port);
        transferInputThread.start();
        transferOutputThread.start();
    }
}
