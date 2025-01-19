use crate::app_state::{
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
