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
package de.curbanov.devwebpen.ipc.response.body;

import java.nio.ByteBuffer;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import de.curbanov.devwebpen.ipc.response.AsTextOrBinary;

public class HttpResponse implements AsTextOrBinary {
    private final String requestId;
    private final int status;
    private final String httpVersion;
    private final LinkedHashMap<String, List<String>> headers;
    private final long responseTimeMs;
    private final long responseSizeBytes;
    private final Optional<byte[]> body;

    public static record IdNameValue(String id, String name, String value) {
    }

    public HttpResponse(
            String requestId,
            int status,
            String httpVersion,
            LinkedHashMap<String, List<String>> headers,
            long responseTimeMs,
            long responseSizeBytes,
            Optional<byte[]> body) {
        this.requestId = requestId;
        this.status = status;
        this.httpVersion = httpVersion;
        this.headers = headers;
        this.responseTimeMs = responseTimeMs;
        this.responseSizeBytes = responseSizeBytes;
        this.body = body;
    }

    @Override
    public boolean isText() {
        return true;
    }

    @Override
    public boolean isBinary() {
        return false;
    }

    @Override
    public String asText() {
        final StringBuilder text = new StringBuilder();

        text.append(requestId).append("\n");
        text.append(status).append("\n");
        text.append(httpVersion).append("\n");
        text.append(headers.values().stream().collect(Collectors.summingInt(value -> value.size())))
                .append("\n");

        final String headersText = headers.entrySet().stream()
                .map((entry) -> entry.getValue().stream()
                        .map((value) -> entry.getKey() + ":" + value + "\n")
                        .collect(Collectors.joining()))
                .collect(Collectors.joining());
        text.append(headersText);
        if (!headersText.endsWith("\n")) {
            text.append("\n");
        }

        text.append(responseTimeMs).append("\n");
        text.append(responseSizeBytes).append("\n");

        if (body.isPresent()) {
            final byte[] bodyBytes = body.get();
            text.append(Base64.getEncoder().encodeToString(bodyBytes));
        }

        return text.toString();
    }

    @Override
    public ByteBuffer asBinary() {
        throw new UnsupportedOperationException("Unimplemented method 'asBinary'");
    }

}
