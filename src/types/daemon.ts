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
