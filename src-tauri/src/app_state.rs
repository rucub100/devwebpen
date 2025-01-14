use std::sync::Mutex;

pub use daemon::Daemon;
pub use project::Project;
pub use session::Session;
pub use view::ViewState;

mod daemon;
mod project;
mod session;
mod view;

#[derive(Default)]
pub struct AppStateInner {
    pub daemon: Daemon,
    pub ephemeral: Option<Session>,
    pub projects: Vec<Project>,
    pub view: ViewState,
}

pub type AppState = Mutex<AppStateInner>;
