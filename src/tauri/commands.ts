import { invoke } from "@tauri-apps/api/core";
import { Navigation, ViewState } from "../types/view-state";

export enum DevWebPenCommand {
  InitView = "init_view",
  Navigation = "navigation",
}

export async function initView(): Promise<ViewState> {
  return invoke<ViewState>(DevWebPenCommand.InitView);
}

export async function navigate(navigation: Navigation): Promise<ViewState> {
  return invoke<ViewState>(DevWebPenCommand.Navigation, { navigation });
}

export default DevWebPenCommand;
