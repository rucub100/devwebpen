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
