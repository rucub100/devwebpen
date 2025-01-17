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

export interface TabView {
  tabs: Tab[];
  activeTabId: number | null;
}

export enum MainView {
  Welcome = "welcome",
}

export interface ViewState {
  navigation: Navigation;
  tabs: TabView;
  main: MainView | null;
  aside: string | null;
  bottom: string | null;
  status: string | null;
}
