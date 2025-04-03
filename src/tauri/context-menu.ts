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
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow, LogicalPosition } from "@tauri-apps/api/window";
import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import { ContextMenu, ContextMenuItem } from "../types/context-menu";

const currentWindow = getCurrentWindow();

const appendItem =
  (menu: Menu | Submenu) =>
  async (item: ContextMenuItem): Promise<void> => {
    switch (item.type) {
      case "item":
        const menuItem = await MenuItem.new({
          text: item.label,
          enabled: item.enabled,
          action: item.action,
        });

        return menu.append(menuItem);

      case "submenu":
        const subMenu = await Submenu.new({
          text: item.label,
          enabled: item.enabled,
        });

        await Promise.all(item.items.map(appendItem(subMenu)));
        return;

      default:
        const _exhaustiveCheck: never = item;
        return _exhaustiveCheck;
    }
  };

export async function createContextMenu(contextMenu: ContextMenu): Promise<{
  show: (event: React.MouseEvent) => void;
}> {
  if (!isTauri()) {
    // do nothing if not running in Tauri
    console.warn("Not running in Tauri, context menu will not work");
    return { show: () => {} };
  }

  const menu = await Menu.new();

  Promise.all(contextMenu.items.map(appendItem(menu)));

  const show = (event: React.MouseEvent) => {
    event.preventDefault();
    menu.popup(
      new LogicalPosition(event.clientX, event.clientY),
      currentWindow
    );
  };

  return { show };
}
