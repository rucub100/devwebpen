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
import { invoke } from "@tauri-apps/api/core";
import { ApiClient } from "../../types/api-client";

enum ApiClientCommand {
  GetApiClient = "get_api_client",
  SendApiClientRequest = "send_api_client_request",
  NewApiClientRequest = "new_api_client_request",
  OpenApiClientRequest = "open_api_client_request",
  SetApiClientRequestMethod = "set_api_client_request_method",
  SetApiClientRequestUrl = "set_api_client_request_url",
  SetApiClientRequestScheme = "set_api_client_request_scheme",
  SetApiClientRequestAuthority = "set_api_client_request_authority",
  SetApiClientRequestPath = "set_api_client_request_path",
  AddApiClientRequestHeader = "add_api_client_request_header",
  DeleteApiClientRequestHeader = "delete_api_client_request_header",
  SetApiClientRequestHeaderName = "set_api_client_request_header_name",
  SetApiClientRequestHeaderValue = "set_api_client_request_header_value",
  AddApiClientRequestQueryParam = "add_api_client_request_query_param",
  DeleteApiClientRequestQueryParam = "delete_api_client_request_query_param",
  SetApiClientRequestQueryParamName = "set_api_client_request_query_param_name",
  SetApiClientRequestQueryParamValue = "set_api_client_request_query_param_value",
  SetApiClientRequestPathParamValue = "set_api_client_request_path_param_value",
  SetApiClientRequestBody = "set_api_client_request_body",
}

export async function getApiClient(): Promise<ApiClient> {
  return invoke<ApiClient>(ApiClientCommand.GetApiClient);
}

export async function sendApiClientRequest(requestId: string): Promise<void> {
  return invoke(ApiClientCommand.SendApiClientRequest, { requestId });
}

export async function newApiClientRequest(
  collectionName: String
): Promise<ApiClient> {
  return invoke(ApiClientCommand.NewApiClientRequest, { collectionName });
}

export async function openApiClientRequest(
  requestId: String
): Promise<ApiClient> {
  return invoke(ApiClientCommand.OpenApiClientRequest, { requestId });
}

export async function setApiClientRequestMethod(
  requestId: string,
  method: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestMethod, {
    requestId,
    method,
  });
}

export async function setApiClientRequestUrl(
  requestId: string,
  scheme: string,
  authority: string,
  path: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestUrl, {
    requestId,
    scheme,
    authority,
    path,
  });
}

export async function setApiClientRequestScheme(
  requestId: string,
  scheme: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestScheme, {
    requestId,
    scheme,
  });
}

export async function setApiClientRequestAuthority(
  requestId: string,
  authority: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestAuthority, {
    requestId,
    authority,
  });
}

export async function setApiClientRequestPath(
  requestId: string,
  path: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestPath, {
    requestId,
    path,
  });
}

export async function addApiClientRequestHeader(
  requestId: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.AddApiClientRequestHeader, {
    requestId,
  });
}

export async function deleteApiClientRequestHeader(
  requestId: string,
  headerId: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.DeleteApiClientRequestHeader, {
    requestId,
    headerId,
  });
}

export async function setApiClientRequestHeaderName(
  requestId: string,
  headerId: string,
  headerName: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestHeaderName, {
    requestId,
    headerId,
    headerName,
  });
}

export async function setApiClientRequestHeaderValue(
  requestId: string,
  headerId: string,
  headerValue: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestHeaderValue, {
    requestId,
    headerId,
    headerValue,
  });
}

export async function addApiClientRequestQueryParameter(
  requestId: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.AddApiClientRequestQueryParam, {
    requestId,
  });
}

export async function deleteApiClientRequestQueryParameter(
  requestId: string,
  paramId: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.DeleteApiClientRequestQueryParam, {
    requestId,
    paramId,
  });
}

export async function setApiClientRequestQueryParamName(
  requestId: string,
  paramId: string,
  name: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestQueryParamName, {
    requestId,
    paramId,
    name,
  });
}

export async function setApiClientRequestQueryParamValue(
  requestId: string,
  paramId: string,
  value: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestQueryParamValue, {
    requestId,
    paramId,
    value,
  });
}

export async function setApiClientRequestPathParamValue(
  requestId: string,
  paramId: string,
  value: string
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestPathParamValue, {
    requestId,
    paramId,
    value,
  });
}

export async function setApiClientRequestBody(
  requestId: string,
  body?: Uint8Array
): Promise<ApiClient> {
  return invoke(ApiClientCommand.SetApiClientRequestBody, {
    requestId,
    body,
  });
}
