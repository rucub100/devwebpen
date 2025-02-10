package de.curbanov.devwebpen.proxy;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.Channel;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;

public final class ProxyServer {
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
    private Channel serverChannel;

    public boolean isRunning() {
        return serverChannel != null && serverChannel.isActive();
    }

    public CompletableFuture<Void> start(final int port) {
        CompletableFuture<Void> startFuture = new CompletableFuture<>();

        if (isRunning()) {
            startFuture.completeExceptionally(new IllegalStateException("Server is already running"));
        } else {
            CompletableFuture.runAsync(() -> {
                EventLoopGroup bossGroup = new NioEventLoopGroup(1);
                EventLoopGroup workerGroup = new NioEventLoopGroup();

                try {
                    ServerBootstrap b = new ServerBootstrap();
                    b.group(bossGroup, workerGroup)
                            .channel(NioServerSocketChannel.class)
                            .handler(new LoggingHandler(LogLevel.INFO))
                            .childHandler(new ProxyServerInitializer())
                            .childOption(ChannelOption.AUTO_READ, false);

                    ChannelFuture f = b.bind(port).sync();
                    serverChannel = f.channel();
                    startFuture.complete(null);
                    f.channel().closeFuture().sync();
                } catch (Throwable t) {
                    startFuture.completeExceptionally(t);
                    if (t instanceof InterruptedException) {
                        Thread.currentThread().interrupt();
                    }
                } finally {
                    workerGroup.shutdownGracefully();
                    bossGroup.shutdownGracefully();
                    serverChannel = null;
                }
            }, executor);
        }

        return startFuture;
    }

    public CompletableFuture<Void> stop() {
        CompletableFuture<Void> stopFuture = new CompletableFuture<>();

        if (serverChannel != null) {
            serverChannel.close().addListener((ChannelFutureListener) future -> {
                if (future.isSuccess()) {
                    stopFuture.complete(null);
                } else {
                    stopFuture.completeExceptionally(future.cause());
                }

                serverChannel = null;
            });
        } else {
            stopFuture.complete(null);
        }

        return stopFuture;
    }
}
