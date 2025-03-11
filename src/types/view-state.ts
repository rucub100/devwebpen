const none = { None: "none" } as const;

const navView = {
  ...none,
  Dashboard: "dashboard",
  Proxy: "proxy",
  ApiClient: "apiClient",
} as const;
const mainView = {
  ...none,
  Welcome: "welcome",
  ApiRequest: "apiRequest",
} as const;
const asideView = { ...none } as const;
const bottomView = { ...none, ProxyTraffic: "proxyTraffic" } as const;
const statusView = { ...none, Show: "show" } as const;
type NavViewKeys = keyof typeof navView;
type MainViewKeys = keyof typeof mainView;
type AsideViewKeys = keyof typeof asideView;
type BottomViewKeys = keyof typeof bottomView;
type StatusViewKeys = keyof typeof statusView;
export type NavView = (typeof navView)[NavViewKeys];
export type MainView = (typeof mainView)[MainViewKeys];
export type AsideView = (typeof asideView)[AsideViewKeys];
export type BottomView = (typeof bottomView)[BottomViewKeys];
export type StatusView = (typeof statusView)[StatusViewKeys];

export type ApiRequestTabData = {
  apiRequest: {
    requestId: string;
  };
};

export type TabData = ApiRequestTabData;

const tabName = { Welcome: "welcome" } as const;
type TabNameKeys = keyof typeof tabName;
export type TabName = (typeof tabName)[TabNameKeys];

export type TabKind = {
  nav: NavView;
  name: TabName;
};

export type Tab<D extends TabData> = {
  id: number;
  kind: TabKind;
  label: string | null;
  data: D | null;
};

export type TabsView = {
  tabs: Tab<TabData>[];
  activeTabId: number | null;
};

export type ViewState = {
  nav: NavView;
  tabs: TabsView;
  main: MainView;
  aside: AsideView;
  bottom: BottomView;
  status: StatusView;
};

const viewStateEvents = {
  ViewStateChanged: "devwebpen://view-state-changed",
} as const;

type ViewStateEventKeys = keyof typeof viewStateEvents;
export type ViewStateEvent = (typeof viewStateEvents)[ViewStateEventKeys];
