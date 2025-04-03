/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useCallback, useEffect, useState } from "react";
import { useApiClient } from "./useApiClient";
import { HttpRequest } from "../types/api-client";
import { sendApiClientRequest } from "../tauri/commands/api-client-commands";

export function useApiRequest(requestId: string | undefined | null) {
  const [request, setRequest] = useState<HttpRequest | undefined>(undefined);
  const {
    apiClient,
    setApiClientRequestMethod,
    setApiClientRequestUrl,
    setApiClientRequestScheme,
    setApiClientRequestAuthority,
    setApiClientRequestPath,
    addApiClientRequestHeader,
    deleteApiClientRequestHeader,
    setApiClientRequestHeaderName,
    setApiClientRequestHeaderValue,
    addApiClientRequestQueryParameter,
    deleteApiClientRequestQueryParameter,
    setApiClientRequestQueryParamName,
    setApiClientRequestQueryParamValue,
    setApiClientRequestPathParamValue,
    setApiClientRequestBody,
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

  const setUrl = useCallback(
    (scheme: string, authority: string, path: string) => {
      if (requestId) {
        setApiClientRequestUrl(requestId, scheme, authority, path);
      }
    },
    [requestId, setApiClientRequestScheme]
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

  const deleteHeader = useCallback(
    (headerId: string) => {
      if (requestId) {
        deleteApiClientRequestHeader(requestId, headerId);
      }
    },
    [requestId, deleteApiClientRequestHeader]
  );

  const setHeaderName = useCallback(
    (headerId: string, headerName: string) => {
      if (requestId) {
        setApiClientRequestHeaderName(requestId, headerId, headerName);
      }
    },
    [requestId, setApiClientRequestHeaderName]
  );

  const setHeaderValue = useCallback(
    (headerId: string, headerValue: string) => {
      if (requestId) {
        setApiClientRequestHeaderValue(requestId, headerId, headerValue);
      }
    },
    [requestId, setApiClientRequestHeaderValue]
  );

  const addQueryParameter = useCallback(() => {
    if (requestId) {
      addApiClientRequestQueryParameter(requestId);
    }
  }, [requestId, addApiClientRequestQueryParameter]);

  const deleteQueryParameter = useCallback(
    (id: string) => {
      if (requestId) {
        deleteApiClientRequestQueryParameter(requestId, id);
      }
    },
    [requestId, deleteApiClientRequestQueryParameter]
  );

  const setQueryParamName = useCallback(
    (id: string, name: string) => {
      if (requestId) {
        setApiClientRequestQueryParamName(requestId, id, name);
      }
    },
    [requestId, setApiClientRequestQueryParamName]
  );

  const setQueryParamValue = useCallback(
    (id: string, value: string) => {
      if (requestId) {
        setApiClientRequestQueryParamValue(requestId, id, value);
      }
    },
    [requestId, setApiClientRequestQueryParamValue]
  );

  const setPathParamValue = useCallback(
    (id: string, value: string) => {
      if (requestId) {
        setApiClientRequestPathParamValue(requestId, id, value);
      }
    },
    [requestId, setApiClientRequestPathParamValue]
  );

  const sendRequest = useCallback(() => {
    if (requestId) {
      sendApiClientRequest(requestId);
    }
  }, [requestId, sendApiClientRequest]);

  const setBody = useCallback(
    (body?: Uint8Array) => {
      if (requestId) {
        setApiClientRequestBody(requestId, body);
      }
    },
    [requestId, setApiClientRequestBody]
  );

  return {
    request,
    setMethod,
    setUrl,
    setScheme,
    setAuthority,
    setPath,
    addQueryParameter,
    deleteQueryParameter,
    addHeader,
    deleteHeader,
    setHeaderName,
    setHeaderValue,
    setQueryParamName,
    setQueryParamValue,
    setPathParamValue,
    sendRequest,
    setBody,
  };
}
