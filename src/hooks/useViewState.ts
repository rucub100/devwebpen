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
import { NavView, ViewState } from "../types/view-state";

let _init = false;
let globalViewState: ViewState | null = null;
let viewStateListeners: Dispatch<SetStateAction<ViewState | null>>[] = [];
let isInitializedListeners: Dispatch<SetStateAction<boolean>>[] = [];

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
      viewStateListeners.forEach((listener) => listener(globalViewState));
      isInitializedListeners.forEach((listener) => listener(true));
    })
    .catch((error) => {
      console.error("Failed to initialize view state", error);
    });
}

function updateViewState(promise: Promise<Partial<ViewState>>) {
  promise
    .then((viewState) => {
      if (!viewState) {
        return;
      }

      if (!globalViewState) {
        throw new Error("View state has not been initialized");
      }

      // TODO: refactor this to not have to change the reference like this
      globalViewState = JSON.parse(
        JSON.stringify(globalViewState)
      ) as ViewState;

      if (viewState.nav) {
        globalViewState.nav = viewState.nav;
      }
      if (viewState.tabs) {
        globalViewState.tabs = viewState.tabs;
      }
      if (viewState.main) {
        globalViewState.main = viewState.main;
      }
      if (viewState.aside) {
        globalViewState.aside = viewState.aside;
      }
      if (viewState.bottom) {
        globalViewState.bottom = viewState.bottom;
      }
      if (viewState.status) {
        globalViewState.status = viewState.status;
      }

      console.debug("View state updated", globalViewState);
      viewStateListeners.forEach((listener) => listener(globalViewState));
    })
    .catch((error) => {
      console.error("Failed to update view state", error);
    });
}

interface UseViewStateProps {
  listen?: boolean;
}

export function useViewState({ listen }: UseViewStateProps = { listen: true }) {
  const [isInitialized, setInitialized] = useState(!!globalViewState);
  const setInternalViewState = useState(globalViewState)[1];

  useEffect(() => {
    if (globalViewState) {
      return;
    }
    isInitializedListeners.push(setInitialized);
    initializeViewState();

    return () => {
      isInitializedListeners = isInitializedListeners.filter(
        (listener) => listener !== setInitialized
      );
    };
  }, []);

  useEffect(() => {
    if (!listen) {
      return;
    }

    viewStateListeners.push(setInternalViewState);

    return () => {
      viewStateListeners = viewStateListeners.filter(
        (listener) => listener !== setInternalViewState
      );
    };
  }, [setInternalViewState, listen]);

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
    viewState: globalViewState,
    isInitialized,
    navigateTo,
    closeTab,
    selectTab,
    openWelcome,
  };
}
