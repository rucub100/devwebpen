package de.curbanov.devwebpen.ipc.request;

@FunctionalInterface
public interface TextRequestHandler {
    void onTextRequest(Request<?> request);
}
