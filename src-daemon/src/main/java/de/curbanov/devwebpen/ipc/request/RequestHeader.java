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
import java.util.stream.Stream;

public class RequestHeader implements Serializable {
    public static ParsedHeader parseTextHeader(String data) {
        final int headerLinesLimit = 2;
        final String[] headerLines = data.lines().limit(headerLinesLimit).toArray(String[]::new);
        final int bodyOffset = Stream.of(headerLines).mapToInt(line -> line.length() + 1).sum();

        final String uuid = headerLines[0];
        final RequestType requestType = RequestType.valueOf(headerLines[1]);

        final RequestHeader header = new RequestHeader(uuid, requestType);

        return new ParsedHeader(header, bodyOffset);
    }

    public static ParsedHeader parseBinaryHeader(ByteBuffer data) {
        throw new UnsupportedOperationException("Not implemented");
    }

    private final String uuid;
    private final RequestType requestType;

    private RequestHeader(String uuid, RequestType requestType) {
        this.uuid = uuid;
        this.requestType = requestType;
    }

    public RequestType getRequestType() {
        return requestType;
    }

    public String getUuid() {
        return uuid;
    }
}
