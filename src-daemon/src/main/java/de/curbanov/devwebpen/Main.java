package de.curbanov.devwebpen;

import java.util.Scanner;

import de.curbanov.devwebpen.ipc.WebSocketController;
import de.curbanov.devwebpen.utils.DebugServer;
import de.curbanov.devwebpen.utils.DebugWithoutParent;

public class Main {
    public static void main(String[] args) {
        debug_wihout_parent();
    }

    public static void run() {
        System.out.println("Daemon started");

        Scanner scanner = new Scanner(System.in);
        var token = scanner.nextLine();
        WebSocketController webSocketController = new WebSocketController(token);
        Processor processor = new Processor();
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