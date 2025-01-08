use std::sync::{
    atomic::{AtomicU64, Ordering},
    Mutex,
};

use tauri_plugin_shell::process::CommandChild;

pub enum DaemonState {
    Stopped,
    Starting,
    Connecting,
    Running,
    Error(String),
}

impl Default for DaemonState {
    fn default() -> Self {
        DaemonState::Stopped
    }
}

pub struct Session {
    pub id: u64,
}

impl Session {
    fn next_id() -> u64 {
        static COUNTER: AtomicU64 = AtomicU64::new(0);
        COUNTER.fetch_add(1, Ordering::SeqCst)
    }
}

impl Default for Session {
    fn default() -> Self {
        Session {
            id: Session::next_id(),
        }
    }
}

pub struct Project {
    pub id: u64,
    pub name: Option<String>,
    pub description: Option<String>,
    pub path: String,
    pub session: Session,
}

impl Project {
    fn next_id() -> u64 {
        static COUNTER: AtomicU64 = AtomicU64::new(0);
        COUNTER.fetch_add(1, Ordering::SeqCst)
    }
}

impl Default for Project {
    fn default() -> Self {
        Project {
            id: Project::next_id(),
            name: None,
            description: None,
            path: String::default(),
            session: Session::default(),
        }
    }
}

#[derive(Default)]
pub struct ViewState {}

#[derive(Default)]
pub struct AppStateInner {
    pub daemon_state: DaemonState,
    pub deamon_sidecar: Option<CommandChild>,
    pub ephemeral_session: Option<Session>,
    pub projects: Vec<Project>,
    pub view_state: ViewState,
}

pub type AppState = Mutex<AppStateInner>;
