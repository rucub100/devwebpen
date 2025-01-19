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
} from "../tauri/commands";
import {
  AsideView,
  BottomView,
  MainView,
  NavView,
  StatusView,
  TabsView,
  ViewState,
} from "../types/view-state";

let globalViewState: ViewState | null = null;

let _init = false;
let initListeners: Dispatch<SetStateAction<boolean>>[] = [];
let navListeners: Dispatch<SetStateAction<NavView | null>>[] = [];
let tabsListeners: Dispatch<SetStateAction<TabsView | null>>[] = [];
let mainListeners: Dispatch<SetStateAction<MainView | null>>[] = [];
let asideListeners: Dispatch<SetStateAction<AsideView | null>>[] = [];
let bottomListeners: Dispatch<SetStateAction<BottomView | null>>[] = [];
let statusListeners: Dispatch<SetStateAction<StatusView | null>>[] = [];

export function initializeViewState() {
  if (_init) {
    return;
  }

  _init = true;

  console.debug("Initializing view state...");

  if (globalViewState !== null) {
    throw new Error("View state has already been initialized");
  }

  initView()
    .then((viewState) => {
      globalViewState = viewState;
      console.debug("View state initialized", globalViewState);
      initListeners.forEach((listener) => listener(true));
    })
    .catch((error) => {
      console.error("Failed to initialize view state", error);
    });
}

function updateViewState(promise: Promise<Partial<ViewState>>) {
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
  listenInit?: boolean;
  listenNav?: boolean;
  listenTabs?: boolean;
  listenMain?: boolean;
  listenAside?: boolean;
  listenBottom?: boolean;
  listenStatus?: boolean;
}

export function useViewState({
  listenInit,
  listenNav,
  listenTabs,
  listenMain,
  listenAside,
  listenBottom,
  listenStatus,
}: UseViewStateProps = {}) {
  const [isInitialized, setInitialized] = useState(!!globalViewState);
  const setInternalNavViewState = useState(globalViewState?.nav || null)[1];
  const setInternalTabsViewState = useState(globalViewState?.tabs || null)[1];
  const setInternalMainViewState = useState(globalViewState?.main || null)[1];
  const setInternalAsideViewState = useState(globalViewState?.aside || null)[1];
  const setInternalBottomViewState = useState(
    globalViewState?.bottom || null
  )[1];
  const setInternalStatusViewState = useState(
    globalViewState?.status || null
  )[1];

  useEffect(() => {
    if (globalViewState) {
      return;
    }

    if (!listenInit) {
      return;
    }

    initListeners.push(setInitialized);

    initializeViewState();

    return () => {
      initListeners = initListeners.filter(
        (listener) => listener !== setInitialized
      );
    };
  }, []);

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
    isInitialized,
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
