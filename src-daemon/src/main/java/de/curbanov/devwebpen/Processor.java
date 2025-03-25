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

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import de.curbanov.devwebpen.apiclient.ApiClient;
import de.curbanov.devwebpen.apiclient.exceptions.InvalidUriException;
import de.curbanov.devwebpen.apiclient.exceptions.UnsupportedHttpMethodException;
import de.curbanov.devwebpen.apiclient.exceptions.UnsupportedHttpVersionException;
import de.curbanov.devwebpen.ipc.request.Command;
import de.curbanov.devwebpen.ipc.request.HttpRequest;
import de.curbanov.devwebpen.ipc.request.Request;
import de.curbanov.devwebpen.ipc.request.TextRequestHandler;
import de.curbanov.devwebpen.ipc.response.Response;
import de.curbanov.devwebpen.ipc.response.ResponseSender;
import de.curbanov.devwebpen.ipc.response.body.HttpRequestError;
import de.curbanov.devwebpen.ipc.response.body.ProxyRequestDebug;
import de.curbanov.devwebpen.ipc.response.body.ProxyStatus;
import de.curbanov.devwebpen.proxy.ProxyDebugHandler;
import de.curbanov.devwebpen.proxy.ProxyServer;
import de.curbanov.devwebpen.proxy.SuspendedRequest;

public class Processor implements TextRequestHandler, ProxyDebugHandler {
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
    private final ResponseSender responseSender;

    private final ProxyServer proxyServer = new ProxyServer(this);
    private final ApiClient apiClient = new ApiClient(executor);

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
                        case HTTP_REQUEST:
                            execHttpRequest(request);
                            break;
                        default:
                            throw new IllegalArgumentException(
                                    "[Processor]: Unknown request type: " + request.getHeader().getRequestType());
                    }
                },
                executor);
    }

    @Override
    public void onProxyDebug(SuspendedRequest<?> request) {
        var res = Response.createProxyStatus(createProxyStatus());
        responseSender.sendResponse(res);
    }

    private ProxyStatus createProxyStatus() {
        return createProxyStatus(null);
    }

    private ProxyStatus createProxyStatus(Throwable error) {
        return new ProxyStatus(
                error != null ? ProxyStatus.State.ERROR
                        : proxyServer.isRunning() ? ProxyStatus.State.RUNNING : ProxyStatus.State.STOPPED,
                proxyServer.isDebug(),
                proxyServer.getDebugRequests()
                        .map((req) -> new ProxyRequestDebug(req.getId().toString(), req.getMethod(), req.getUri()))
                        .toArray(ProxyRequestDebug[]::new),
                error != null ? error.getMessage() : null);
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
            case PROXY_DEBUG:
                if (command.getPayload() instanceof Boolean debug) {
                    execProxyDebugCommand(request, debug);
                } else {
                    throw new IllegalArgumentException("[Processor]: Invalid payload type for PROXY_DEBUG command");
                }
                break;
            case PROXY_FORWARD:
                if (command.getPayload() instanceof UUID id) {
                    execProxyForwardCommand(request, id);
                } else {
                    throw new IllegalArgumentException("[Processor]: Invalid payload type for PROXY_FORWARD command");
                }
                break;
            case PROXY_FORWARD_ALL:
                execProxyForwardAllCommand(request);
                break;
            case PROXY_DROP:
                if (command.getPayload() instanceof UUID id) {
                    execProxyDropCommand(request, id);
                } else {
                    throw new IllegalArgumentException("[Processor]: Invalid payload type for PROXY_DROP command");
                }
                break;
            case PROXY_DROP_ALL:
                execProxyDropAllCommand(request);
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
                        res = Response.createProxyStatus(
                                request.getHeader().getUuid(),
                                createProxyStatus(e));

                    } else {
                        System.out.println("[Processor]: Proxy stopped");
                        res = Response.createProxyStatus(
                                request.getHeader().getUuid(), createProxyStatus());
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
                        res = Response.createProxyStatus(
                                request.getHeader().getUuid(),
                                createProxyStatus(e));
                    } else {
                        System.out.println("[Processor]: Proxy started");
                        res = Response.createProxyStatus(
                                request.getHeader().getUuid(), createProxyStatus());
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
                res = Response.createProxyStatus(
                        request.getHeader().getUuid(),
                        createProxyStatus(e));
            } else {
                System.out.println("[Processor]: Proxy stopped");
                res = Response.createProxyStatus(
                        request.getHeader().getUuid(),
                        createProxyStatus());
            }
            responseSender.sendResponse(res);
        }, executor);
    }

    private void execProxyDebugCommand(Request<?> request, boolean debug) {
        System.out.println("[Processor]: Toggling proxy debug mode...");
        proxyServer.setDebug(debug);
        Response<ProxyStatus> res = Response.createProxyStatus(
                request.getHeader().getUuid(),
                createProxyStatus());
        responseSender.sendResponse(res);
    }

    private void execProxyForwardCommand(Request<?> request, UUID id) {
        System.out.println("[Processor]: Forwarding proxy request...");

        proxyServer.resume(id);

        Response<ProxyStatus> res = Response.createProxyStatus(
                request.getHeader().getUuid(),
                createProxyStatus());

        responseSender.sendResponse(res);
    }

    private void execProxyForwardAllCommand(Request<?> request) {
        System.out.println("[Processor]: Forwarding all proxy requests...");

        proxyServer.resumeAll();

        Response<ProxyStatus> res = Response.createProxyStatus(
                request.getHeader().getUuid(),
                createProxyStatus());

        responseSender.sendResponse(res);
    }

    private void execProxyDropCommand(Request<?> request, UUID id) {
        System.out.println("[Processor]: Droping proxy request...");

        proxyServer.drop(id);

        Response<ProxyStatus> res = Response.createProxyStatus(
                request.getHeader().getUuid(),
                createProxyStatus());

        responseSender.sendResponse(res);
    }

    private void execProxyDropAllCommand(Request<?> request) {
        System.out.println("[Processor]: Droping all proxy requests...");

        proxyServer.dropAll();

        Response<ProxyStatus> res = Response.createProxyStatus(
                request.getHeader().getUuid(),
                createProxyStatus());

        responseSender.sendResponse(res);
    }

    private void execHttpRequest(Request<?> request) {
        final HttpRequest httpRequest = (HttpRequest) request.getBody();
        apiClient.send(httpRequest).whenCompleteAsync((res, e) -> {
            if (e != null) {
                System.err.println("[Processor]: Error sending HTTP request");
                HttpRequestError httpRequestError;
                if (e instanceof UnsupportedHttpMethodException) {
                    httpRequestError = HttpRequestError.unsupportedHttpMethod(httpRequest.getId(), e.getMessage());
                } else if (e instanceof UnsupportedHttpVersionException) {
                    httpRequestError = HttpRequestError.unsupportedHttpVersion(httpRequest.getId(), e.getMessage());
                } else if (e instanceof InvalidUriException) {
                    httpRequestError = HttpRequestError.invalidUri(httpRequest.getId(), e.getMessage());
                } else {
                    httpRequestError = HttpRequestError.unknownError(httpRequest.getId(), e.getMessage());
                }
                responseSender
                        .sendResponse(Response.createHttpRequestError(request.getHeader().getUuid(), httpRequestError));
            } else {
                System.out.println("[Processor]: HTTP response received");
                responseSender.sendResponse(Response.createHttpResponse(request.getHeader().getUuid(), res));
            }
        }, executor);
    }
}
