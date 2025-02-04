const proxyState = {
  Stopped: "stopped",
  Running: "running",
  Error: "error",
} as const;

type ProxyStateKeys = keyof typeof proxyState;
export type ProxyState = (typeof proxyState)[ProxyStateKeys];

export type Proxy = {
  state: ProxyState;
  port: number;
  error: string | null;
};
