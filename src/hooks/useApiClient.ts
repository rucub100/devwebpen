import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ApiClient } from "../types/api-client";
import {
  getApiClient,
  sendApiClientRequest as _sendApiClientRequest,
  newApiClientRequest as _newApiClientRequest,
  openApiClientRequest as _openApiClientRequest,
} from "../tauri/commands/api-client-commands";
import { subscribe } from "../tauri/events";

let globalApiClient: ApiClient | undefined = undefined;
let apiClientListeners: Dispatch<SetStateAction<ApiClient>>[] = [];

export async function initializeApiClient() {
  console.debug("Initializing HTTP Api Client...");

  if (globalApiClient !== undefined) {
    throw new Error("HTTP Api Client has already been initialized");
  }

  subscribe("devwebpen://api-client-changed", (apiClient) => {
    updateApiClient(Promise.resolve(apiClient));
  });

  await updateApiClient(getApiClient(), true);
}

async function updateApiClient(promise: Promise<ApiClient>, init = false) {
  if (!init && globalApiClient === undefined) {
    console.error(
      "Attempted to update HTTP Api Client before it was initialized"
    );
  }

  try {
    const apiclient = await promise;
    globalApiClient = apiclient;

    if (init) {
      console.debug("ApiClient initialized", globalApiClient);
    } else {
      console.debug("ApiClient updated", globalApiClient);
    }

    if (!init) {
      apiClientListeners.forEach((listener) => listener(apiclient));
    }
  } catch (error) {
    if (init) {
      console.error("Failed to initialize HTTP Api Client", error);
    } else {
      console.error("Failed to update HTTP Api Client", error);
    }
  }
}

interface UseApiClientOptioins {
  listenApiClient?: boolean;
}

export function useApiClient({ listenApiClient }: UseApiClientOptioins = {}) {
  const setInternalApiClient = useState<ApiClient>(globalApiClient!)[1];

  // register api client listeners
  useEffect(() => {
    if (!listenApiClient) {
      return;
    }

    apiClientListeners.push(setInternalApiClient);

    return () => {
      apiClientListeners = apiClientListeners.filter(
        (listener) => listener !== setInternalApiClient
      );
    };
  }, [listenApiClient, setInternalApiClient]);

  const sendApiClientRequest = useCallback(
    (reqId: string) => _sendApiClientRequest(reqId),
    []
  );

  const newApiClientRequest = useCallback(
    (collectionName: string) =>
      updateApiClient(_newApiClientRequest(collectionName)),
    []
  );

  const openApiClientRequest = useCallback(
    (collectionName: string) => _openApiClientRequest(collectionName),
    []
  );

  return {
    apiClient: globalApiClient!,
    sendApiClientRequest,
    newApiClientRequest,
    openApiClientRequest,
  };
}
