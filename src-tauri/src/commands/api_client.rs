use crate::{
    api_client::{ApiClient, ApiClientInner, HttpRequest},
    events::{emit_event, DevWebPenEvent},
    view::ViewState,
};

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
    req: HttpRequest,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    todo!("send");
}

#[tauri::command]
pub async fn new_api_client_request<'a>(
    collection_name: &str,
    app_handle: tauri::AppHandle,
    view_state: tauri::State<'a, ViewState>,
    api_client: tauri::State<'a, ApiClient>,
) -> Result<ApiClientInner, String> {
    let mut api_client = api_client.lock().unwrap();
    let result = api_client.add_request(collection_name);

    if let Err(e) = result {
        return Err(e);
    }

    let req = result.unwrap();

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
    let mut api_client = api_client.lock().unwrap();
    let result = api_client.get_request(request_id);

    if let Err(e) = result {
        return Err(e);
    }

    let req = result.unwrap();

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
    let result = api_client.set_request_method(request_id, method);

    if let Err(e) = result {
        return Err(e);
    }

    Ok(api_client.clone())
}
