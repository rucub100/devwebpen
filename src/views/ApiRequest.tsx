import { useState } from "react";
import ApiRequestNavigation, {
  ApiRequestNavigationItem,
} from "../components/api/request/ApiRequestNavigation";
import ApiRequestStartLine from "../components/api/request/ApiRequestStartLine";
import ApiRequestParams from "../components/api/request/ApiRequestParams";
import ApiRequestHeaders from "../components/api/request/ApiRequestHeaders";
import ApiRequestBody from "../components/api/request/ApiRequestBody";

export default function ApiRequest() {
  const [selectedTab, setSelectedTab] =
    useState<ApiRequestNavigationItem>("headers");

  return (
    <div className="flex flex-col w-full h-full">
      <ApiRequestStartLine></ApiRequestStartLine>
      <div className="h-0 w-full border-b border-neutral-800"></div>
      <ApiRequestNavigation
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      ></ApiRequestNavigation>
      <div className="h-0 w-full border-b border-neutral-800"></div>
      {selectedTab === "params" && <ApiRequestParams></ApiRequestParams>}
      {selectedTab === "headers" && <ApiRequestHeaders></ApiRequestHeaders>}
      {selectedTab === "body" && <ApiRequestBody></ApiRequestBody>}
    </div>
  );
}
