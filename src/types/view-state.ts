export enum Navigation {
  Dashboard = "dashboard",
}

export enum Tab {
  Welcome = "welcome",
}

export interface ViewState {
  navigation: Navigation;
  tabs: Tab[];
}
