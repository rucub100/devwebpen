import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function showWindow() {
  if (!isTauri()) {
    return;
  }

  const currentWindow = getCurrentWindow();
  currentWindow.show();
}
