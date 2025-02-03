package de.curbanov.devwebpen.ipc.request;

import java.io.Serializable;
import java.nio.ByteBuffer;
import java.util.stream.Stream;

public class RequestHeader implements Serializable {
    public static ParsedHeader parseTextHeader(String data) {
        final int headerLinesLimit = 2;
        final String[] headerLines = data.lines().limit(headerLinesLimit).toArray(String[]::new);
        final int bodyOffset = Stream.of(headerLines).mapToInt(line -> line.length()).sum();

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
