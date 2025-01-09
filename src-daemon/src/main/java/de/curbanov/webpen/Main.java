package de.curbanov.webpen;

import de.curbanov.webpen.controller.WebSocketController;

public class Main {

    private static void addShutdownHook() {
        Thread currentThread = Thread.currentThread();
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            currentThread.interrupt();
        }));
    }

    private static void waitForInterruption() {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("Daemon started");
        addShutdownHook();

        WebSocketController controller = new WebSocketController();

        waitForInterruption();
        System.out.println("Daemon stopped");
    }
}