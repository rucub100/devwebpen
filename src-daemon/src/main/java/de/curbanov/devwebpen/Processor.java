package de.curbanov.devwebpen;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import de.curbanov.devwebpen.ipc.request.Request;
import de.curbanov.devwebpen.ipc.request.TextRequestHandler;

public class Processor implements TextRequestHandler {
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

    @Override
    public void onTextRequest(Request<?> request) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
