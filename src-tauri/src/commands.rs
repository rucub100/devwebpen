use crate::app_state::{
    session::Session,
    view::{nav::NavView, PartialViewState},
    AppState,
};

#[tauri::command]
pub fn init_view(state: tauri::State<AppState>) -> Result<PartialViewState, String> {
    let state = state.lock().unwrap();
    Ok(state.view.clone().into())
}

#[tauri::command]
pub fn navigate_to(
    navigation: NavView,
    state: tauri::State<AppState>,
) -> Result<PartialViewState, String> {
    let mut state = state.lock().unwrap();
    Ok(state.view.navigate_to(navigation))
}

#[tauri::command]
pub fn close_tab(id: u64, state: tauri::State<AppState>) -> Result<PartialViewState, String> {
    let mut state = state.lock().unwrap();
    Ok(state.view.close_tab(id))
}

#[tauri::command]
pub fn select_tab(id: u64, state: tauri::State<AppState>) -> Result<PartialViewState, String> {
    let mut state = state.lock().unwrap();
    Ok(state.view.select_tab(id))
}

#[tauri::command]
pub fn open_welcome(state: tauri::State<AppState>) -> Result<PartialViewState, String> {
    let mut state = state.lock().unwrap();
    Ok(state.view.open_welcome())
}

#[tauri::command]
pub fn get_ephemeral_session(state: tauri::State<AppState>) -> Result<Option<Session>, String> {
    let state = state.lock().unwrap();
    Ok(state.ephemeral.clone())
}

#[tauri::command]
pub fn start_ephemeral_session(state: tauri::State<AppState>) -> Result<Session, String> {
    let mut state = state.lock().unwrap();
    let session = state.start_ephemeral_session();

    if let Some(session) = session {
        Ok(session)
    } else {
        Err("Failed to start ephemeral session".to_string())
    }
}
