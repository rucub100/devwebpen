package de.curbanov.devwebpen.ipc.response;

import java.io.Serializable;
import java.nio.ByteBuffer;

import de.curbanov.devwebpen.ipc.response.body.HttpRequestError;
import de.curbanov.devwebpen.ipc.response.body.HttpResponse;
import de.curbanov.devwebpen.ipc.response.body.ProxyStatus;

public class Response<T extends AsTextOrBinary> implements Serializable, AsTextOrBinary {
    public static <T extends AsTextOrBinary> Response<T> create(ResponseHeader header, T body) {
        return new Response<T>(header, body);
    }

    public static Response<ProxyStatus> createProxyStatus(String requestId, ProxyStatus body) {
        var header = new ResponseHeader(requestId, ResponseType.PROXY_STATUS);
        return new Response<>(header, body);
    }

    public static Response<HttpResponse> createHttpResponse(String requestId, HttpResponse body) {
        var header = new ResponseHeader(requestId, ResponseType.HTTP_RESPONSE);
        return new Response<>(header, body);
    }

    public static Response<HttpRequestError> createHttpRequestError(String requestId, HttpRequestError body) {
        var header = new ResponseHeader(requestId, ResponseType.HTTP_REQUEST_ERROR);
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
        return this.header.asText() + "\n" + this.body.asText();
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
