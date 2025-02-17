import { useState } from "react";
import ApiRequestNavigation, {
  ApiRequestNavigationItem,
} from "../components/api/request/ApiRequestNavigation";
import ApiRequestStartLine from "../components/api/request/ApiRequestStartLine";
import ApiRequestParams from "../components/api/request/ApiRequestParams";
import ApiRequestHeaders from "../components/api/request/ApiRequestHeaders";
import ApiRequestBody from "../components/api/request/ApiRequestBody";
import { ApiRequestTabData } from "../types/view-state";
import { useApiRequest } from "../hooks/useApiRequest";

interface ApiRequestProps {
  data?: ApiRequestTabData | null;
}

export default function ApiRequest({ data }: ApiRequestProps) {
  const [selectedTab, setSelectedTab] =
    useState<ApiRequestNavigationItem>("headers");

  const {
    request,
    setMethod,
    setUrl,
    setScheme,
    setAuthority,
    setPath,
    addHeader,
    deleteHeader,
    setHeaderName,
    setHeaderValue,
  } = useApiRequest(data?.apiRequest.requestId);

  if (!request) {
    return null;
  }

  const method = request.method;
  const scheme = request.scheme;
  const authority = request.authority;
  const path = request.path;
  const headers = request.headers;
  const body = request.body;
  const pathParams = request.pathParams || [];
  const queryParams = request.queryParams || [];

  return (
    <div className="flex flex-col w-full h-full">
      <ApiRequestStartLine
        method={method}
        scheme={scheme}
        authority={authority}
        path={path}
        onMethodChange={setMethod}
        onUrlChange={setUrl}
      ></ApiRequestStartLine>
      <div className="h-0 w-full border-b border-neutral-800"></div>
      <ApiRequestNavigation
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      ></ApiRequestNavigation>
      <div className="h-0 w-full border-b border-neutral-800"></div>
      {selectedTab === "headers" && (
        <ApiRequestHeaders
          scheme={scheme}
          authority={authority}
          path={path}
          headers={headers}
          onSchemeChange={setScheme}
          onAuthorityChange={setAuthority}
          onPathChange={setPath}
          onAddHeader={addHeader}
          onDeleteHeader={deleteHeader}
          onSetHeaderName={setHeaderName}
          onSetHeaderValue={setHeaderValue}
        ></ApiRequestHeaders>
      )}
      {selectedTab === "params" && (
        <ApiRequestParams
          pathParams={pathParams}
          queryParams={queryParams}
        ></ApiRequestParams>
      )}
      {selectedTab === "body" && <ApiRequestBody body={body}></ApiRequestBody>}
    </div>
  );
}
