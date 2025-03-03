/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package de.curbanov.devwebpen.debugger;

import java.io.IOException;
import java.net.Socket;

public class DebugClient {
    private final int port;
    private Socket socket;
    private final int MAX_RETRIES = 20;
    private final int RETRY_DELAY_MS = 5000;

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
        int retryCount = 0;
        while (retryCount < MAX_RETRIES) {
            try {
                socket = new Socket("localhost", port);
                break;
            } catch (IOException e) {
                System.err.println("Failed to connect to the server. Retrying in " + RETRY_DELAY_MS + "ms...");
                try {
                    Thread.sleep(RETRY_DELAY_MS);
                } catch (InterruptedException e1) {
                    // ignore
                } finally {
                    retryCount++;
                }
            }
        }

        if (socket == null) {
            throw new IOException("Failed to connect to the server after " + MAX_RETRIES + " retries");
        }

        transferInputThread.start();
        transferOutputThread.start();
    }
}
