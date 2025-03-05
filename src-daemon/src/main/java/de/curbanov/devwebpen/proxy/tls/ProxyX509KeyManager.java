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
 * 
 * Inspired by the ZAP Development Team.
 * https://github.com/zaproxy/zap-extensions/blob/main/addOns/network/src/main/java/org/zaproxy/addon/network/internal/cert/SniX509KeyManager.java
 */
package de.curbanov.devwebpen.proxy.tls;

import java.net.Socket;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.NoSuchAlgorithmException;
import java.security.Principal;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.time.Duration;

import javax.net.ssl.ExtendedSSLSession;
import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SNIHostName;
import javax.net.ssl.SNIServerName;
import javax.net.ssl.SSLEngine;
import javax.net.ssl.SSLSession;
import javax.net.ssl.StandardConstants;
import javax.net.ssl.X509ExtendedKeyManager;
import javax.net.ssl.X509KeyManager;

import io.netty.util.NetUtil;

public class ProxyX509KeyManager extends X509ExtendedKeyManager {
    // TODO: Store and load the root CA from a file
    private final static ServerCertificateGenerator generator = new ServerCertificateGenerator(
            CertificateUtils.createRootCaKeyStore(new CertConfig(Duration.ofDays(365))));

    private final String host;

    private X509KeyManager keyManager;

    public ProxyX509KeyManager(String host) {
        this.host = host;
    }

    @Override
    public String chooseEngineServerAlias(String keyType, Principal[] issuers, SSLEngine engine) {
        if (this.keyManager == null) {
            createKeyManager(engine);
        }

        return this.keyManager.chooseServerAlias(keyType, issuers, null);
    }

    @Override
    public String chooseServerAlias(String keyType, Principal[] issuers, Socket socket) {
        return null;
    }

    @Override
    public String chooseClientAlias(String[] keyType, Principal[] issuers, Socket socket) {
        return null;
    }

    @Override
    public String[] getServerAliases(String keyType, Principal[] issuers) {
        return null;
    }

    @Override
    public String[] getClientAliases(String keyType, Principal[] issuers) {
        return null;
    }

    @Override
    public X509Certificate[] getCertificateChain(String alias) {
        return this.keyManager.getCertificateChain(alias);
    }

    @Override
    public PrivateKey getPrivateKey(String alias) {
        return this.keyManager.getPrivateKey(alias);
    }

    private void createKeyManager(SSLEngine engine) {
        SSLSession session = engine.getHandshakeSession();
        String hostname = this.host;

        // use SNI hostname if available
        if (session instanceof ExtendedSSLSession) {
            for (SNIServerName serverName : ((ExtendedSSLSession) session).getRequestedServerNames()) {
                if (serverName.getType() == StandardConstants.SNI_HOST_NAME) {
                    hostname = ((SNIHostName) serverName).getAsciiName();
                }
            }
        }

        KeyManagerFactory keyManagerFactory;
        try {
            keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }

        final boolean hostnameIsIpAddress = isIpAddress(hostname);
        final CertData certData = hostnameIsIpAddress ? new CertData() : new CertData(hostname);
        if (hostnameIsIpAddress) {
            certData.addSubjectAlternativeName(
                    new CertData.Name(CertData.Name.IP_ADDRESS, hostname));
        }

        KeyStore ks = generator.generate(certData);
        try {
            keyManagerFactory.init(ks, CertificateUtils.getPassphrase());
        } catch (GeneralSecurityException e) {
            throw new RuntimeException(e);
        }

        final KeyManager[] keyManagers = keyManagerFactory.getKeyManagers();

        for (int i = 0; i < keyManagers.length; i++) {
            KeyManager keyManager = keyManagers[i];
            if (keyManager instanceof X509KeyManager) {
                this.keyManager = (X509KeyManager) keyManager;
            }
        }

    }

    private static boolean isIpAddress(String value) {
        return value != null
                && !value.isEmpty()
                && (NetUtil.isValidIpV4Address(value) || NetUtil.isValidIpV6Address(value));
    }
}
