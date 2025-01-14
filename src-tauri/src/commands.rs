use crate::app_state::{AppState, ViewState};

#[tauri::command]
pub fn init_view(state: tauri::State<AppState>) -> Result<ViewState, String> {
    println!("I was invoked from JavaScript!");
    let state = state.lock().unwrap();
    Ok(state.view.clone())
}
