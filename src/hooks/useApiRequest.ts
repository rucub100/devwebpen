import { useCallback, useEffect, useState } from "react";
import { useApiClient } from "./useApiClient";
import { HttpRequest } from "../types/api-client";

export function useApiRequest(requestId: string | undefined | null) {
  const [request, setRequest] = useState<HttpRequest | undefined>(undefined);
  const {
    apiClient,
    setApiClientRequestMethod,
    setApiClientRequestScheme,
    setApiClientRequestAuthority,
    setApiClientRequestPath,
    addApiClientRequestHeader,
  } = useApiClient({
    listenApiClient: true,
  });

  useEffect(() => {
    if (requestId) {
      const req = apiClient?.collections
        .flatMap((c) => c.requests)
        .find((r) => r.id === requestId);

      setRequest(req);
    } else {
      setRequest((prev) => {
        if (prev) {
          return undefined;
        } else {
          return prev;
        }
      });
    }
  }, [requestId, apiClient]);

  const setMethod = useCallback(
    (method: string) => {
      if (requestId) {
        setApiClientRequestMethod(requestId, method);
      }
    },
    [requestId, setApiClientRequestMethod]
  );

  const setScheme = useCallback(
    (scheme: string) => {
      if (requestId) {
        setApiClientRequestScheme(requestId, scheme);
      }
    },
    [requestId, setApiClientRequestScheme]
  );

  const setAuthority = useCallback(
    (authority: string) => {
      if (requestId) {
        setApiClientRequestAuthority(requestId, authority);
      }
    },
    [requestId, setApiClientRequestAuthority]
  );

  const setPath = useCallback(
    (path: string) => {
      if (requestId) {
        setApiClientRequestPath(requestId, path);
      }
    },
    [requestId, setApiClientRequestPath]
  );

  const addHeader = useCallback(() => {
    if (requestId) {
      addApiClientRequestHeader(requestId);
    }
  }, [requestId, addApiClientRequestHeader]);

  return {
    request,
    setMethod,
    setScheme,
    setAuthority,
    setPath,
    addHeader,
  };
}
