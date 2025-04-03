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
import { useState } from "react";
import useApiResponseHistory from "../../../hooks/useApiResponseHistory";
import { ApiRequestTabData } from "../../../types/view-state";
import ApiResponseStartLine from "./ApiResponseStartLine";
import ApiResponseNavigation, {
  ApiResponseNavigationItem,
} from "./ApiResponseNavigation";
import ApiResponseHeaders from "./ApiResponseHeaders";
import ApiResponseBody from "./ApiResponseBody";

interface ApiRequestProps {
  data?: ApiRequestTabData | null;
}

export default function ApiResponse({ data }: ApiRequestProps) {
  const [selectedTab, setSelectedTab] =
    useState<ApiResponseNavigationItem>("headers");
  const requestId = data?.apiRequest.requestId;
  const { responseHistory } = useApiResponseHistory(requestId);

  const response =
    responseHistory.length > 0
      ? responseHistory[responseHistory.length - 1]
      : null;

  return (
    <div className="flex flex-col w-full h-full min-w-max">
      {response ? (
        <>
          <ApiResponseStartLine response={response}></ApiResponseStartLine>
          <div className="h-0 w-full border-b border-neutral-800"></div>
          <ApiResponseNavigation
            selectedTab={selectedTab}
            onSelectTab={setSelectedTab}
          ></ApiResponseNavigation>
          <div className="h-0 w-full border-b border-neutral-800"></div>
          {selectedTab === "headers" && (
            <ApiResponseHeaders headers={response.headers}></ApiResponseHeaders>
          )}
          {selectedTab === "body" && (
            <ApiResponseBody body={response.body}></ApiResponseBody>
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
