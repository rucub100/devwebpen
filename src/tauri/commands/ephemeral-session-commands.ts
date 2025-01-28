import { invoke } from "@tauri-apps/api/core";
import { Session } from "../../types/session";

export enum EphemeralSessionCommand {
  GetEphemeralSession = "get_ephemeral_session",
  StartEphemeralSession = "start_ephemeral_session",
}

export async function getEphemeralSession(): Promise<Session | null> {
  return invoke<Session | null>(EphemeralSessionCommand.GetEphemeralSession);
}

export async function startEphemeralSession(): Promise<Session> {
  return invoke<Session>(EphemeralSessionCommand.StartEphemeralSession);
}
