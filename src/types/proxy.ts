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
const proxyState = {
  Stopped: "stopped",
  Running: "running",
  Error: "error",
} as const;

type ProxyStateKeys = keyof typeof proxyState;
export type ProxyState = (typeof proxyState)[ProxyStateKeys];

export type SuspendedRequestHttpHeader = {
  id: string;
  name: string;
  value: string;
};

export type SuspendedRequest = {
  id: string;
  protocolVersion: string;
  method: string;
  uri: string;
  headers?: SuspendedRequestHttpHeader[];
  body?: Uint8Array;
};

export type Proxy = {
  state: ProxyState;
  port: number;
  debug: boolean;
  suspendedRequests: SuspendedRequest[];
  error: string | null;
};

const proxyEvents = {
  ProxyChanged: "devwebpen://proxy-changed",
} as const;

type ProxyEventKeys = keyof typeof proxyEvents;
export type ProxyEvent = (typeof proxyEvents)[ProxyEventKeys];
