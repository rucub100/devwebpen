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
  setApiClientRequestMethod as _setApiClientRequestMethod,
  setApiClientRequestScheme as _setApiClientRequestScheme,
  setApiClientRequestAuthority as _setApiClientRequestAuthority,
  setApiClientRequestPath as _setApiClientRequestPath,
  addApiClientRequestHeader as _addApiClientRequestHeader,
  deleteApiClientRequestHeader as _deleteApiClientRequestHeader,
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

  const setApiClientRequestMethod = useCallback(
    (requestId: string, method: string) =>
      updateApiClient(_setApiClientRequestMethod(requestId, method)),
    []
  );

  const setApiClientRequestScheme = useCallback(
    (requestId: string, scheme: string) =>
      updateApiClient(_setApiClientRequestScheme(requestId, scheme)),
    []
  );

  const setApiClientRequestAuthority = useCallback(
    (requestId: string, authority: string) =>
      updateApiClient(_setApiClientRequestAuthority(requestId, authority)),
    []
  );

  const setApiClientRequestPath = useCallback(
    (requestId: string, path: string) =>
      updateApiClient(_setApiClientRequestPath(requestId, path)),
    []
  );

  const addApiClientRequestHeader = useCallback(
    (requestId: string) =>
      updateApiClient(_addApiClientRequestHeader(requestId)),
    []
  );

  const deleteApiClientRequestHeader = useCallback(
    (requestId: string, headerId: string) =>
      updateApiClient(_deleteApiClientRequestHeader(requestId, headerId)),
    []
  );

  return {
    apiClient: globalApiClient!,
    sendApiClientRequest,
    newApiClientRequest,
    openApiClientRequest,
    setApiClientRequestMethod,
    setApiClientRequestScheme,
    setApiClientRequestAuthority,
    setApiClientRequestPath,
    addApiClientRequestHeader,
    deleteApiClientRequestHeader,
  };
}
