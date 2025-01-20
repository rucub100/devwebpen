use std::{path::Path, sync::Mutex};

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
    pub project: Option<Project>,
    pub view: ViewState,
}

impl AppStateInner {
    pub fn start_ephemeral_session(&mut self) -> Option<Session> {
        if (self.ephemeral.is_some()) {
            log::error!("Ephemeral session already started");
            return None;
        }

        let session = Session::default();
        self.ephemeral = Some(session.clone());
        self.ephemeral.clone()
    }

    pub fn create_project(&mut self, path: String) {
        self.project = Some(Project {
            path,
            name: None,
            description: None,
            session: Session::default(),
        });
    }
}

pub type AppState = Mutex<AppStateInner>;
