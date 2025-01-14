import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { invokeInit } from "../tauri/commands";
import { ViewState } from "../types/view-state";

let _init = false;
let viewInitialized = false;
let globalViewState: ViewState | null = null;
let viewStateListeners: Dispatch<SetStateAction<ViewState | null>>[] = [];

export function initializeViewState(
  callback: Dispatch<SetStateAction<boolean>>
) {
  if (_init) {
    return;
  }

  _init = true;

  console.debug("Initializing view state...");

  if (globalViewState !== null) {
    throw new Error("View state has already been initialized");
  }

  invokeInit()
    .then((viewState) => {
      console.debug("View state initialized", viewState);
      globalViewState = viewState;
      viewInitialized = true;
      callback(true);
      viewStateListeners.forEach((listener) => listener(viewState));
    })
    .catch((error) => {
      console.error("Failed to initialize view state", error);
    });
}

export function useViewState(
  { listen }: { listen?: boolean } = { listen: true }
) {
  const setInternalViewState = useState<ViewState | null>(globalViewState)[1];
  const setViewInitialized = useState(viewInitialized)[1];

  useEffect(() => {
    if (!listen) {
      return;
    }

    viewStateListeners.push(setInternalViewState);

    if (!viewInitialized) {
      initializeViewState(setViewInitialized);
    }

    return () => {
      viewStateListeners = viewStateListeners.filter(
        (listener) => listener !== setInternalViewState
      );
    };
  }, [setInternalViewState, listen]);

  //   const setViewState = useCallback(
  //     (
  //       newViewState: ViewState | ((prevViewState: ViewState | null) => ViewState)
  //     ) => {
  //       if (typeof newViewState === "function") {
  //         globalViewState = newViewState(globalViewState);
  //       } else {
  //         globalViewState = newViewState;
  //       }

  //       listeners.forEach((listener) => listener(newViewState));
  //     },
  //     []
  //   );

  return { viewState: globalViewState, viewInitialized };
}
