# Proxy (MITM)

## Overview

The [Proxy (MITM)](../src-daemon\src\main\java\de\curbanov\devwebpen\proxy\ProxyServer.java) is a Man-In-The-Middle proxy server designed to intercept and manipulate HTTP/HTTPS traffic. It is built using Netty and supports SSL/TLS termination and initiation.

## Roadmap/Features

- Intercept HTTP/HTTPS traffic
- SSL/TLS termination and initiation
- Customizable certificate generation
- Logging of traffic

## Netty channel pipelines

### 1. Proxy CONNECT (initial proxy connection for HTTPS)

|  Source  |     |                     |     |                      |     |                    |     |
| :------: | :-: | :-----------------: | :-: | :------------------: | --- | :----------------: | :-: |
| Inbound  | ->  | HttpRequestDecoder  | ->  | HttpObjectAggregator | ->  | ProxyServerHandler | ->  |
| Outbound | <-  | HttpResponseEncoder | <-  | -------------------- | <-  | ------------------ | <-  |

> Note: HTTP connections (non-TLS) are not supported; They are regular HTTP request but with absolute-form URI.

### 2. Blind forward proxy

|  Source  |     |               |  /  |                      |     |  Server  |
| :------: | :-: | :-----------: | :-: | :------------------: | :-: | :------: |
| Inbound  | ->  | TunnelHandler | <>  |                      | ->  | Outbound |
| Outbound | <-  |               | <>  | TargetChannelHandler | <-  | Inbound  |

### 3. MITM Proxy (HTTP/1.1)

|  Source  |     |                    |     | (Optional) |     |   HttpServerCodec   |    Interception     |     |                      |     |    Interception    |  /  |                          |     |   HttpClientCodec   |     |            |     |  Server  |
| :------: | :-: | :----------------: | :-: | :--------: | :-: | :-----------------: | :-----------------: | :-: | :------------------: | :-: | :----------------: | :-: | :----------------------: | :-: | :-----------------: | :-: | :--------: | :-: | :------: |
| Inbound  | ->  | OptionalSslHandler | ->  | SslHandler | ->  | HttpRequestDecoder  | ------------------- | ->  | HttpObjectAggregator | ->  | **RequestHandler** | <>  |                          | ->  | HttpRequestEncoder  | ->  | SslHandler | ->  | Outbound |
| Outbound | <-  | ------------------ | <-  | SslHandler | <-  | HttpResponseEncoder | **ResponseHandler** | <-  | HttpObjectAggregator | <-  |  ---------------   | <>  | **TargetChannelHandler** | <-  | HttpResponseDecoder | <-  | SslHandler | <-  | Inbound  |
