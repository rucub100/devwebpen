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
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import de.curbanov.devwebpen.ipc.response.AsTextOrBinary;
import io.netty.handler.codec.http.FullHttpRequest;

public class ProxySuspendedRequest implements AsTextOrBinary {
    private final String id;
    private final String protocolVersion;
    private final String method;
    private final String uri;
    private final List<Map.Entry<String, String>> headers;
    private final String content;

    public ProxySuspendedRequest(String id, String protocolVersion, String method, String uri) {
        this.id = id;
        this.protocolVersion = protocolVersion;
        this.method = method;
        this.uri = uri;
        this.headers = null;
        this.content = null;
    }

    public ProxySuspendedRequest(String id, FullHttpRequest request) {
        this.id = id;
        this.protocolVersion = request.protocolVersion().text();
        this.method = request.method().name();
        this.uri = request.uri();
        this.headers = Stream.concat(
                request.headers().entries().stream(),
                request.trailingHeaders().entries().stream()).collect(Collectors.toUnmodifiableList());
        this.content = request.content().toString(StandardCharsets.UTF_8);
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
        StringBuilder sb = new StringBuilder();

        sb.append(id);
        sb.append("\n");
        sb.append(protocolVersion);
        sb.append("\n");
        sb.append(method);
        sb.append("\n");
        sb.append(uri);

        if (headers != null || content != null) {
            sb.append("\n");
        }

        if (headers != null) {
            sb.append(headers.size());
            sb.append("\n");
            for (Map.Entry<String, String> header : headers) {
                sb.append(header.getKey());
                sb.append(": ");
                sb.append(header.getValue());
                sb.append("\n");
            }
        }

        if (content != null) {
            sb.append(content);
        }

        return sb.toString();
    }

    @Override
    public ByteBuffer asBinary() {
        throw new UnsupportedOperationException("Unimplemented method 'asBinary'");
    }

}
