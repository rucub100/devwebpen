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

package de.curbanov.devwebpen.proxy.tls;

import javax.net.ssl.SSLException;

import io.netty.handler.ssl.ApplicationProtocolConfig;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.ApplicationProtocolConfig.Protocol;
import io.netty.handler.ssl.ApplicationProtocolConfig.SelectedListenerFailureBehavior;
import io.netty.handler.ssl.ApplicationProtocolConfig.SelectorFailureBehavior;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;

public class ProxyTls {
    private final String host;
    private final ApplicationProtocolConfig apConfig;

    private SslContext serverSslContext;
    private SslContext clientSslContext;

    public ProxyTls(final String host) {
        this.host = host;
        // HINT: For now we only support HTTP/1.1
        this.apConfig = new ApplicationProtocolConfig(
                Protocol.ALPN,
                SelectorFailureBehavior.FATAL_ALERT,
                SelectedListenerFailureBehavior.FATAL_ALERT,
                "http/1.1");
    }

    public SslContext getServerSslContext() throws SSLException {
        if (this.serverSslContext == null) {
            createServerSslContext();
        }

        return this.serverSslContext;
    }

    public SslContext getClientSslContext() throws SSLException {
        if (this.clientSslContext == null) {
            this.clientSslContext = SslContextBuilder
                    .forClient()
                    .trustManager(InsecureTrustManagerFactory.INSTANCE)
                    .applicationProtocolConfig(this.apConfig)
                    .build();
        }

        return this.clientSslContext;
    }

    private void createServerSslContext() throws SSLException {
        this.serverSslContext = SslContextBuilder
                .forServer(new ProxyX509KeyManager(host))
                .applicationProtocolConfig(this.apConfig)
                .build();
    }
}