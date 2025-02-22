package de.curbanov.devwebpen.apiclient;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

import de.curbanov.devwebpen.apiclient.exceptions.InvalidUriException;
import de.curbanov.devwebpen.apiclient.exceptions.UnsupportedHttpMethodException;
import de.curbanov.devwebpen.apiclient.exceptions.UnsupportedHttpVersionException;

public class ApiClient {
    private final ExecutorService executor;
    private final HttpClient http11Client = HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1).build();
    private final HttpClient http2Client = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();

    public ApiClient(ExecutorService executor) {
        this.executor = executor;
    }

    public CompletableFuture<de.curbanov.devwebpen.ipc.response.body.HttpResponse> send(
            final de.curbanov.devwebpen.ipc.request.HttpRequest request) {
        final CompletableFuture<de.curbanov.devwebpen.ipc.response.body.HttpResponse> future = new CompletableFuture<>();

        CompletableFuture.runAsync(() -> {
            // parse HTTP version
            HttpClient client;
            final String httpVersion = request.getHttpVersion();
            switch (httpVersion) {
                case "HTTP/1.1":
                    client = http11Client;
                    break;
                case "HTTP/2":
                    client = http2Client;
                    break;
                default:
                    future.completeExceptionally(
                            new UnsupportedHttpVersionException("Unsupported HTTP version " + httpVersion));
                    return;
            }

            // validate URI with params
            URI uri;
            try {
                final String[] pathParts = request.getPath().split("\\?");

                request.getPathParams().forEach((name, value) -> {
                    pathParts[0] = pathParts[0].replaceAll(":" + name, value);
                });

                final String path = pathParts[0];
                final String queryParams = pathParts.length > 1
                        ? String.join("?", Arrays.copyOfRange(pathParts, 1, pathParts.length - 1))
                        : "";
                final StringBuilder pathWithParams = new StringBuilder(
                        path + (queryParams.isBlank() ? "" : "?" + queryParams));

                final String[] names = request.getQueryParams().sequencedKeySet().toArray(new String[0]);
                for (int i = 0; i < names.length; i++) {
                    final List<String> values = request.getQueryParams().get(names[i]);
                    for (int j = 0; j < values.size(); j++) {
                        if (j == 0 && i == 0) {
                            pathWithParams.append(queryParams.isBlank() ? "" : "&");
                        } else {
                            pathWithParams.append("&");
                        }

                        pathWithParams.append(names[i]);
                        pathWithParams.append("=");
                        pathWithParams.append(values.get(j));
                    }
                }

                String uriString = request.getScheme() + "://" + request.getAuthority() + pathWithParams.toString();
                uri = URI.create(uriString);
            } catch (Exception e) {
                future.completeExceptionally(new InvalidUriException(e.getMessage()));
                return;
            }

            // build client specific request
            HttpRequest.Builder clientRequestBuilder = HttpRequest.newBuilder(uri);
            clientRequestBuilder.timeout(Duration.ofSeconds(10));
            try {
                clientRequestBuilder.method(request.getMethod(),
                        BodyPublishers.ofByteArray(request.getBody().orElse(new byte[0])));
            } catch (Exception e) {
                future.completeExceptionally(new UnsupportedHttpMethodException(e.getMessage()));
                return;
            }
            request.getHeaders().forEach((name, values) -> {
                values.forEach(value -> clientRequestBuilder.header(name, value));
            });
            HttpRequest clientRequest = clientRequestBuilder.build();

            // send request
            HttpResponse<byte[]> clientResponse;
            final long startTime = System.currentTimeMillis();
            try {
                clientResponse = client.send(clientRequest, BodyHandlers.ofByteArray());
            } catch (Exception e) {
                future.completeExceptionally(e);
                return;
            }
            final long responseTimeMs = System.currentTimeMillis() - startTime;

            // build response
            final String requestId = request.getId();
            final int status = clientResponse.statusCode();
            final de.curbanov.devwebpen.ipc.response.body.HttpResponse.IdNameValue[] headers = clientResponse.headers()
                    .map().entrySet().stream()
                    .map(entry -> new de.curbanov.devwebpen.ipc.response.body.HttpResponse.IdNameValue(
                            entry.getKey(), entry.getKey(), entry.getValue().get(0)))
                    .toArray(de.curbanov.devwebpen.ipc.response.body.HttpResponse.IdNameValue[]::new);
            final long responseSizeBytes = clientResponse.body().length;
            final Optional<byte[]> body = clientResponse.body().length == 0 ? Optional.empty()
                    : Optional.of(clientResponse.body());
            de.curbanov.devwebpen.ipc.response.body.HttpResponse response = new de.curbanov.devwebpen.ipc.response.body.HttpResponse(
                    requestId, status, httpVersion.toString(), headers, responseTimeMs, responseSizeBytes, body);
            future.complete(response);
        }, executor);

        return future;
    }
}
