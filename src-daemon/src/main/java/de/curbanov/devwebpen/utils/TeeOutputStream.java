package de.curbanov.devwebpen.utils;

import java.io.IOException;
import java.io.OutputStream;

public class TeeOutputStream extends OutputStream {
    private final Iterable<OutputStream> outputStreams;

    public TeeOutputStream(Iterable<OutputStream> outputStreams) {
        this.outputStreams = outputStreams;
    }

    @Override
    public void write(int b) throws IOException {
        for (OutputStream outputStream : outputStreams) {
            outputStream.write(b);
        }
    }

    @Override
    public void flush() throws IOException {
        for (OutputStream outputStream : outputStreams) {
            outputStream.flush();
        }
    }

    @Override
    public void close() throws IOException {
        for (OutputStream outputStream : outputStreams) {
            outputStream.close();
        }
    }
}
