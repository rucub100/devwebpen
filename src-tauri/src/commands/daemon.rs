// Copyright 2025 Ruslan Curbanov
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
