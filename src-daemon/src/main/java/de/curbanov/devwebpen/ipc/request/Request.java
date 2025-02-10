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
                    default:
                        throw new IllegalArgumentException("Unknown command: " + commandId);
                }
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
