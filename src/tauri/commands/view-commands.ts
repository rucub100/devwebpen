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
import { NavView, ViewState } from "../../types/view-state";

enum ViewCommand {
  InitView = "init_view",
  NavigateTo = "navigate_to",
  CloseTab = "close_tab",
  SelectTab = "select_tab",
  OpenWelcome = "open_welcome",
  CloseBottom = "close_bottom",
  CloseAside = "close_aside",
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

export async function closeBottom(): Promise<Partial<ViewState>> {
  return invoke<Partial<ViewState>>(ViewCommand.CloseBottom);
}

export async function closeAside(): Promise<Partial<ViewState>> {
  return invoke<Partial<ViewState>>(ViewCommand.CloseAside);
}
