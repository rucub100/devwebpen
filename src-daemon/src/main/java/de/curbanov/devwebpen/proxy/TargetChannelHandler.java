package de.curbanov.devwebpen.proxy;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.util.ReferenceCountUtil;

public class TargetChannelHandler extends ChannelInboundHandlerAdapter {
    private final ChannelHandlerContext sourceCtx;

    public TargetChannelHandler(ChannelHandlerContext sourceCtx) {
        this.sourceCtx = sourceCtx;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof ByteBuf) {
            ByteBuf backendData = (ByteBuf) msg;
            sourceCtx.writeAndFlush(backendData.retain()).addListener((ChannelFutureListener) future -> {
                if (!future.isSuccess()) {
                    ctx.channel().close();
                }
            });
        } else {
            ReferenceCountUtil.release(msg);
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        TargetChannelHandler.closeOnFlush(sourceCtx.channel());
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        TargetChannelHandler.closeOnFlush(ctx.channel());
    }

    public static void closeOnFlush(Channel ch) {
        if (ch != null && ch.isActive()) {
            ch.writeAndFlush(Unpooled.EMPTY_BUFFER).addListener(ChannelFutureListener.CLOSE);
        }
    }
}
