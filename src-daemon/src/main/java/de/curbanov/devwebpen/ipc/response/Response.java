package de.curbanov.devwebpen.ipc.response;

import java.io.Serializable;
import java.nio.ByteBuffer;

public class Response<T extends AsTextOrBinary> implements Serializable, AsTextOrBinary {
    public static Response<?> create(ResponseHeader header, AsTextOrBinary body) {
        return new Response<>(header, body);
    }

    private final ResponseHeader header;
    private final T body;

    private Response(ResponseHeader header, T body) {
        this.header = header;
        this.body = body;
    }

    public ResponseHeader getHeader() {
        return this.header;
    }

    public T getBody() {
        return this.body;
    }

    @Override
    public boolean isText() {
        return this.header.isText() && this.body.isText();
    }

    @Override
    public boolean isBinary() {
        return this.header.isBinary() && this.body.isBinary();
    }

    @Override
    public String asText() {
        return this.header.asText() + this.body.asText();
    }

    @Override
    public ByteBuffer asBinary() {
        var header = this.header.asBinary();
        var body = this.body.asBinary();
        var data = ByteBuffer.allocate(header.remaining() + body.remaining());
        header.mark();
        body.mark();
        data.put(header);
        data.put(body);
        header.reset();
        body.reset();
        data.flip();

        return data;
    }
}
