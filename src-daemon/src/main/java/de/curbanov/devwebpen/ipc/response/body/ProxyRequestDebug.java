package de.curbanov.devwebpen.ipc.response.body;

import java.nio.ByteBuffer;

import de.curbanov.devwebpen.ipc.response.AsTextOrBinary;

public class ProxyRequestDebug implements AsTextOrBinary {
    private final String id;
    private final String method;
    private final String uri;
    private final int totalRequests;

    public ProxyRequestDebug(String id, String method, String uri, int totalRequests) {
        this.id = id;
        this.method = method;
        this.uri = uri;
        this.totalRequests = totalRequests;
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
        return id + "\n" + method + "\n" + uri + "\n" + totalRequests;
    }

    @Override
    public ByteBuffer asBinary() {
        throw new UnsupportedOperationException("Unimplemented method 'asBinary'");
    }

}
