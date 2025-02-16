use crate::daemon::{Daemon, DaemonState};

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
