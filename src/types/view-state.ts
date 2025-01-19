export enum NavView {
  None = "none",
  Dashboard = "dashboard",
}

export enum TabName {
  Welcome = "welcome",
}

export const defaultTabNames: Record<TabName, string> = {
  [TabName.Welcome]: "Welcome",
};

export interface TabKind {
  nav: NavView;
  name: TabName;
}

export interface Tab {
  id: number;
  kind: TabKind;
  label: string | null;
}

export interface TabsView {
  tabs: Tab[];
  activeTabId: number | null;
}

export enum MainView {
  None = "none",
  Welcome = "welcome",
}

export enum AsideView {
  None = "none",
}

export enum BottomView {
  None = "none",
}

export enum StatusView {
  None = "none",
}

export interface ViewState {
  nav: NavView;
  tabs: TabsView;
  main: MainView;
  aside: AsideView;
  bottom: BottomView;
  status: StatusView;
}
