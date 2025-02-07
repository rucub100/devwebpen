package de.curbanov.devwebpen.proxy;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.logging.LoggingHandler;

public class ProxyServerInitializer extends ChannelInitializer<SocketChannel> {
    @Override
    public void initChannel(SocketChannel ch) throws Exception {
        ch.pipeline().addLast("logging", new LoggingHandler());
        ch.pipeline().addLast("proxyHandler", new ProxyServerHandler());
    }
}
