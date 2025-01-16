export enum Navigation {
  Dashboard = "dashboard",
}

export enum TabName {
  Welcome = "welcome",
}

export const defaultTabNames: Record<TabName, string> = {
  [TabName.Welcome]: "Welcome",
};

export interface TabKind {
  nav: Navigation;
  name: TabName;
}

export interface Tab {
  id: number;
  kind: TabKind;
  label: string | null;
}

export interface ViewState {
  navigation: Navigation;
  tabs: Tab[];
  activeTabId: number | null;
  aside: string | null;
  bottom: string | null;
  status: string | null;
}
