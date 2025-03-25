package de.curbanov.devwebpen.proxy;

import java.util.UUID;

import io.netty.channel.Channel;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.util.ReferenceCountUtil;

public class SuspendedRequest<T> {
    private final UUID id = UUID.randomUUID();
    private final T request;
    private final ChannelHandlerContext ctx;
    private final Channel targetChannel;

    private boolean resumed = false;

    public SuspendedRequest(T request, ChannelHandlerContext ctx, Channel targetChannel) {
        this.request = request;
        this.ctx = ctx;
        this.targetChannel = targetChannel;
    }

    public UUID getId() {
        return id;
    }

    public T getRequest() {
        return request;
    }

    public String getMethod() {
        if (request instanceof FullHttpRequest fullHttpRequest) {
            return fullHttpRequest.method().name();
        }

        throw new IllegalStateException("Request is not a FullHttpRequest");
    }

    public String getUri() {
        if (request instanceof FullHttpRequest fullHttpRequest) {
            return fullHttpRequest.headers().get(HttpHeaderNames.HOST) + fullHttpRequest.uri();
        }

        throw new IllegalStateException("Request is not a FullHttpRequest");
    }

    public void resume() {
        if (resumed) {
            return;
        }

        resumed = true;

        if (!targetChannel.isActive() || !ctx.channel().isActive()) {
            ReferenceCountUtil.release(request);
            return;
        }

        ctx.executor().execute(() -> {
            targetChannel.writeAndFlush(request).addListener(ChannelFutureListener.CLOSE_ON_FAILURE);
            ctx.channel().config().setAutoRead(true);
        });
    }

    public void drop() {
        if (resumed) {
            return;
        }

        resumed = true;

        if (!ctx.channel().isActive()) {
            ReferenceCountUtil.release(request);
            return;
        }

        ctx.executor().execute(() -> {
            ctx.channel().config().setAutoRead(true);
            ReferenceCountUtil.release(request);
        });
    }

    public boolean isClosed() {
        return resumed || !ctx.channel().isActive() || !targetChannel.isActive();
    }
}
