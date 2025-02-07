package de.curbanov.devwebpen.proxy;

import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.util.ReferenceCountUtil;

public class TunnelHandler extends ChannelInboundHandlerAdapter {
    private final Channel targetChannel;

    public TunnelHandler(Channel targetChannel) {
        this.targetChannel = targetChannel;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        try {
            if (msg instanceof ByteBuf data) {
                targetChannel.writeAndFlush(data.retain()).addListener(ChannelFutureListener.CLOSE_ON_FAILURE);
            }
        } finally {
            ReferenceCountUtil.release(msg);
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        TargetChannelHandler.closeOnFlush(targetChannel);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        TargetChannelHandler.closeOnFlush(ctx.channel());
    }
}
