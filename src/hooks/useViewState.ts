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
import { Navigation, ViewState } from "../types/view-state";

// Define wrapper type to force re-render on change
type Boolean = { value: boolean };

let _init = false;
let viewInitialized: Boolean = { value: false };
let viewInitializedListener: Dispatch<SetStateAction<Boolean>> | null = null;
let globalViewState: ViewState | null = null;
let viewStateListeners: Dispatch<SetStateAction<ViewState | null>>[] = [];

function initializeViewState() {
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
      console.debug("View state initialized", viewState);
      globalViewState = viewState;
      viewInitialized = { value: true };
      viewInitializedListener?.(viewInitialized);
      viewStateListeners.forEach((listener) => listener(viewState));
    })
    .catch((error) => {
      console.error("Failed to initialize view state", error);
    });
}

function updateViewState(promise: Promise<ViewState | null>) {
  promise
    .then((viewState) => {
      if (!viewState) {
        return;
      }

      console.debug("View state updated", viewState);
      globalViewState = viewState;
      viewStateListeners.forEach((listener) => listener(viewState));
    })
    .catch((error) => {
      console.error("Failed to update view state", error);
    });
}

export function useViewState(
  { listen }: { listen?: boolean } = { listen: true }
) {
  const setInternalViewState = useState(globalViewState)[1];
  const setViewInitialized = useState(viewInitialized)[1];

  useEffect(() => {
    if (!viewInitialized.value) {
      viewInitializedListener = setViewInitialized;
      initializeViewState();
    }
  }, [setViewInitialized]);

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
    (navigation: Navigation) => updateViewState(_navigateTo(navigation)),
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
    navigateTo,
    closeTab,
    selectTab,
    openWelcome,
    viewInitialized: viewInitialized.value,
  };
}
