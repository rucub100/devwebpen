import { listen } from "@tauri-apps/api/event";
import { DaemonEvent } from "../types/daemon";
import { ViewStateEvent } from "../types/view-state";
import { EphemeralSessionEvent } from "../types/session";
import { ProjectEvent } from "../types/project";
import { ProxyEvent } from "../types/proxy";

export type DevWebPenEvent =
  | DaemonEvent
  | ViewStateEvent
  | EphemeralSessionEvent
  | ProjectEvent
  | ProxyEvent;

let listeners: Record<DevWebPenEvent, Set<(payload: any) => void>> = {
  "devwebpen://view-state-changed": new Set(),
  "devwebpen://daemon-state-changed": new Set(),
  "devwebpen://daemon-error": new Set(),
  "devwebpen://ephemeral-session-changed": new Set(),
  "devwebpen://project-changed": new Set(),
  "devwebpen://proxy-changed": new Set(),
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
