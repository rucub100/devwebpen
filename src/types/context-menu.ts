const menuType = {
  Item: "item",
  Submenu: "submenu",
} as const;

type MenuTypeKeys = keyof typeof menuType;
type MenuType = (typeof menuType)[MenuTypeKeys];

type MenuItemBase<T extends MenuType> = {
  type: T;
  label: string;
  enabled?: boolean;
};

type MenuItem = MenuItemBase<"item"> & {
  action: () => void;
};

type ContextSubMenu = MenuItemBase<"submenu"> & {
  items: MenuItem[];
};

export type ContextMenuItem = ContextSubMenu | MenuItem;

export type ContextMenu = {
  items: MenuItem[];
};
