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
import ApiRequestNavigation, {
  ApiRequestNavigationItem,
} from "./ApiRequestNavigation";
import ApiRequestStartLine from "./ApiRequestStartLine";
import ApiRequestParams from "./ApiRequestParams";
import ApiRequestHeaders from "./ApiRequestHeaders";
import ApiRequestBody from "./ApiRequestBody";
import { ApiRequestTabData } from "../../../types/view-state";
import { useApiRequest } from "../../../hooks/useApiRequest";

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
    <div className="flex flex-col w-full h-full min-w-max">
      <ApiRequestStartLine
        method={method}
        scheme={scheme}
        authority={authority}
        path={path}
        onMethodChange={setMethod}
        onUrlChange={setUrl}
        onSend={sendRequest}
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
          onAddQueryParam={addQueryParameter}
          onDeleteQueryParam={deleteQueryParameter}
          onSetQueryParamName={setQueryParamName}
          onSetQueryParamValue={setQueryParamValue}
          onSetPathParamValue={setPathParamValue}
        ></ApiRequestParams>
      )}
      {selectedTab === "body" && (
        <ApiRequestBody body={body} onBodyChange={setBody}></ApiRequestBody>
      )}
    </div>
  );
}
