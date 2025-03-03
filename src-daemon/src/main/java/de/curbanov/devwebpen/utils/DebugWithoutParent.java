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
