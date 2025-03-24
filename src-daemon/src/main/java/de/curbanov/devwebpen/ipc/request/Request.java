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
package de.curbanov.devwebpen.ipc.request;

import java.io.Serializable;
import java.nio.ByteBuffer;

public class Request<T> implements Serializable {
    private static <T> Request<?> parseTextRequest(String data) {
        var result = RequestHeader.parseTextHeader(data);
        var header = result.header();
        var textBody = data.substring(result.bodyOffset());
        var body = parseTextBody(header, textBody);
        return new Request<>(header, body);
    }

    private static Object parseTextBody(RequestHeader header, String body) {
        switch (header.getRequestType()) {
            case COMMAND:
                final String[] bodyParts = body.split(":");
                final Command.CommandId commandId = Command.CommandId.valueOf(bodyParts[0]);
                switch (commandId) {
                    case RESET:
                        return Command.reset();
                    case START_PROXY:
                        return Command.startProxy(Integer.parseInt(bodyParts[1]));
                    case STOP_PROXY:
                        return Command.stopProxy();
                    case PROXY_DEBUG:
                        return Command.proxyDebug(Boolean.parseBoolean(bodyParts[1]));
                    case PROXY_FORWARD:
                        return Command.proxyForward(bodyParts[1]);
                    case PROXY_FORWARD_ALL:
                        return Command.proxyForwardAll();
                    case PROXY_DROP:
                        return Command.proxyDrop(bodyParts[1]);
                    case PROXY_DROP_ALL:
                        return Command.proxyDropAll();
                    default:
                        throw new IllegalArgumentException("Unknown command: " + commandId);
                }
            case HTTP_REQUEST:
                return HttpRequest.parse(body);
            default:
                throw new IllegalArgumentException("Unknown request type: " + header.getRequestType());
        }
    }

    private static Request<?> parseBinaryRequest(ByteBuffer data) {
        var result = RequestHeader.parseBinaryHeader(data);
        var header = result.header();
        var binaryBody = data.slice();
        binaryBody.position(result.bodyOffset());
        var body = parseBinaryBody(header, binaryBody);
        return new Request<>(header, body);
    }

    private static Object parseBinaryBody(RequestHeader header, ByteBuffer body) {
        throw new UnsupportedOperationException("Not implemented");
    }

    public static Request<?> parseRequest(String data) {
        return parseTextRequest(data);
    }

    public static Request<?> parseRequest(ByteBuffer data) {
        return parseBinaryRequest(data);
    }

    private final RequestHeader header;
    private final T body;

    private Request(RequestHeader header, T body) {
        this.header = header;
        this.body = body;
    }

    public RequestHeader getHeader() {
        return this.header;
    }

    public T getBody() {
        return this.body;
    }
}
