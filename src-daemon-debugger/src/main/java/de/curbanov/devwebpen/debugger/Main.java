package de.curbanov.devwebpen.debugger;

import java.io.IOException;

public class Main {
    public static void main(String[] args) throws IOException {
        var debugClient = new DebugClient(4242);
        debugClient.start();
    }
}