use crate::{
    app_state::{project::Project, store::RecentProject, AppState},
    daemon::Daemon,
    events::{emit_event, DevWebPenEvent},
    proxy::Proxy,
    view::ViewState,
};

use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

use super::reset;

#[tauri::command]
pub async fn get_project<'a>(state: tauri::State<'a, AppState>) -> Result<Option<Project>, String> {
    let state = state.lock().unwrap();
    Ok(state.project.clone())
}

#[tauri::command]
pub async fn get_recent_projects<'a>(
    state: tauri::State<'a, AppState>,
) -> Result<Vec<RecentProject>, String> {
    let state = state.lock().unwrap();

    if let Some(store) = &state.store {
        Ok(store.get_recent_projects())
    } else {
        Ok(vec![])
    }
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

                if let Err(e) = crate::store::save(&app_handle) {
                    log::error!("Failed to save state: {}", e);
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

async fn load_project_from_path(
    path: &str,
    app_handle: &tauri::AppHandle,
) -> Result<Project, String> {
    let project = Project::load(path.to_string()).await;

    if let Err(e) = project {
        return Err(e);
    }

    let state = app_handle.state::<AppState>();
    let mut state = state.lock().unwrap();
    let project = state.open_project(project.unwrap());

    Ok(project)
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
                let project = load_project_from_path(path, &app_handle).await;

                if let Err(e) = project {
                    return Err(e);
                }

                if let Err(e) = crate::store::save(&app_handle) {
                    log::error!("Failed to save state: {}", e);
                }

                return Ok(Some(project.unwrap()));
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
pub async fn open_recent_project(
    path: &str,
    app_handle: tauri::AppHandle,
) -> Result<Option<Project>, String> {
    let project = load_project_from_path(path, &app_handle).await;

    if let Err(e) = project {
        return Err(e);
    }

    return Ok(Some(project.unwrap()));
}

#[tauri::command]
pub async fn close_project<'a>(
    app_handle: tauri::AppHandle,
    app_state: tauri::State<'a, AppState>,
) -> Result<(), String> {
    {
        let mut app_state = app_state.lock().unwrap();
        app_state.close_project();
        emit_event(&app_handle, DevWebPenEvent::ProjectChanged(None)).map_err(|e| e.to_string())?;
    }

    return reset(&app_handle).await;
}
