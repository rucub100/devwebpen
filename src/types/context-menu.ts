export interface ContextMenuItem {
  type: "item";
  label: string;
  enabled?: boolean;
  action: () => void;
}

export interface ContextSubMenu {
  type: "submenu";
  label: string;
  enabled?: boolean;
  items: ContextMenuItem[];
}

export interface ContextMenu {
  items: (ContextSubMenu | ContextMenuItem)[];
}
