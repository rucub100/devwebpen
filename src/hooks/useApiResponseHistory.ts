import { useEffect, useState } from "react";
import { useApiClient } from "./useApiClient";
import { HttpResponse } from "../types/api-client";

export default function useApiResponseHistory(
  requestId: string | undefined | null
) {
  const { apiClient } = useApiClient({ listenApiClient: true });
  const [responseHistory, setResponseHistory] = useState<HttpResponse[]>([]);

  useEffect(() => {
    if (requestId) {
      const history = apiClient?.history
        .filter((r) => r[1].requestId === requestId)
        .map((r) => r[1]);
      setResponseHistory(history);
    }
  }, [requestId, apiClient]);

  return { responseHistory };
}
