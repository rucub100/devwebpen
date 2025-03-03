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
package de.curbanov.devwebpen;

import java.util.Scanner;

import de.curbanov.devwebpen.ipc.WebSocketController;
import de.curbanov.devwebpen.utils.DebugServer;
import de.curbanov.devwebpen.utils.DebugWithoutParent;

public class Main {
    public static void main(String[] args) {
        debug();
    }

    public static void run() {
        System.out.println("Daemon started");

        Scanner scanner = new Scanner(System.in);
        var token = scanner.nextLine();
        WebSocketController webSocketController = new WebSocketController(token);
        Processor processor = new Processor(webSocketController);
        webSocketController.start(processor);

        while (true) {
            var nextLine = scanner.nextLine();
            if (nextLine.equals("exit")) {
                scanner.close();
                webSocketController.stop();
                System.out.println("Daemon stopped");
                System.exit(0);
            }
        }
    }

    public static void debug() {
        try (DebugServer debugServer = new DebugServer(4242)) {
            debugServer.start();
            run();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void debug_wihout_parent() {
        try (DebugWithoutParent debugWithoutParent = new DebugWithoutParent(8080)) {
            debugWithoutParent.start();
            debugWithoutParent.websocket((ws) -> {
                try {
                    ws.sendText("FakeUUID\nCOMMAND\nSTART_PROXY");
                    // Thread.sleep(5000);
                    // ws.sendText("FakeUUID\nCOMMAND\nSTOP_PROXY");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
            run();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}