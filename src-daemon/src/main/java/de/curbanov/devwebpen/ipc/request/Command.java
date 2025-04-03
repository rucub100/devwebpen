/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package de.curbanov.devwebpen.ipc.request;

import java.util.UUID;

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
        PROXY_DEBUG,
        PROXY_FORWARD,
        PROXY_FORWARD_ALL,
        PROXY_DROP,
        PROXY_DROP_ALL,
        PROXY_SUSPENDED_CONTENT,
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

    public static Command<Boolean> proxyDebug(boolean debug) {
        return new Command<>(CommandId.PROXY_DEBUG, debug);
    }

    public static Command<UUID> proxyForward(String id) {
        return new Command<>(CommandId.PROXY_FORWARD, UUID.fromString(id));
    }

    public static Command<Void> proxyForwardAll() {
        return new Command<>(CommandId.PROXY_FORWARD_ALL, null);
    }

    public static Command<UUID> proxyDrop(String id) {
        return new Command<>(CommandId.PROXY_DROP, UUID.fromString(id));
    }

    public static Command<Void> proxyDropAll() {
        return new Command<>(CommandId.PROXY_DROP_ALL, null);
    }

    public static Command<UUID> proxySuspendedContent(String id) {
        return new Command<>(CommandId.PROXY_SUSPENDED_CONTENT, UUID.fromString(id));
    }
}
