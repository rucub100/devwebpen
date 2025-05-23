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

import io.netty.channel.Channel;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.http.FullHttpRequest;

public class HttpRequestHandler extends ChannelInboundHandlerAdapter {
    private final Channel targetChannel;
    private final ProxyDebug proxyDebug;

    public HttpRequestHandler(Channel targetChannel, ProxyDebug proxyDebug) {
        this.targetChannel = targetChannel;
        this.proxyDebug = proxyDebug;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (proxyDebug.debug() && msg instanceof FullHttpRequest request) {
            // suspend the request
            ctx.channel().config().setAutoRead(false);
            proxyDebug.addRequest(new SuspendedRequest<>(request, ctx, targetChannel));
        } else {
            targetChannel.writeAndFlush(msg).addListener(ChannelFutureListener.CLOSE_ON_FAILURE);
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        TargetChannelHandler.closeOnFlush(targetChannel);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        // cause.printStackTrace();
        TargetChannelHandler.closeOnFlush(ctx.channel());
    }
}
