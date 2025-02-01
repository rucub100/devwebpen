const daemonState = {
  Stopped: "stopped",
  Starting: "starting",
  Connecting: "connecting",
  Running: "running",
  Error: "error",
} as const;

type DaemonStateKeys = keyof typeof daemonState;
export type DaemonState = (typeof daemonState)[DaemonStateKeys];
