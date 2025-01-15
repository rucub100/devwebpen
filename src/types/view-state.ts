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
  kind: TabKind;
  label: string | null;
}

export interface ViewState {
  navigation: Navigation;
  tabs: Tab[];
  aside: string | null;
  bottom: string | null;
  status: string | null;
}
