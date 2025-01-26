package de.curbanov.devwebpen;

import java.util.Scanner;

import de.curbanov.devwebpen.controller.WebSocketController;

public class Main {
    public static void main(String[] args) {
        debug();
    }

    public static void run() {
        System.out.println("Daemon started");

        Scanner scanner = new Scanner(System.in);
        var token = scanner.nextLine();
        WebSocketController webSocketController = new WebSocketController(token);

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
}