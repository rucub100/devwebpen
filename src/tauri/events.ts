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
import { listen } from "@tauri-apps/api/event";
import { DaemonEvent } from "../types/daemon";
import { ViewStateEvent } from "../types/view-state";
import { EphemeralSessionEvent } from "../types/session";
import { ProjectEvent } from "../types/project";
import { ProxyEvent } from "../types/proxy";
import { ApiClientEvent } from "../types/api-client";

export type DevWebPenEvent =
  | DaemonEvent
  | ViewStateEvent
  | EphemeralSessionEvent
  | ProjectEvent
  | ProxyEvent
  | ApiClientEvent;

let listeners: Record<DevWebPenEvent, Set<(payload: any) => void>> = {
  "devwebpen://view-state-changed": new Set(),
  "devwebpen://daemon-state-changed": new Set(),
  "devwebpen://daemon-error": new Set(),
  "devwebpen://ephemeral-session-changed": new Set(),
  "devwebpen://project-changed": new Set(),
  "devwebpen://proxy-changed": new Set(),
  "devwebpen://api-client-changed": new Set(),
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
