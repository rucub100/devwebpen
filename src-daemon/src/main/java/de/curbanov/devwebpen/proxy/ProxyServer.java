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

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentLinkedQueue;
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

    private int port;

    private Channel serverChannel;

    private final ProxyDebugHandler debugHandler;
    private final ConcurrentLinkedQueue<SuspendedRequest<?>> suspendedRequests = new ConcurrentLinkedQueue<>();
    private boolean debug = false;
    private final ProxyDebug proxyDebug = new ProxyDebug() {
        @Override
        public boolean debug() {
            return debug;
        }

        @Override
        public void addRequest(SuspendedRequest<?> request) {
            suspendedRequests.add(request);
            debugHandler.onProxyDebug(request, suspendedRequests.size());
        }

    };

    public ProxyServer(ProxyDebugHandler debugHandler) {
        this.debugHandler = debugHandler;
    }

    public CompletableFuture<Void> start(final int port) {
        this.port = port;
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
                            .childHandler(new ProxyServerInitializer(proxyDebug))
                            .childOption(ChannelOption.AUTO_READ, false);

                    ChannelFuture f = b.bind(port).sync();
                    serverChannel = f.channel();
                    startFuture.complete(null);
                    serverChannel.closeFuture().sync();
                } catch (Throwable t) {
                    startFuture.completeExceptionally(t);
                    if (t instanceof InterruptedException) {
                        Thread.currentThread().interrupt();
                    }
                } finally {
                    workerGroup.shutdownGracefully();
                    bossGroup.shutdownGracefully();
                    serverChannel = null;
                    debug = false;
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

    public boolean isRunning() {
        return serverChannel != null && serverChannel.isActive();
    }

    public int getPort() {
        return this.port;
    }

    public boolean isDebug() {
        return debug;
    }

    public void setDebug(boolean debug) {
        this.debug = debug;

        if (!debug) {
            for (SuspendedRequest<?> request : suspendedRequests) {
                request.resume();
            }

            suspendedRequests.clear();
        }
    }
}
