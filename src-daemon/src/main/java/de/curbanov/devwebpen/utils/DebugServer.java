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
