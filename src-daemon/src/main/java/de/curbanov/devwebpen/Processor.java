package de.curbanov.devwebpen;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import de.curbanov.devwebpen.ipc.request.Command;
import de.curbanov.devwebpen.ipc.request.Request;
import de.curbanov.devwebpen.ipc.request.TextRequestHandler;
import de.curbanov.devwebpen.ipc.response.Response;
import de.curbanov.devwebpen.ipc.response.ResponseSender;
import de.curbanov.devwebpen.ipc.response.body.ProxyStatus;
import de.curbanov.devwebpen.proxy.ProxyServer;

public class Processor implements TextRequestHandler {
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
    private final ResponseSender responseSender;

    private final ProxyServer proxyServer = new ProxyServer();

    public Processor(ResponseSender responseSender) {
        this.responseSender = responseSender;
    }

    @Override
    public void onTextRequest(Request<?> request) {
        CompletableFuture.runAsync(
                () -> {
                    switch (request.getHeader().getRequestType()) {
                        case COMMAND:
                            execCommand(request);
                            break;
                        default:
                            throw new IllegalArgumentException(
                                    "[Processor]: Unknown request type: " + request.getHeader().getRequestType());
                    }
                },
                executor);
    }

    private void execCommand(Request<?> request) {
        var command = (Command<?>) request.getBody();
        switch (command.getCommandId()) {
            case RESET:
                execResetCommand(request);
                break;
            case START_PROXY:
                if (command.getPayload() instanceof Integer port) {
                    execStartProxyCommand(request, port);
                } else {
                    throw new IllegalArgumentException("[Processor]: Invalid payload type for START_PROXY command");
                }
                break;
            case STOP_PROXY:
                execStopProxyCommand(request);
                break;

            default:
                throw new IllegalArgumentException("[Processor]: Unknown command: " + command);
        }
    }

    private void execResetCommand(Request<?> request) {
        System.out.println("[Processor]: Resetting...");

        proxyServer.stop()
                .whenCompleteAsync((_, e) -> {
                    Response<ProxyStatus> res;
                    if (e != null) {
                        System.err.println("[Processor]: Error stopping proxy");
                        res = Response.createProxyStatus(request.getHeader().getUuid(),
                                ProxyStatus.error(e.getMessage()));

                    } else {
                        System.out.println("[Processor]: Proxy stopped");
                        res = Response.createProxyStatus(request.getHeader().getUuid(), ProxyStatus.stopped());
                    }
                    responseSender.sendResponse(res);
                }, executor);
    }

    private void execStartProxyCommand(Request<?> request, int port) {
        System.out.println("[Processor]: Starting proxy...");

        proxyServer.start(port)
                .whenCompleteAsync((_, e) -> {
                    Response<ProxyStatus> res;
                    if (e != null) {
                        System.err.println("[Processor]: Error starting proxy");
                        res = Response.createProxyStatus(request.getHeader().getUuid(),
                                ProxyStatus.error(e.getMessage()));
                    } else {
                        System.out.println("[Processor]: Proxy started");
                        res = Response.createProxyStatus(request.getHeader().getUuid(), ProxyStatus.running(port));
                    }
                    responseSender.sendResponse(res);
                }, executor);
    }

    private void execStopProxyCommand(Request<?> request) {
        System.out.println("[Processor]: Stopping proxy...");

        proxyServer.stop().whenCompleteAsync((_, e) -> {
            Response<ProxyStatus> res;
            if (e != null) {
                System.err.println("[Processor]: Error stopping proxy");
                res = Response.createProxyStatus(request.getHeader().getUuid(),
                        ProxyStatus.error(e.getMessage()));
            } else {
                System.out.println("[Processor]: Proxy stopped");
                res = Response.createProxyStatus(request.getHeader().getUuid(), ProxyStatus.stopped());
            }
            responseSender.sendResponse(res);
        }, executor);
    }
}
