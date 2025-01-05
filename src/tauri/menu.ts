import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Menu } from "@tauri-apps/api/menu";

async function createMenu() {
  const currentWindow = await getCurrentWindow();
  const menu = await Menu.default();
  menu.setAsAppMenu();
  menu.setAsWindowMenu(currentWindow);
}

if (isTauri()) {
  await createMenu();
}
