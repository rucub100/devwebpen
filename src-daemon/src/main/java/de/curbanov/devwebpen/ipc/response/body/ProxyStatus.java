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
package de.curbanov.devwebpen.ipc.response.body;

import java.nio.ByteBuffer;

import de.curbanov.devwebpen.ipc.response.AsTextOrBinary;

public class ProxyStatus implements AsTextOrBinary {
    private final State state;
    private final int port;
    private final boolean debug;
    private final ProxyRequestDebug[] suspended;
    private final String error;

    public ProxyStatus(State state, int port, boolean debug, ProxyRequestDebug[] suspended, String error) {
        this.state = state;
        this.port = port;
        this.debug = debug;
        this.suspended = suspended;
        this.error = error;
    }

    public static enum State {
        STOPPED,
        RUNNING,
        ERROR
    }

    @Override
    public boolean isText() {
        return true;
    }

    @Override
    public boolean isBinary() {
        return false;
    }

    @Override
    public String asText() {
        var port = this.port == -1 ? "" : String.valueOf(this.port);
        var debug = String.valueOf(this.debug);
        var error = this.error == null ? "" : this.error;
        var suspendedLength = String.valueOf(this.suspended.length);
        var suspended = new StringBuilder();
        for (var i = 0; i < this.suspended.length; i++) {
            suspended.append(this.suspended[i].asText());
            if (i < this.suspended.length - 1) {
                suspended.append("\n");
            }
        }
        return this.state.name() + "\n" + port + "\n" + debug + "\n" + suspendedLength + "\n" + suspended.toString()
                + "\n" + error;
    }

    @Override
    public ByteBuffer asBinary() {
        throw new UnsupportedOperationException("Unimplemented method 'asBinary'");
    }

}
