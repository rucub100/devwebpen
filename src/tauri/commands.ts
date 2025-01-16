import { invoke } from "@tauri-apps/api/core";
import { Navigation, ViewState } from "../types/view-state";

export enum DevWebPenCommand {
  InitView = "init_view",
  NavigateTo = "navigate_to",
  CloseTab = "close_tab",
  SelectTab = "select_tab",
}

export async function initView(): Promise<ViewState> {
  return invoke<ViewState>(DevWebPenCommand.InitView);
}

export async function navigateTo(navigation: Navigation): Promise<ViewState> {
  return invoke<ViewState>(DevWebPenCommand.NavigateTo, { navigation });
}

export async function closeTab(id: number): Promise<ViewState> {
  return invoke<ViewState>(DevWebPenCommand.CloseTab, { id });
}

export async function selectTab(id: number): Promise<ViewState | null> {
  return invoke<ViewState>(DevWebPenCommand.SelectTab, { id });
}

export default DevWebPenCommand;
