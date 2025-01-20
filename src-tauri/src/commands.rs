use crate::app_state::{
    project::Project,
    session::Session,
    view::{nav::NavView, PartialViewState},
    AppState,
};

use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

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

#[tauri::command]
pub fn get_project(state: tauri::State<AppState>) -> Result<Option<Project>, String> {
    let state = state.lock().unwrap();
    Ok(state.project.clone())
}

#[tauri::command]
pub async fn create_project(
    app_handle: tauri::AppHandle,
    window: tauri::Window,
) -> Result<Option<Project>, String> {
    let file_path = app_handle
        .dialog()
        .file()
        .set_parent(&window)
        .add_filter("Devwebpen Project", &["dwp", "devwp", "devwebpen"])
        .blocking_save_file();

    if let Some(file_path) = file_path {
        if let Some(path) = file_path.as_path() {
            if let Some(path) = path.to_str() {
                let state = app_handle.state::<AppState>();
                let mut state = state.lock().unwrap();
                state.create_project(path.to_string());
                return Ok(state.project.clone());
            } else {
                return Err("Path contains non-UTF8 characters".to_string());
            }
        } else {
            return Err("Invalid file path".to_string());
        }
    }

    Ok(None)
}
