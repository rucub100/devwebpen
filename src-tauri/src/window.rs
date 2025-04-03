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

use tauri::{Manager, Window, WindowEvent};

use crate::daemon::Daemon;

pub fn window_event_handler(window: &Window, event: &WindowEvent) {
    let app_handle = window.app_handle().clone();
    log::trace!("Window event: {:?}", event);
    match window.label() {
        "main" => match event {
            WindowEvent::CloseRequested { .. } => {
                log::debug!("Close requested on main window");
                let state = app_handle.state::<Daemon>();
                let mut daemon = tauri::async_runtime::block_on(state.lock());
                if let Err(e) = daemon.stop() {
                    log::error!("Error stopping daemon: {}", e);
                }
            }
            _ => {}
        },
        _ => {}
    }
}
