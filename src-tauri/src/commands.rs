use crate::{
    api_client::{ApiClient, ApiClientInner, HttpRequest},
    app_state::{project::Project, session::Session, store::RecentProject, AppState},
    daemon::{
        command::Command,
        request::{Request, RequestType},
        Daemon, DaemonState,
    },
    events::{emit_event, DevWebPenEvent},
    proxy::{Proxy, ProxyInner},
    view::{nav::NavView, PartialViewState, ViewState},
};

use futures_util::SinkExt;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;
use tokio_tungstenite::tungstenite::Message;

#[tauri::command]
pub async fn init_view<'a>(state: tauri::State<'a, ViewState>) -> Result<PartialViewState, String> {
    let view = state.lock().unwrap();
    Ok(view.clone().into())
}

#[tauri::command]
pub async fn navigate_to<'a>(
    navigation: NavView,
    state: tauri::State<'a, ViewState>,
) -> Result<PartialViewState, String> {
    let mut view = state.lock().unwrap();
    Ok(view.navigate_to(navigation))
}

#[tauri::command]
pub async fn close_tab<'a>(
    id: u64,
    state: tauri::State<'a, ViewState>,
) -> Result<PartialViewState, String> {
    let mut view = state.lock().unwrap();
    Ok(view.close_tab(id))
}

#[tauri::command]
pub async fn select_tab<'a>(
    id: u64,
    state: tauri::State<'a, ViewState>,
) -> Result<PartialViewState, String> {
    let mut view = state.lock().unwrap();
    Ok(view.select_tab(id))
}

#[tauri::command]
pub async fn open_welcome<'a>(
    state: tauri::State<'a, ViewState>,
) -> Result<PartialViewState, String> {
    let mut view = state.lock().unwrap();
    Ok(view.open_welcome())
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

async fn reset<'a>(
    app_handle: tauri::AppHandle,
    view_state: tauri::State<'a, ViewState>,
    proxy: tauri::State<'a, Proxy>,
    daemon: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    {
        let mut view_state = view_state.lock().unwrap();
        let view_state = view_state.reset();
        emit_event(&app_handle, DevWebPenEvent::ViewStateChanged(view_state))
            .map_err(|e| e.to_string())?;
    }
    {
        let mut proxy = proxy.lock().unwrap();
        let proxy = proxy.reset();
        emit_event(&app_handle, DevWebPenEvent::ProxyChanged(proxy)).map_err(|e| e.to_string())?;
    }
    {
        let ws_out = {
            let daemon = daemon.lock().await;
            daemon.get_ws_out()
        };

        let mut ws_out = ws_out.lock().await;
        let ws_out = ws_out.as_mut().ok_or("Websocket not connected")?;

        let uuid = uuid::Uuid::new_v4().to_string();
        let request_type = RequestType::Command;
        let command = Command::Reset;

        let msg = Message::text(format!(
            "{}\n{}\n{}",
            uuid,
            request_type.as_ref(),
            command.as_ref()
        ));

        ws_out.send(msg).await.map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub async fn close_ephemeral_session<'a>(
    app_handle: tauri::AppHandle,
    app_state: tauri::State<'a, AppState>,
    view_state: tauri::State<'a, ViewState>,
    proxy: tauri::State<'a, Proxy>,
    daemon: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    {
        let mut app_state = app_state.lock().unwrap();
        app_state.close_ephemeral_session();
        emit_event(&app_handle, DevWebPenEvent::EphemeralSessionChanged(None))
            .map_err(|e| e.to_string())?;
    }

    return reset(app_handle, view_state, proxy, daemon).await;
}

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

                if let Err(e) = super::store::save(&app_handle) {
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

                if let Err(e) = super::store::save(&app_handle) {
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
    view_state: tauri::State<'a, ViewState>,
    proxy: tauri::State<'a, Proxy>,
    daemon: tauri::State<'a, Daemon>,
) -> Result<(), String> {
    {
        let mut app_state = app_state.lock().unwrap();
        app_state.close_project();
        emit_event(&app_handle, DevWebPenEvent::ProjectChanged(None)).map_err(|e| e.to_string())?;
    }

    return reset(app_handle, view_state, proxy, daemon).await;
}

#[tauri::command]
pub async fn get_daemon_state<'a>(state: tauri::State<'a, Daemon>) -> Result<DaemonState, String> {
    let daemon = state.lock().await;
    Ok(daemon.state.clone())
}

#[tauri::command]
pub async fn get_daemon_error<'a>(
    daemon_state: tauri::State<'a, Daemon>,
) -> Result<Option<String>, String> {
    let daemon = daemon_state.lock().await;
    Ok(daemon.error.clone())
}

#[tauri::command]
pub async fn restart_daemon(app_handle: tauri::AppHandle) -> Result<(), String> {
    crate::daemon::restart(&app_handle).await;
    Ok(())
}

#[tauri::command]
pub async fn start_proxy<'a>(
    daemon_state: tauri::State<'a, Daemon>,
    proxy_state: tauri::State<'a, Proxy>,
) -> Result<(), String> {
    let ws_out = {
        let daemon = daemon_state.lock().await;
        daemon.get_ws_out()
    };
    let port = {
        let proxy = proxy_state.lock().unwrap();
        proxy.get_port()
    };

    let mut ws_out = ws_out.lock().await;
    let ws_out = ws_out.as_mut().ok_or("Websocket not connected")?;

    let req = Request::new(
        RequestType::Command,
        format!("{}:{}", Command::StartProxy.as_ref(), port),
    );
    let msg = Message::text(req.to_string());

    ws_out.send(msg).await.map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn stop_proxy<'a>(daemon_state: tauri::State<'a, Daemon>) -> Result<(), String> {
    let ws_out = {
        let daemon = daemon_state.lock().await;
        daemon.get_ws_out()
    };

    let mut ws_out = ws_out.lock().await;
    let ws_out = ws_out.as_mut().ok_or("Websocket not connected")?;

    let req = Request::new(
        RequestType::Command,
        Command::StopProxy.as_ref().to_string(),
    );
    let msg = Message::text(req.to_string());

    ws_out.send(msg).await.map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn get_proxy_state<'a>(
    proxy_state: tauri::State<'a, Proxy>,
) -> Result<ProxyInner, String> {
    let proxy = proxy_state.lock().unwrap();
    let proxy = proxy.clone();
    Ok(proxy)
}

#[tauri::command]
pub async fn set_proxy_port<'a>(
    port: u16,
    proxy_state: tauri::State<'a, Proxy>,
) -> Result<ProxyInner, String> {
    let mut proxy = proxy_state.lock().unwrap();
    proxy.set_port(port);
    let proxy = proxy.clone();
    Ok(proxy)
}

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
