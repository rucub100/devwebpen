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
package de.curbanov.devwebpen.proxy;

import java.security.InvalidParameterException;
import java.security.cert.CertificateException;
import java.util.Optional;

import javax.net.ssl.SSLException;

import de.curbanov.devwebpen.proxy.tls.ProxyTls;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.HttpResponse;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.HttpVersion;
import io.netty.handler.ssl.OptionalSslHandler;
import io.netty.handler.ssl.SslContext;
import io.netty.util.ReferenceCountUtil;
import io.netty.handler.codec.http.DefaultHttpResponse;
import io.netty.handler.codec.http.HttpClientCodec;

public class ProxyServerHandler extends ChannelInboundHandlerAdapter {
    private Channel targetChannel;

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        ctx.channel().read();
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        try {
            if (msg instanceof HttpRequest httpRequest) {
                // HINT: in rear cases a client may send a non TLS request to the proxy via
                // absolute-form URI; this is not supported by the proxy yet and will result in
                // a bad request response
                if (httpRequest.method() == HttpMethod.CONNECT) {
                    final String[] uriParts = httpRequest.uri().split(":");
                    if (uriParts.length == 2) {
                        final String host = uriParts[0];
                        try {
                            final int port = Integer.parseInt(uriParts[1]);
                            bootstrapTargetConnection(ctx, host, port);
                        } catch (NumberFormatException e) {
                            handleBadRequest(ctx, Optional.of(e));
                        } catch (SSLException | CertificateException e) {
                            handleBadGateway(ctx, Optional.of(e));
                        } catch (Exception e) {
                            handleProxyError(ctx, Optional.of(e));
                        }
                    } else {
                        handleBadRequest(ctx, Optional.of(new InvalidParameterException("Invalid URI")));
                    }
                } else {
                    handleBadRequest(ctx, Optional.of(new IllegalArgumentException(
                            "Invalid HTTP method " + httpRequest.method() + httpRequest.uri())));
                }
            }
        } finally {
            ReferenceCountUtil.release(msg);
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        if (targetChannel != null && targetChannel.isActive()) {
            TargetChannelHandler.closeOnFlush(targetChannel);
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        TargetChannelHandler.closeOnFlush(ctx.channel());
    }

    private void bootstrapTargetConnection(ChannelHandlerContext ctx, String host, int port)
            throws SSLException, CertificateException {
        ProxyTls tls = new ProxyTls(host);
        Bootstrap b = new Bootstrap();
        b.group(ctx.channel().eventLoop())
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ch.pipeline().addLast("ssl", tls.getClientSslContext().newHandler(ch.alloc(), host, port));
                        ch.pipeline().addLast("httpClientCodec", new HttpClientCodec());
                        ch.pipeline().addLast("targetChannelHandler", new TargetChannelHandler(ctx));
                    }
                })
                .option(ChannelOption.AUTO_READ, false)
                .option(ChannelOption.TCP_NODELAY, true);

        ChannelFuture targetConnectFuture = b.connect(host, port);
        targetChannel = targetConnectFuture.channel();

        targetConnectFuture.addListener((ChannelFutureListener) future -> {
            if (future.isSuccess()) {
                handleConnectionEstablished(ctx, tls.getServerSslContext());
            } else {
                handleBadGateway(ctx, Optional.of(future.cause()));
            }
        });
    }

    private void handleConnectionEstablished(ChannelHandlerContext ctx, SslContext sslCtx) {
        HttpResponse res = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK);
        ctx.writeAndFlush(res).addListener(future -> {
            if (future.isSuccess()) {
                // we must not reuse the http handlers from proxy initialization
                ctx.pipeline().remove("httpServerCodec");
                ctx.pipeline().remove("httpObjectAggregator");
                ctx.pipeline().addFirst("optionalSsl", new OptionalSslHandler(sslCtx));
                ctx.pipeline().replace(this, "request", new HttpRequestHandler(targetChannel));
                ctx.pipeline().addBefore("request", "httpObjectAggregator", new HttpObjectAggregator(1_048_576));
                ctx.pipeline().addBefore("httpObjectAggregator", "response", new HttpResponseHandler());
                ctx.pipeline().addBefore("response", "httpServerCodec", new HttpServerCodec());
                ctx.channel().config().setAutoRead(true);
                targetChannel.config().setAutoRead(true);
            } else {
                ctx.close();
                targetChannel.close();
            }
        });
    }

    private void handleBadGateway(ChannelHandlerContext ctx, Optional<Throwable> e) {
        HttpResponse res = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.BAD_GATEWAY);
        ctx.writeAndFlush(res).addListener(ChannelFutureListener.CLOSE);
    }

    private void handleBadRequest(ChannelHandlerContext ctx, Optional<Throwable> e) {
        HttpResponse res = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.BAD_REQUEST);
        ctx.writeAndFlush(res).addListener(ChannelFutureListener.CLOSE);
    }

    private void handleProxyError(ChannelHandlerContext ctx, Optional<Throwable> e) {
        HttpResponse res = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.INTERNAL_SERVER_ERROR);
        ctx.writeAndFlush(res).addListener(ChannelFutureListener.CLOSE);
    }
}
