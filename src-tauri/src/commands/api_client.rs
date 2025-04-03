// Copyright 2025 Ruslan Curbanov
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use crate::{
    api_client::{ApiClient, ApiClientInner},
    daemon::{request::Request, Daemon},
    events::{emit_event, DevWebPenEvent},
    view::ViewState,
};

use super::send_daemon_request;

#[tauri::command]
pub async fn get_api_client<'a>(
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let api_client = api_client.lock().unwrap();
    let api_client = api_client.clone();
    Ok(api_client)
}

#[tauri::command]
pub async fn send_api_client_request<'a>(
    request_id: &str,
    api_client: tauri::State<'a, ApiClient>,
    daemon_state: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    let req = {
        let api_client = api_client.lock().unwrap();
        let req = api_client.get_request(request_id)?;

        Request::from(&req)
    };

    send_daemon_request(daemon_state, req).await?;

    Ok(())
}

#[tauri::command]
pub async fn new_api_client_request<'a>(
    collection_name: &str,
    app_handle: tauri::AppHandle,
    view_state: tauri::State<'a, ViewState>,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    let req = api_client.add_request(collection_name)?;

    let mut view_state = view_state.lock().unwrap();
    let view_stete = view_state.open_api_client_request(req);
    emit_event(&app_handle, DevWebPenEvent::ViewStateChanged(view_stete))
        .map_err(|e| e.to_string())?;

    Ok(api_client.clone())
}

#[tauri::command]
pub async fn open_api_client_request<'a>(
    request_id: &str,
    app_handle: tauri::AppHandle,
    view_state: tauri::State<'a, ViewState>,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<(), String> {
    let api_client = api_client.lock().unwrap();
    let req = api_client.get_request(request_id)?;

    let mut view_state = view_state.lock().unwrap();
    let view_stete = view_state.open_api_client_request(req);
    emit_event(&app_handle, DevWebPenEvent::ViewStateChanged(view_stete))
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn set_api_client_request_method<'a>(
    request_id: &str,
    method: &str,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.set_request_method(request_id, method)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn set_api_client_request_url<'a>(
    request_id: &str,
    scheme: &str,
    authority: &str,
    path: &str,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.set_request_url(request_id, scheme, authority, path)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn set_api_client_request_scheme<'a>(
    request_id: &str,
    scheme: &str,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.set_request_scheme(request_id, scheme)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn set_api_client_request_authority<'a>(
    request_id: &str,
    authority: &str,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.set_request_authority(request_id, authority)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn set_api_client_request_path<'a>(
    request_id: &str,
    path: &str,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.set_request_path(request_id, path)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn add_api_client_request_header<'a>(
    request_id: &str,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.add_request_header(request_id)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn delete_api_client_request_header<'a>(
    request_id: &str,
    header_id: &str,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.delete_request_header(request_id, header_id)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn set_api_client_request_header_name<'a>(
    request_id: &str,
    header_id: &str,
    header_name: String,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.set_request_header_name(request_id, header_id, header_name)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn set_api_client_request_header_value<'a>(
    request_id: &str,
    header_id: &str,
    header_value: String,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.set_request_header_value(request_id, header_id, header_value)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn add_api_client_request_query_param<'a>(
    request_id: &str,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.add_request_query_param(request_id)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn delete_api_client_request_query_param<'a>(
    request_id: &str,
    param_id: &str,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.delete_request_query_param(request_id, param_id)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn set_api_client_request_query_param_name<'a>(
    request_id: &str,
    param_id: &str,
    name: String,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.set_request_query_param_name(request_id, param_id, name)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn set_api_client_request_query_param_value<'a>(
    request_id: &str,
    param_id: &str,
    value: String,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.set_request_query_param_value(request_id, param_id, value)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn set_api_client_request_path_param_value<'a>(
    request_id: &str,
    param_id: &str,
    value: String,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    api_client.set_request_path_param_value(request_id, param_id, value)?;
    Ok(api_client.clone())
}

#[tauri::command]
pub async fn set_api_client_request_body<'a>(
    request_id: &str,
    body: Option<Vec<u8>>,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    let result = api_client.set_request_body(request_id, body);

    if let Err(e) = result {
        return Err(e);
    }

    Ok(api_client.clone())
}
