package de.curbanov.devwebpen.proxy;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.Channel;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;

public final class ProxyServer {
    private final int port;

    private Channel serverChannel;

    public ProxyServer(int port) {
        this.port = port;
    }

    public void start() throws InterruptedException {
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();

        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ProxyServerInitializer())
                    .childOption(ChannelOption.AUTO_READ, false);

            ChannelFuture f = b.bind(port).sync();
            System.out.println("[ProxyServer]: Proxy server started on port " + port);
            serverChannel = f.channel();
            f.channel().closeFuture().sync();
        } finally {
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
        }
    }

    public void stop() throws InterruptedException {
        if (serverChannel != null) {
            System.out.println("[ProxyServer]: Stopping proxy server...");
            serverChannel.close().sync();
            System.out.println("[ProxyServer]: Proxy server stopped");
        }
    }
}
