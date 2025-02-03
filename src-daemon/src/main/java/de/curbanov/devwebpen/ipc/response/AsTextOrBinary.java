package de.curbanov.devwebpen.ipc.response;

import java.nio.ByteBuffer;

public interface AsTextOrBinary {
    boolean isText();

    boolean isBinary();

    String asText();

    ByteBuffer asBinary();
}
