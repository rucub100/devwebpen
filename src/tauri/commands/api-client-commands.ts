import { invoke } from "@tauri-apps/api/core";
import { ApiClient } from "../../types/api-client";

enum ApiClientCommand {
  GetApiClient = "get_api_client",
  SendApiClientRequest = "send_api_client_request",
  NewApiClientRequest = "new_api_client_request",
  OpenApiClientRequest = "open_api_client_request",
  SetApiClientRequestMethod = "set_api_client_request_method",
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
