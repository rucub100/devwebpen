import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Proxy } from "../types/proxy";
import {
  getProxy,
  startProxy as _startProxy,
  stopProxy as _stopProxy,
  setProxyPort as _setProxyPort,
  toggleDebugging as _toggleDebugging,
  openSuspended as _openSuspended,
} from "../tauri/commands/proxy-commands";
import { subscribe } from "../tauri/events";

let globalProxy: Proxy | undefined = undefined;
let proxyListeners: Dispatch<SetStateAction<Proxy>>[] = [];

export async function initializeProxy() {
  console.debug("Initializing proxy...");

  if (globalProxy !== undefined) {
    throw new Error("Proxy has already been initialized");
  }

  subscribe("devwebpen://proxy-changed", (proxy) => {
    updateProxy(Promise.resolve(proxy));
  });

  await updateProxy(getProxy(), true);
}

async function updateProxy(promise: Promise<Proxy>, init = false) {
  if (!init && globalProxy === undefined) {
    console.error("Attempted to update proxy before it was initialized");
  }

  try {
    const proxy = await promise;
    globalProxy = proxy;

    if (init) {
      console.debug("Proxy initialized", globalProxy);
    } else {
      console.debug("Proxy updated", globalProxy);
    }

    if (!init) {
      proxyListeners.forEach((listener) => listener(proxy));
    }
  } catch (error) {
    if (init) {
      console.error("Failed to initialize proxy", error);
    } else {
      console.error("Failed to update proxy", error);
    }
  }
}

interface UseProxyOptioins {
  listenProxy?: boolean;
}

export function useProxy({ listenProxy }: UseProxyOptioins = {}) {
  const setInternalProxy = useState<Proxy>(globalProxy!)[1];

  // register proxy listeners
  useEffect(() => {
    if (!listenProxy) {
      return;
    }

    proxyListeners.push(setInternalProxy);

    return () => {
      proxyListeners = proxyListeners.filter(
        (listener) => listener !== setInternalProxy
      );
    };
  }, [listenProxy, setInternalProxy]);

  const startProxy = useCallback(() => _startProxy(), []);
  const stopProxy = useCallback(() => _stopProxy(), []);
  const setProxyPort = useCallback(
    (port: number) => updateProxy(_setProxyPort(port)),
    [_setProxyPort]
  );

  const toggleDebugging = useCallback(
    () => updateProxy(_toggleDebugging()),
    [_toggleDebugging]
  );

  const openSuspended = useCallback(
    (id: string) => _openSuspended(id),
    [_openSuspended]
  );

  return {
    proxy: globalProxy,
    startProxy,
    stopProxy,
    setProxyPort,
    toggleDebugging,
    openSuspended,
  };
}
