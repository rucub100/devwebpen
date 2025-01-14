import { invoke } from "@tauri-apps/api/core";
import { ViewState } from "../types/view-state";

export enum DevWebPenCommand {
  Init = "init_view",
}

export async function invokeInit(): Promise<ViewState> {
  return invoke<ViewState>(DevWebPenCommand.Init);
}

export default DevWebPenCommand;
