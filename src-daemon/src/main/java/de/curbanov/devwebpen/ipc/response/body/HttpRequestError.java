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

import de.curbanov.devwebpen.ipc.response.AsTextOrBinary;

public class HttpRequestError implements AsTextOrBinary {
    private final String requestId;
    private final int errorCode;
    private final String errorMessage;

    private HttpRequestError(String requestId, int errorCode, String errorMessage) {
        this.requestId = requestId;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    public static HttpRequestError unknownError(final String requestId, final String message) {
        return new HttpRequestError(requestId, 0, message);
    }

    public static HttpRequestError unsupportedHttpVersion(final String requestId, final String message) {
        return new HttpRequestError(requestId, 1, message);
    }

    public static HttpRequestError unsupportedHttpMethod(final String requestId, final String message) {
        return new HttpRequestError(requestId, 2, message);
    }

    public static HttpRequestError invalidUri(final String requestId, final String message) {
        return new HttpRequestError(requestId, 3, message);
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
        return requestId + "\n" + errorCode + "\n" + errorMessage;
    }

    @Override
    public ByteBuffer asBinary() {
        throw new UnsupportedOperationException("Unimplemented method 'asBinary'");
    }

}
