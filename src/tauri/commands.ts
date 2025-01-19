import { invoke } from "@tauri-apps/api/core";
import { NavView, ViewState } from "../types/view-state";
import { Session } from "../types/session";

export enum DevWebPenCommand {
  InitView = "init_view",
  NavigateTo = "navigate_to",
  CloseTab = "close_tab",
  SelectTab = "select_tab",
  OpenWelcome = "open_welcome",
  GetEphemeralSession = "get_ephemeral_session",
  StartEphemeralSession = "start_ephemeral_session",
}

export async function initView(): Promise<ViewState> {
  return invoke<ViewState>(DevWebPenCommand.InitView);
}

export async function navigateTo(
  navigation: NavView
): Promise<Partial<ViewState>> {
  return invoke<Partial<ViewState>>(DevWebPenCommand.NavigateTo, {
    navigation,
  });
}

export async function closeTab(id: number): Promise<Partial<ViewState>> {
  return invoke<Partial<ViewState>>(DevWebPenCommand.CloseTab, { id });
}

export async function selectTab(id: number): Promise<Partial<ViewState>> {
  return invoke<Partial<ViewState>>(DevWebPenCommand.SelectTab, { id });
}

export async function openWelcome(): Promise<Partial<ViewState>> {
  return invoke<Partial<ViewState>>(DevWebPenCommand.OpenWelcome);
}

export async function getEphemeralSession(): Promise<Session | null> {
  return invoke<Session | null>(DevWebPenCommand.GetEphemeralSession);
}

export async function startEphemeralSession(): Promise<Session> {
  return invoke<Session>(DevWebPenCommand.StartEphemeralSession);
}

export default DevWebPenCommand;
