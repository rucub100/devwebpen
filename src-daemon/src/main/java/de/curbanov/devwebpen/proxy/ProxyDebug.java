package de.curbanov.devwebpen.proxy;

public interface ProxyDebug {
    boolean debug();

    void addRequest(SuspendedRequest<?> request);
}
