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

import java.net.URI;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;

public class HttpRequest {
    private final String id;
    private final String method;
    private final String scheme;
    private final String authority;
    private final String path;
    private final String httpVersion;
    private final LinkedHashMap<String, List<String>> queryParams;
    private final LinkedHashMap<String, String> pathParams;
    private final LinkedHashMap<String, List<String>> headers;
    private final Optional<byte[]> body;

    private HttpRequest(
            String id,
            String method,
            String scheme,
            String authority,
            String path,
            String httpVersion,
            LinkedHashMap<String, List<String>> queryParams,
            LinkedHashMap<String, String> pathParams,
            LinkedHashMap<String, List<String>> headers,
            Optional<byte[]> body) {
        this.id = id;
        this.method = method;
        this.scheme = scheme;
        this.authority = authority;
        this.path = path;
        this.httpVersion = httpVersion;
        this.queryParams = queryParams;
        this.pathParams = pathParams;
        this.headers = headers;
        this.body = body;
    }

    public final String getId() {
        return id;
    }

    public final String getMethod() {
        return method;
    }

    public final String getScheme() {
        return scheme;
    }

    public final String getAuthority() {
        return authority;
    }

    public final String getPath() {
        return path;
    }

    public final String getHttpVersion() {
        return httpVersion;
    }

    public final URI getURI() {
        return URI.create(scheme + "://" + authority + path);
    }

    public final LinkedHashMap<String, String> getPathParams() {
        return pathParams;
    }

    public final LinkedHashMap<String, List<String>> getQueryParams() {
        return queryParams;
    }

    public final LinkedHashMap<String, List<String>> getHeaders() {
        return headers;
    }

    public final Optional<byte[]> getBody() {
        return body;
    }

    public static HttpRequest parse(final String input) {
        int lineIndex = 0;
        final String[] lines = input.split("\n");
        final String id = lines[lineIndex++];
        final String method = lines[lineIndex++];
        final String scheme = lines[lineIndex++];
        final String authority = lines[lineIndex++];
        final String path = lines[lineIndex++];
        final String httpVersion = lines[lineIndex++];

        final int pathParamsCount = Integer.parseInt(lines[lineIndex++]);
        final LinkedHashMap<String, String> pathParams = new LinkedHashMap<>(pathParamsCount);
        for (int i = 0; i < pathParamsCount; i++) {
            final String[] parts = lines[lineIndex++].split(":");
            pathParams.put(parts[1], parts[2]);
        }
        if (pathParamsCount == 0) {
            lineIndex++;
        }

        final int queryParamsCount = Integer.parseInt(lines[lineIndex++]);
        final LinkedHashMap<String, List<String>> queryParams = new LinkedHashMap<>(queryParamsCount);
        for (int i = 0; i < queryParamsCount; i++) {
            final String[] parts = lines[lineIndex++].split(":");
            final List<String> values = queryParams.getOrDefault(parts[1], new ArrayList<>());
            values.add(parts[2]);
            queryParams.put(parts[1], values);
        }
        if (queryParamsCount == 0) {
            lineIndex++;
        }

        final int headersCount = Integer.parseInt(lines[lineIndex++]);
        final LinkedHashMap<String, List<String>> headers = new LinkedHashMap<>(headersCount);
        for (int i = 0; i < headersCount; i++) {
            final String[] parts = lines[lineIndex++].split(":");
            final List<String> values = headers.getOrDefault(parts[1], new ArrayList<>());
            values.add(parts[2]);
            headers.put(parts[1], values);
        }
        if (headersCount == 0) {
            lineIndex++;
        }

        // check if there is a body
        Optional<byte[]> body = Optional.empty();
        if (lineIndex < lines.length) {
            final String encodedBody = lines[lineIndex];
            final byte[] bodyBytes = Base64.getDecoder().decode(encodedBody);
            body = Optional.of(bodyBytes);
        }

        return new HttpRequest(id, method, scheme, authority, path, httpVersion, queryParams, pathParams, headers,
                body);
    }
}
