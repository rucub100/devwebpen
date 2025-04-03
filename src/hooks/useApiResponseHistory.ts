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
