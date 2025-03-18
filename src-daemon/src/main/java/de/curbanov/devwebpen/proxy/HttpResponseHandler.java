package de.curbanov.devwebpen.proxy;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelOutboundHandlerAdapter;
import io.netty.channel.ChannelPromise;

public class HttpResponseHandler extends ChannelOutboundHandlerAdapter {
    private final ProxyDebug proxyDebug;

    public HttpResponseHandler(ProxyDebug proxyDebug) {
        this.proxyDebug = proxyDebug;
    }

    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
        // TODO msg is a FullHttpResponse
        super.write(ctx, msg, promise);
    }
}
