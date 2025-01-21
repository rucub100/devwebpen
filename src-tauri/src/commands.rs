use crate::app_state::{
    project::Project,
    session::Session,
    view::{nav::NavView, PartialViewState},
    AppState,
};

use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

#[tauri::command]
pub async fn init_view<'a>(state: tauri::State<'a, AppState>) -> Result<PartialViewState, String> {
    let state = state.lock().unwrap();
    Ok(state.view.clone().into())
}

#[tauri::command]
pub async fn navigate_to<'a>(
    navigation: NavView,
    state: tauri::State<'a, AppState>,
) -> Result<PartialViewState, String> {
    let mut state = state.lock().unwrap();
    Ok(state.view.navigate_to(navigation))
}

#[tauri::command]
pub async fn close_tab<'a>(
    id: u64,
    state: tauri::State<'a, AppState>,
) -> Result<PartialViewState, String> {
    let mut state = state.lock().unwrap();
    Ok(state.view.close_tab(id))
}

#[tauri::command]
pub async fn select_tab<'a>(
    id: u64,
    state: tauri::State<'a, AppState>,
) -> Result<PartialViewState, String> {
    let mut state = state.lock().unwrap();
    Ok(state.view.select_tab(id))
}

#[tauri::command]
pub async fn open_welcome<'a>(
    state: tauri::State<'a, AppState>,
) -> Result<PartialViewState, String> {
    let mut state = state.lock().unwrap();
    Ok(state.view.open_welcome())
}

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
pub async fn get_project<'a>(state: tauri::State<'a, AppState>) -> Result<Option<Project>, String> {
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
                let project: Project;
                {
                    let state = app_handle.state::<AppState>();
                    let mut state = state.lock().unwrap();
                    project = state.create_project(path.to_string());
                }

                let save = project.save().await;

                if let Err(e) = save {
                    let state = app_handle.state::<AppState>();
                    let mut state = state.lock().unwrap();
                    state.discard_current_project();
                    return Err(e);
                }

                return Ok(Some(project));
            } else {
                return Err("Path contains non-UTF8 characters".to_string());
            }
        } else {
            return Err("Invalid file path".to_string());
        }
    }

    Ok(None)
}

#[tauri::command]
pub async fn open_project(
    app_handle: tauri::AppHandle,
    window: tauri::Window,
) -> Result<Option<Project>, String> {
    let file_path = app_handle
        .dialog()
        .file()
        .set_parent(&window)
        .add_filter("Devwebpen Project", &["dwp", "devwp", "devwebpen"])
        .blocking_pick_file();

    if let Some(file_path) = file_path {
        if let Some(path) = file_path.as_path() {
            if let Some(path) = path.to_str() {
                let project = Project::load(path.to_string()).await;

                if let Err(e) = project {
                    return Err(e);
                }

                let state = app_handle.state::<AppState>();
                let mut state = state.lock().unwrap();
                let project = state.open_project(project.unwrap());

                return Ok(Some(project));
            } else {
                return Err("Path contains non-UTF8 characters".to_string());
            }
        } else {
            return Err("Invalid file path".to_string());
        }
    }

    Ok(None)
}
