import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  initView,
  navigateTo as _navigateTo,
  closeTab as _closeTab,
  selectTab as _selectTab,
  openWelcome as _openWelcome,
} from "../tauri/commands/view-commands";
import {
  AsideView,
  BottomView,
  MainView,
  NavView,
  StatusView,
  TabsView,
  ViewState,
} from "../types/view-state";
import { subscribe } from "../tauri/events";

// use undefined to indicate that the view state has not been initialized
let globalViewState: ViewState | undefined = undefined;

let navListeners: Dispatch<SetStateAction<NavView | undefined>>[] = [];
let tabsListeners: Dispatch<SetStateAction<TabsView | undefined>>[] = [];
let mainListeners: Dispatch<SetStateAction<MainView | undefined>>[] = [];
let asideListeners: Dispatch<SetStateAction<AsideView | undefined>>[] = [];
let bottomListeners: Dispatch<SetStateAction<BottomView | undefined>>[] = [];
let statusListeners: Dispatch<SetStateAction<StatusView | undefined>>[] = [];

export async function initializeViewState() {
  console.debug("Initializing view state...");

  if (globalViewState !== undefined) {
    throw new Error("View state has already been initialized");
  }

  subscribe("devwebpen://view-state-changed", (viewState) =>
    updateViewState(Promise.resolve(viewState))
  );

  try {
    const viewState = await initView();
    globalViewState = viewState;
    console.debug("View state initialized", globalViewState);
  } catch (error) {
    console.error("Failed to initialize view state", error);
  }
}

function updateViewState(promise: Promise<Partial<ViewState>>) {
  if (globalViewState === undefined) {
    console.error("Attempted to update view state before it was initialized");
  }

  promise
    .then((viewState) => {
      if (!viewState) {
        throw new Error("View state is undefined or null");
      }

      if (!globalViewState) {
        throw new Error("View state has not been initialized");
      }

      if (viewState.nav) {
        globalViewState.nav = viewState.nav;
        navListeners.forEach((listener) => listener(globalViewState!.nav));
      }
      if (viewState.tabs) {
        globalViewState.tabs = viewState.tabs;
        tabsListeners.forEach((listener) => listener(globalViewState!.tabs));
      }
      if (viewState.main) {
        globalViewState.main = viewState.main;
        mainListeners.forEach((listener) => listener(globalViewState!.main));
      }
      if (viewState.aside) {
        globalViewState.aside = viewState.aside;
        asideListeners.forEach((listener) => listener(globalViewState!.aside));
      }
      if (viewState.bottom) {
        globalViewState.bottom = viewState.bottom;
        bottomListeners.forEach((listener) =>
          listener(globalViewState!.bottom)
        );
      }
      if (viewState.status) {
        globalViewState.status = viewState.status;
        statusListeners.forEach((listener) =>
          listener(globalViewState!.status)
        );
      }

      console.debug("View state updated", globalViewState);
    })
    .catch((error) => {
      console.error("Failed to update view state", error);
    });
}

interface UseViewStateProps {
  listenNav?: boolean;
  listenTabs?: boolean;
  listenMain?: boolean;
  listenAside?: boolean;
  listenBottom?: boolean;
  listenStatus?: boolean;
}

export function useViewState({
  listenNav,
  listenTabs,
  listenMain,
  listenAside,
  listenBottom,
  listenStatus,
}: UseViewStateProps = {}) {
  const setInternalNavViewState = useState(globalViewState?.nav)[1];
  const setInternalTabsViewState = useState(globalViewState?.tabs)[1];
  const setInternalMainViewState = useState(globalViewState?.main)[1];
  const setInternalAsideViewState = useState(globalViewState?.aside)[1];
  const setInternalBottomViewState = useState(globalViewState?.bottom)[1];
  const setInternalStatusViewState = useState(globalViewState?.status)[1];

  // register nav listeners
  useEffect(() => {
    if (!listenNav) {
      return;
    }

    navListeners.push(setInternalNavViewState);

    return () => {
      navListeners = navListeners.filter(
        (listener) => listener !== setInternalNavViewState
      );
    };
  }, [listenNav, setInternalNavViewState]);

  // register tabs listeners
  useEffect(() => {
    if (!listenTabs) {
      return;
    }

    tabsListeners.push(setInternalTabsViewState);

    return () => {
      tabsListeners = tabsListeners.filter(
        (listener) => listener !== setInternalTabsViewState
      );
    };
  }, [listenTabs, setInternalTabsViewState]);

  // register main listeners
  useEffect(() => {
    if (!listenMain) {
      return;
    }

    mainListeners.push(setInternalMainViewState);

    return () => {
      mainListeners = mainListeners.filter(
        (listener) => listener !== setInternalMainViewState
      );
    };
  }, [listenMain, setInternalMainViewState]);

  // register aside listeners
  useEffect(() => {
    if (!listenAside) {
      return;
    }

    asideListeners.push(setInternalAsideViewState);

    return () => {
      asideListeners = asideListeners.filter(
        (listener) => listener !== setInternalAsideViewState
      );
    };
  }, [listenAside, setInternalAsideViewState]);

  // register bottom listeners
  useEffect(() => {
    if (!listenBottom) {
      return;
    }

    bottomListeners.push(setInternalBottomViewState);

    return () => {
      bottomListeners = bottomListeners.filter(
        (listener) => listener !== setInternalBottomViewState
      );
    };
  }, [listenBottom, setInternalBottomViewState]);

  // register status listeners
  useEffect(() => {
    if (!listenStatus) {
      return;
    }

    statusListeners.push(setInternalStatusViewState);

    return () => {
      statusListeners = statusListeners.filter(
        (listener) => listener !== setInternalStatusViewState
      );
    };
  }, [listenStatus, setInternalStatusViewState]);

  const navigateTo = useCallback(
    (navigation: NavView) => updateViewState(_navigateTo(navigation)),
    []
  );

  const closeTab = useCallback(
    (id: number) => updateViewState(_closeTab(id)),
    []
  );

  const selectTab = useCallback(
    (id: number) => updateViewState(_selectTab(id)),
    []
  );

  const openWelcome = useCallback(() => updateViewState(_openWelcome()), []);

  return {
    nav: globalViewState?.nav,
    tabs: globalViewState?.tabs,
    main: globalViewState?.main,
    aside: globalViewState?.aside,
    bottom: globalViewState?.bottom,
    status: globalViewState?.status,
    navigateTo,
    closeTab,
    selectTab,
    openWelcome,
  };
}
