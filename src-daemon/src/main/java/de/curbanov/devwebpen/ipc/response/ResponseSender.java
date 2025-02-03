package de.curbanov.devwebpen.ipc.response;

public interface ResponseSender {
    void sendResponse(Response<?> response);
}
