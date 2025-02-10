package de.curbanov.devwebpen.ipc.response;

import java.io.Serializable;
import java.nio.ByteBuffer;

public class ResponseHeader implements Serializable, AsTextOrBinary {
    private final String requestUuid;
    private final ResponseType responseType;

    public ResponseHeader(String requestUuid, ResponseType responseType) {
        this.requestUuid = requestUuid;
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
