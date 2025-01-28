import { listen } from "@tauri-apps/api/event";
import { DaemonState } from "../types/daemon";

export enum DevWebPenEvent {
  DaemonStateChanged = "devwebpen://daemon-state-changed",
  DaemonError = "devwebpen://daemon-error",
}

type DevWebPenEventCallback<E extends DevWebPenEvent> =
  E extends DevWebPenEvent.DaemonStateChanged
    ? (state: DaemonState) => void
    : E extends DevWebPenEvent.DaemonError
    ? (error: string) => void
    : never;

let listeners: Map<
  DevWebPenEvent,
  Set<DevWebPenEventCallback<DevWebPenEvent>>
> = new Map();

interface Subscription {
  event: DevWebPenEvent;
  unsubscribe: () => void;
}

export function subscribe<E extends DevWebPenEvent>(
  event: E,
  callback: DevWebPenEventCallback<E>
): Subscription {
  const eventListeners =
    listeners.get(event) ?? listeners.set(event, new Set()).get(event)!;

  eventListeners.add(callback);

  return {
    event,
    unsubscribe: () => eventListeners.delete(callback),
  };
}

// register tauri event listeners
Object.values(DevWebPenEvent).forEach((devWebPenEvent) => {
  listen<Parameters<DevWebPenEventCallback<typeof devWebPenEvent>>[0]>(
    devWebPenEvent,
    (event) => {
      listeners
        .get(devWebPenEvent)
        ?.forEach((listener: DevWebPenEventCallback<typeof devWebPenEvent>) =>
          listener(event.payload as any)
        );
    }
  );
});

export default DevWebPenEvent;
