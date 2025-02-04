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
} from "../tauri/commands/proxy-commands";

let globalProxy: Proxy | undefined = undefined;
let proxyListeners: Dispatch<SetStateAction<Proxy>>[] = [];

export async function initializeProxy() {
  console.debug("Initializing proxy...");
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

  const startProxy = useCallback(() => updateProxy(_startProxy()), []);
  const stopProxy = useCallback(() => updateProxy(_stopProxy()), []);

  return {
    proxy: globalProxy,
    startProxy,
    stopProxy,
  };
}
