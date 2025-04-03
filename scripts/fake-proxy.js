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

/**
 * This script creates a simple TCP server using Node.js that acts as a fake proxy.
 * It is used to test and debug client connections to a proxy server.
 * If there is an issue with the real proxy, this fake proxy can be used to inspect
 * the traffic from the client and help debug the initial connection request issue.
 *
 * The server listens on port 9090 and logs incoming data, connection end events,
 * and errors to the console.
 */
import { createServer } from "node:net";

const server = createServer((socket) => {
  socket.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  socket.on("end", () => {
    console.log("\n");
    console.log("******************************");
    console.log("**    CONNECTION ENDED      **");
    console.log("******************************");
    console.log("\n");
  });

  socket.on("error", (err) => {
    console.log("\n");
    console.log("******************************");
    console.log("**       ERROR OCCURRED     **");
    console.log("******************************");
    console.error("Request error:", err);
    console.log("\n");
  });
});

server.listen(9090, "127.0.0.1", 100, () => {
  const address = server.address();
  console.log(`Server is listening on ${address.address}:${address.port}`);
});
