use crate::{
    app_state::{session::Session, AppState},
    daemon::Daemon,
    events::{emit_event, DevWebPenEvent},
    proxy::Proxy,
    view::ViewState,
};

use super::reset;

#[tauri::command]
pub async fn get_ephemeral_session<'a>(
    state: tauri::State<'a, AppState>,
) -> Result<Option<Session>, String> {
    let state = state.lock().unwrap();
    Ok(state.ephemeral.clone())
}

#[tauri::command]
pub async fn start_ephemeral_session<'a>(
    state: tauri::State<'a, AppState>,
) -> Result<Session, String> {
    let mut state = state.lock().unwrap();
    let session = state.start_ephemeral_session();

    if let Some(session) = session {
        Ok(session)
    } else {
        Err("Failed to start ephemeral session".to_string())
    }
}

#[tauri::command]
pub async fn close_ephemeral_session<'a>(
    app_handle: tauri::AppHandle,
    app_state: tauri::State<'a, AppState>,
) -> Result<(), String> {
    {
        let mut app_state = app_state.lock().unwrap();
        app_state.close_ephemeral_session();
        emit_event(&app_handle, DevWebPenEvent::EphemeralSessionChanged(None))
            .map_err(|e| e.to_string())?;
    }

    return reset(&app_handle).await;
}
