import { invoke } from "@tauri-apps/api/core";
import { ApiClient } from "../../types/api-client";

enum ApiClientCommand {
  GetApiClient = "get_api_client",
  SendApiClientRequest = "send_api_client_request",
  NewApiClientRequest = "new_api_client_request",
  OpenApiClientRequest = "open_api_client_request",
  SetApiClientRequestMethod = "set_api_client_request_method",
  SetApiClientRequestScheme = "set_api_client_request_scheme",
  SetApiClientRequestAuthority = "set_api_client_request_authority",
  SetApiClientRequestPath = "set_api_client_request_path",
  AddApiClientRequestHeader = "add_api_client_request_header",
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
