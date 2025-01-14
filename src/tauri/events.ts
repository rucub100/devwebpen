export enum DevWebPenEvent {
  // Daemon events
  DaemonStopped = "devwebpen://daemon-stopped",
  DaemonStarting = "devwebpen://daemon-starting",
  DaemonConnecting = "devwebpen://daemon-connecting",
  DaemonRunning = "devwebpen://daemon-running",
  DaemonError = "devwebpen://daemon-error",
  // View events
  // TODO: Project events
}

export default DevWebPenEvent;
