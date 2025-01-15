use std::sync::Mutex;

use daemon::Daemon;
use project::Project;
use session::Session;
use view::ViewState;

pub mod daemon;
pub mod project;
pub mod session;
pub mod view;

#[derive(Default)]
pub struct AppStateInner {
    pub daemon: Daemon,
    pub ephemeral: Option<Session>,
    pub projects: Vec<Project>,
    pub view: ViewState,
}

pub type AppState = Mutex<AppStateInner>;
