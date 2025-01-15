use crate::app_state::{
    view::{Navigation, ViewState},
    AppState,
};

#[tauri::command]
pub fn init_view(state: tauri::State<AppState>) -> Result<ViewState, String> {
    let state = state.lock().unwrap();
    Ok(state.view.clone())
}

#[tauri::command]
pub fn navigation(
    navigation: Navigation,
    state: tauri::State<AppState>,
) -> Result<ViewState, String> {
    let mut state = state.lock().unwrap();
    state.view.navigate(navigation);
    Ok(state.view.clone())
}
