use crate::app_state::{
    view::{navigation::Navigation, ViewState},
    AppState,
};

#[tauri::command]
pub fn init_view(state: tauri::State<AppState>) -> Result<ViewState, String> {
    let state = state.lock().unwrap();
    Ok(state.view.clone())
}

#[tauri::command]
pub fn navigate_to(
    navigation: Navigation,
    state: tauri::State<AppState>,
) -> Result<ViewState, String> {
    let mut state = state.lock().unwrap();
    state.view.navigate_to(navigation);
    Ok(state.view.clone())
}

#[tauri::command]
pub fn close_tab(id: u64, state: tauri::State<AppState>) -> Result<ViewState, String> {
    let mut state = state.lock().unwrap();
    state.view.close_tab(id);
    Ok(state.view.clone())
}

#[tauri::command]
pub fn select_tab(id: u64, state: tauri::State<AppState>) -> Result<Option<ViewState>, String> {
    let mut state = state.lock().unwrap();
    let changed = state.view.select_tab(id);
    Ok(if changed {
        Some(state.view.clone())
    } else {
        None
    })
}

#[tauri::command]
pub fn open_welcome(state: tauri::State<AppState>) -> Result<Option<ViewState>, String> {
    let mut state = state.lock().unwrap();
    let changed = state.view.open_welcome();
    Ok(if changed {
        Some(state.view.clone())
    } else {
        None
    })
}
