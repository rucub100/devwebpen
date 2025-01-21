use std::error::Error;

use serde_json::json;
use tauri::Manager;
use tauri_plugin_store::StoreExt;

use crate::app_state::{
    store::{RecentProject, Store},
    AppState,
};

const STORE_FILE: &str = "devwebpen.store.json";

pub fn load(app: &tauri::App) -> Result<(), Box<dyn Error>> {
    log::debug!("Loading peristent state from store...");
    let store = app.store(STORE_FILE)?;

    log::debug!("{:?}", store.entries());
    let open_recent = store.get("open_recent");

    let mut app_state_store = Store::default();

    if let Some(open_recent) = open_recent {
        let open_recent: Vec<RecentProject> = serde_json::from_value(open_recent)?;
        for project in open_recent {
            app_state_store.add_recent_project(project);
        }
    }

    let state = app.state::<AppState>();
    let mut state = state.lock().unwrap();
    state.store = Some(app_state_store);

    Ok(())
}

pub fn save(app_handle: &tauri::AppHandle) -> Result<(), Box<dyn Error>> {
    log::debug!("Saving peristent state to store...");
    let store = app_handle.store(STORE_FILE)?;

    let state = app_handle.state::<AppState>();
    let state = state.lock().unwrap();
    let state_store = state.store.as_ref();

    if let Some(state_store) = state_store {
        store.set("open_recent", json!(state_store.get_recent_projects()));
    }

    Ok(())
}
