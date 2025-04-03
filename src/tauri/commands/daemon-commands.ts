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
import { invoke } from "@tauri-apps/api/core";
import { DaemonState } from "../../types/daemon";

enum DaemonCommand {
  GetDaemonState = "get_daemon_state",
  GetDaemonError = "get_daemon_error",
  RestartDaemon = "restart_daemon",
}

export async function getDaemonState(): Promise<DaemonState> {
  return invoke<DaemonState>(DaemonCommand.GetDaemonState);
}

export async function getDaemonError(): Promise<string | null> {
  return invoke<string | null>(DaemonCommand.GetDaemonError);
}

export async function restartDaemon(): Promise<void> {
  return invoke(DaemonCommand.RestartDaemon);
}
