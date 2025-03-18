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
package de.curbanov.devwebpen.ipc.response;

import java.io.Serializable;
import java.nio.ByteBuffer;
import java.util.UUID;

public class ResponseHeader implements Serializable, AsTextOrBinary {
    private final String requestUuid;
    private final ResponseType responseType;

    public ResponseHeader(String requestUuid, ResponseType responseType) {
        this.requestUuid = requestUuid;
        this.responseType = responseType;
    }

    public ResponseHeader(ResponseType responseType) {
        this.requestUuid = UUID.randomUUID().toString();
        this.responseType = responseType;
    }

    public String getRequestUuid() {
        return requestUuid;
    }

    public ResponseType getResponseType() {
        return responseType;
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
        return requestUuid + "\n" + responseType.name();
    }

    @Override
    public ByteBuffer asBinary() {
        throw new UnsupportedOperationException("Unimplemented method 'asBinary'");
    }
}
