const daemonState = {
  Stopped: "stopped",
  Starting: "starting",
  Connecting: "connecting",
  Running: "running",
  Error: "error",
} as const;

type DaemonStateKeys = keyof typeof daemonState;
export type DaemonState = (typeof daemonState)[DaemonStateKeys];

const daemonEvents = {
  DaemonStateChanged: "devwebpen://daemon-state-changed",
  DaemonError: "devwebpen://daemon-error",
} as const;

type DaemonEventKeys = keyof typeof daemonEvents;
export type DaemonEvent = (typeof daemonEvents)[DaemonEventKeys];
