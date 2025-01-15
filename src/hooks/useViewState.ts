import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { initView, navigate } from "../tauri/commands";
import { Navigation, ViewState } from "../types/view-state";

// Define wrapper type to force re-render on change
type Boolean = { value: boolean };

let _init = false;
let viewInitialized: Boolean = { value: false };
let viewInitializedListener: Dispatch<SetStateAction<Boolean>> | null = null;
let globalViewState: ViewState | null = null;
let viewStateListeners: Dispatch<SetStateAction<ViewState | null>>[] = [];

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

  const navigateTo = useCallback((navigation: Navigation) => {
    navigate(navigation)
      .then((viewState) => {
        console.debug("View state updated", viewState);
        globalViewState = viewState;
        viewStateListeners.forEach((listener) => listener(viewState));
      })
      .catch((error) => {
        console.error("Failed to update view state", error);
      });
  }, []);

  return {
    viewState: globalViewState,
    navigateTo,
    viewInitialized: viewInitialized.value,
  };
}
