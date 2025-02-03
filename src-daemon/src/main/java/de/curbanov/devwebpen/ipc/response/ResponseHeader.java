package de.curbanov.devwebpen.ipc.response;

import java.io.Serializable;
import java.nio.ByteBuffer;

public class ResponseHeader implements Serializable, AsTextOrBinary {
    private final String requestUuid;
    private final ResponseType responseType;

    private ResponseHeader(ResponseType responseType, String requestUuid) {
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
        // TODO: Add support for binary later
        return false;
    }

    @Override
    public String asText() {
        return requestUuid + "\n" + responseType.name() + "\n";
    }

    @Override
    public ByteBuffer asBinary() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'asBinary'");
    }
}
