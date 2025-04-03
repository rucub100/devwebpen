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
import { Session } from "../../types/session";

enum EphemeralSessionCommand {
  GetEphemeralSession = "get_ephemeral_session",
  StartEphemeralSession = "start_ephemeral_session",
  CloseEphemeralSession = "close_ephemeral_session",
}

export async function getEphemeralSession(): Promise<Session | null> {
  return invoke<Session | null>(EphemeralSessionCommand.GetEphemeralSession);
}

export async function startEphemeralSession(): Promise<Session> {
  return invoke<Session>(EphemeralSessionCommand.StartEphemeralSession);
}

export async function closeEphemeralSession(): Promise<Session> {
  return invoke<Session>(EphemeralSessionCommand.CloseEphemeralSession);
}
