package de.curbanov.devwebpen.ipc.request;

public final class Command<T> {
    private final CommandId commandId;
    private final T payload;

    private Command(CommandId commandId, T payload) {
        this.commandId = commandId;
        this.payload = payload;
    }

    public CommandId getCommandId() {
        return commandId;
    }

    public T getPayload() {
        return payload;
    }

    public static enum CommandId {
        RESET,
        START_PROXY,
        STOP_PROXY,
    }

    public static Command<Void> reset() {
        return new Command<>(CommandId.RESET, null);
    }

    public static Command<Integer> startProxy(int port) {
        return new Command<>(CommandId.START_PROXY, port);
    }

    public static Command<Void> stopProxy() {
        return new Command<>(CommandId.STOP_PROXY, null);
    }
}
