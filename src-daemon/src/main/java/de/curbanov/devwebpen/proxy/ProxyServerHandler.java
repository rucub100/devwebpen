package de.curbanov.devwebpen.proxy;

import java.security.InvalidParameterException;
import java.util.Optional;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelOption;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.HttpResponse;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.HttpVersion;
import io.netty.handler.codec.http.DefaultHttpResponse;

public class ProxyServerHandler extends ChannelInboundHandlerAdapter {
    private Channel targetChannel;

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        ctx.pipeline().addBefore("proxyHandler", "httpCodec", new HttpServerCodec());
        ctx.pipeline().addBefore("proxyHandler", "httpAggregator", new HttpObjectAggregator(0));
        ctx.channel().read();
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpRequest httpRequest) {
            if (httpRequest.method() == HttpMethod.CONNECT) {
                final String[] uriParts = httpRequest.uri().split(":");
                if (uriParts.length == 2) {
                    final String host = uriParts[0];
                    try {
                        final int port = Integer.parseInt(uriParts[1]);
                        if (port != 443) {
                            throw new NumberFormatException("Invalid port, expected 443");
                        }

                        bootstrapTargetConnection(ctx, host, port);
                    } catch (NumberFormatException e) {
                        handleBadRequest(ctx, Optional.of(e));
                    }
                } else {
                    handleBadRequest(ctx, Optional.of(new InvalidParameterException("Invalid URI")));
                }
            } else {
                handleBadRequest(ctx, Optional.of(new IllegalArgumentException(
                        "Invalid HTTP method " + httpRequest.method() + httpRequest.uri())));
            }
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

    private void bootstrapTargetConnection(ChannelHandlerContext ctx, String host, int port) {
        Bootstrap b = new Bootstrap();
        b.group(ctx.channel().eventLoop())
                .channel(NioSocketChannel.class)
                .handler(new TargetChannelHandler(ctx))
                .option(ChannelOption.AUTO_READ, false);

        ChannelFuture targetConnectFuture = b.connect(host, port);
        targetChannel = targetConnectFuture.channel();

        targetConnectFuture.addListener((ChannelFutureListener) future -> {
            if (future.isSuccess()) {
                handleConnectionEstablished(ctx);
                targetChannel.config().setAutoRead(true);
            } else {
                handleBadGateway(ctx, Optional.of(future.cause()));
            }
        });
    }

    private void handleConnectionEstablished(ChannelHandlerContext ctx) {
        HttpResponse res = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK);
        ctx.writeAndFlush(res).addListener(future -> {
            if (future.isSuccess()) {
                ctx.pipeline().remove("httpCodec");
                ctx.pipeline().remove("httpAggregator");
                ctx.pipeline().replace(this, "tunnelHandler", new TunnelHandler(targetChannel));
                ctx.channel().config().setAutoRead(true);
            } else {
                ctx.close();
            }
        });
    }

    private void handleBadGateway(ChannelHandlerContext ctx, Optional<Throwable> e) {
        if (e.isPresent()) {
            e.get().printStackTrace();
        }

        HttpResponse res = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.BAD_GATEWAY);
        ctx.writeAndFlush(res).addListener(ChannelFutureListener.CLOSE);
    }

    private void handleBadRequest(ChannelHandlerContext ctx, Optional<Throwable> e) {
        if (e.isPresent()) {
            e.get().printStackTrace();
        }

        HttpResponse res = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.BAD_REQUEST);
        ctx.writeAndFlush(res).addListener(ChannelFutureListener.CLOSE);
    }
}
