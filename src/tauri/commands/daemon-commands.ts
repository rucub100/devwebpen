import { invoke } from "@tauri-apps/api/core";
import { DaemonState } from "../../types/daemon";

export enum DaemonCommand {
  GetDaemonState = "get_daemon_state",
  GetDaemonError = "get_daemon_error",
}

export async function getDaemonState(): Promise<DaemonState> {
  return invoke<DaemonState>(DaemonCommand.GetDaemonState);
}

export async function getDaemonError(): Promise<string | null> {
  return invoke<string | null>(DaemonCommand.GetDaemonError);
}
