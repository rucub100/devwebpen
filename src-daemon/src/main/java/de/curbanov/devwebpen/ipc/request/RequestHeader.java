package de.curbanov.devwebpen.ipc.request;

import java.io.Serializable;
import java.nio.ByteBuffer;
import java.util.stream.Stream;

public class RequestHeader implements Serializable {
    public static ParsedHeader parseTextHeader(String data) {
        final int headerLinesLimit = 2;
        final String[] headerLines = data.lines().limit(headerLinesLimit).toArray(String[]::new);
        final int bodyOffset = Stream.of(headerLines).mapToInt(line -> line.length()).sum();

        final RequestType requestType = RequestType.valueOf(headerLines[0]);
        final String uuid = headerLines[1];

        final RequestHeader header = new RequestHeader(requestType, uuid);

        return new ParsedHeader(header, bodyOffset);
    }

    public static ParsedHeader parseBinaryHeader(ByteBuffer data) {
        throw new UnsupportedOperationException("Not implemented");
    }

    private final RequestType requestType;
    private final String uuid;

    private RequestHeader(RequestType requestType, String uuid) {
        this.requestType = requestType;
        this.uuid = uuid;
    }

    public RequestType getRequestType() {
        return requestType;
    }

    public String getUuid() {
        return uuid;
    }
}
