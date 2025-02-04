import { listen } from "@tauri-apps/api/event";
import { DaemonEvent } from "../types/daemon";

export type DevWebPenEvent = DaemonEvent;

let listeners: Record<DevWebPenEvent, Set<(payload: any) => void>> = {
  "devwebpen://daemon-state-changed": new Set(),
  "devwebpen://daemon-error": new Set(),
};

interface Subscription {
  event: DevWebPenEvent;
  unsubscribe: () => void;
}

export function subscribe(
  event: DevWebPenEvent,
  callback: (payload: any) => void
): Subscription {
  listeners[event].add(callback);

  return {
    event,
    unsubscribe: () => listeners[event].delete(callback),
  };
}

// register tauri event listeners
(Object.keys(listeners) as DevWebPenEvent[]).forEach((event) => {
  listen(event, ({ payload }) => {
    listeners[event].forEach((callback) => callback(payload));
  });
});

export default DevWebPenEvent;
