import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { NavView, ViewState } from "../types/view-state";
import { navigateTo as _navigateTo } from "../tauri/commands";

let globalNavigationState: NavView | null = null;
let navigationListeners: Dispatch<SetStateAction<NavView | null>>[] = [];

function updateNavigation(promise: Promise<Partial<ViewState>>) {
  if (!globalNavigationState) {
    throw new Error("Navigation state has not been initialized");
  }

  promise
    .then((viewState) => {
      if (!viewState || !viewState.nav) {
        return;
      }

      console.debug("Navigation updated", viewState);
      globalNavigationState = viewState.nav;
      navigationListeners.forEach((listener) =>
        listener(globalNavigationState!)
      );
    })
    .catch((error) => {
      console.error("Failed to update navigation state", error);
    });
}

export function initializeNavigationState(state: NavView) {
  if (globalNavigationState !== null) {
    throw new Error("Navigation state has already been initialized");
  }

  globalNavigationState = state;
}

export function useNavigation(
  { listen }: { listen?: boolean } = { listen: true }
) {
  const setInternalNavigationState = useState(globalNavigationState)[1];

  useEffect(() => {
    if (!listen) {
      return;
    }

    navigationListeners.push(setInternalNavigationState);

    return () => {
      navigationListeners = navigationListeners.filter(
        (listener) => listener !== setInternalNavigationState
      );
    };
  }, [setInternalNavigationState, listen]);

  const navigateTo = useCallback(
    (navigation: NavView) => updateNavigation(_navigateTo(navigation)),
    []
  );

  return {
    navigation: globalNavigationState,
    navigateTo,
  };
}
