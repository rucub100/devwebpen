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
