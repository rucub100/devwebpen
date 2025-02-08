package de.curbanov.devwebpen;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import de.curbanov.devwebpen.ipc.request.Command;
import de.curbanov.devwebpen.ipc.request.Request;
import de.curbanov.devwebpen.ipc.request.TextRequestHandler;
import de.curbanov.devwebpen.proxy.ProxyServer;

public class Processor implements TextRequestHandler {
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
    private final ProxyServer proxyServer = new ProxyServer(9090);

    @Override
    public void onTextRequest(Request<?> request) {
        CompletableFuture.runAsync(
                () -> {
                    switch (request.getHeader().getRequestType()) {
                        case COMMAND:
                            var command = (Command) request.getBody();
                            switch (command) {
                                case RESET:
                                    System.out.println("[Processor]: Resetting...");
                                    try {
                                        proxyServer.stop();
                                    } catch (InterruptedException e) {
                                        Thread.currentThread().interrupt();
                                    }
                                    break;
                                case START_PROXY:
                                    System.out.println("[Processor]: Starting proxy...");
                                    try {
                                        proxyServer.start();
                                    } catch (InterruptedException e) {
                                        Thread.currentThread().interrupt();
                                    }
                                    break;
                                case STOP_PROXY:
                                    System.out.println("[Processor]: Stopping proxy...");
                                    try {
                                        proxyServer.stop();
                                    } catch (InterruptedException e) {
                                        Thread.currentThread().interrupt();
                                    }
                                    break;

                                default:
                                    throw new IllegalArgumentException("[Processor]: Unknown command: " + command);
                            }
                            break;
                        default:
                            throw new IllegalArgumentException(
                                    "[Processor]: Unknown request type: " + request.getHeader().getRequestType());
                    }
                },
                executor);
    }
}
