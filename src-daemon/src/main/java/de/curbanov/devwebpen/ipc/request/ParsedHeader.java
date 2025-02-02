package de.curbanov.devwebpen.ipc.request;

public final record ParsedHeader(RequestHeader header, int bodyOffset) {
}
