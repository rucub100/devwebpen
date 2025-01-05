import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Menu } from "@tauri-apps/api/menu";

export async function createMenu() {
  if (!isTauri()) {
    return;
  }

  const currentWindow = await getCurrentWindow();
  const menu = await Menu.default();
  menu.setAsAppMenu();
  menu.setAsWindowMenu(currentWindow);
}
