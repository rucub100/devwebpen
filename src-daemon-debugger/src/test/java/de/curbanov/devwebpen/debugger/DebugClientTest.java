package de.curbanov.devwebpen.debugger;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.net.ServerSocket;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DebugClientTest {
    private final PrintStream originalOut = System.out;
    private final PrintStream originalErr = System.err;
    private final InputStream originalIn = System.in;

    private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
    private final ByteArrayOutputStream errContent = new ByteArrayOutputStream();

    private ServerSocket server;
    private Thread serverThread;

    @BeforeEach
    public void setUpStreams() throws IOException {
        System.setOut(new PrintStream(outContent));
        System.setErr(new PrintStream(errContent));
    }

    @BeforeEach
    public void setUpServer() throws IOException {
        server = new ServerSocket(4242);
        serverThread = new Thread(() -> {
            try {
                var socket = server.accept();
                // echo server
                socket.getInputStream().transferTo(socket.getOutputStream());
            } catch (IOException e) {
                if (!server.isClosed()) {
                    e.printStackTrace();
                }
            }
        });
        serverThread.start();
    }

    @AfterEach
    public void restoreSystemInputOutputError() {
        System.setIn(originalIn);
        System.setOut(originalOut);
        System.setErr(originalErr);
    }

    @AfterEach
    public void closeServer() throws IOException {
        server.close();
    }

    @Test
    public void testDebugClient() throws IOException, InterruptedException {
        // Simulate input
        String simulatedInput = "some-secret-token\n";
        System.setIn(new ByteArrayInputStream(simulatedInput.getBytes()));

        // Start the DebugClient
        DebugClient debugClient = new DebugClient(4242);
        debugClient.start();
        // Wait until input is processed by the threads
        Thread.sleep(Duration.ofMillis(100));

        // Verify the output
        String expectedOutput = "some-secret-token\n";
        assertEquals(expectedOutput, outContent.toString());
    }
}