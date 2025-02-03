package de.curbanov.devwebpen;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import de.curbanov.devwebpen.ipc.request.Request;
import de.curbanov.devwebpen.ipc.request.TextRequestHandler;

public class Processor implements TextRequestHandler {
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

    @Override
    public void onTextRequest(Request<?> request) {
        CompletableFuture.runAsync(
                () -> {
                    System.out.println("[" + Thread.currentThread().getName() + "]: " + "Request received");
                    System.out.println("[" + Thread.currentThread().getName() + "]: " + "Request: " + request);
                },
                executor);
    }
}
