import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow, LogicalPosition } from "@tauri-apps/api/window";
import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import {
  ContextMenu,
  ContextMenuItem,
  ContextSubMenu,
} from "../types/context-menu";

const currentWindow = getCurrentWindow();

const appendItem =
  (menu: Menu | Submenu) =>
  async (item: ContextMenuItem | ContextSubMenu): Promise<void> => {
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
        console.error(`Unknown item type: ${item}`);
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
