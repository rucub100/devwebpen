import { invoke } from "@tauri-apps/api/core";
import { NavView, ViewState } from "../../types/view-state";

export enum ViewCommand {
  InitView = "init_view",
  NavigateTo = "navigate_to",
  CloseTab = "close_tab",
  SelectTab = "select_tab",
  OpenWelcome = "open_welcome",
}

export async function initView(): Promise<ViewState> {
  return invoke<ViewState>(ViewCommand.InitView);
}

export async function navigateTo(
  navigation: NavView
): Promise<Partial<ViewState>> {
  return invoke<Partial<ViewState>>(ViewCommand.NavigateTo, {
    navigation,
  });
}

export async function closeTab(id: number): Promise<Partial<ViewState>> {
  return invoke<Partial<ViewState>>(ViewCommand.CloseTab, { id });
}

export async function selectTab(id: number): Promise<Partial<ViewState>> {
  return invoke<Partial<ViewState>>(ViewCommand.SelectTab, { id });
}

export async function openWelcome(): Promise<Partial<ViewState>> {
  return invoke<Partial<ViewState>>(ViewCommand.OpenWelcome);
}
