import { useEffect, useState } from "react";
import { useApiClient } from "./useApiClient";
import { HttpRequest } from "../types/api-client";

export function useApiRequest(requestId: string | undefined | null) {
  const [request, setRequest] = useState<HttpRequest | undefined>(undefined);
  const { apiClient } = useApiClient({ listenApiClient: true });

  useEffect(() => {
    if (requestId) {
      const req = apiClient?.collections
        .flatMap((c) => c.requests)
        .find((r) => r.id === requestId);

      setRequest((prev) => {
        if (prev?.id === req?.id) {
          return prev;
        } else {
          return req;
        }
      });
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

  return {
    request,
  };
}
