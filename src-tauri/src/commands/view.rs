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

use crate::view::{nav::NavView, PartialViewState, ViewState};

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

    let mut partial = view.navigate_to(navigation);
    if view.nav == NavView::Proxy {
        partial.merge(view.open_proxy_traffic());
    }

    Ok(partial)
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
pub async fn close_bottom<'a>(
    state: tauri::State<'a, ViewState>,
) -> Result<PartialViewState, String> {
    let mut view = state.lock().unwrap();
    Ok(view.close_bottom())
}

#[tauri::command]
pub async fn close_aside<'a>(
    state: tauri::State<'a, ViewState>,
) -> Result<PartialViewState, String> {
    let mut view = state.lock().unwrap();
    Ok(view.close_aside())
}
