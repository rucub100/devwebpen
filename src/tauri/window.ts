import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

export async function showWindow() {
  if (!isTauri()) {
    return;
  }

  const currentWindow = await getCurrentWindow();
  currentWindow.show();
}
