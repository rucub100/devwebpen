use std::sync::Mutex;

use project::Project;
use session::Session;
use store::Store;

pub mod project;
pub mod session;
pub mod store;

#[derive(Default)]
pub struct AppStateInner {
    pub ephemeral: Option<Session>,
    pub project: Option<Project>,
    pub store: Option<Store>,
}

impl AppStateInner {
    pub fn start_ephemeral_session(&mut self) -> Option<Session> {
        if self.ephemeral.is_some() {
            log::error!("Ephemeral session already started");
            return None;
        }

        let session = Session::default();
        self.ephemeral = Some(session.clone());
        self.ephemeral.clone()
    }

    pub fn close_ephemeral_session(&mut self) {
        self.ephemeral = None;
    }

    pub fn create_project(&mut self, path: String) -> Project {
        let project = Project {
            path,
            name: None,
            description: None,
            session: Session::default(),
        };
        self.project = Some(project.clone());
        self.store
            .as_mut()
            .unwrap()
            .add_recent_project((&project).into());
        project
    }

    pub fn discard_current_project(&mut self) {
        self.project = None;
    }

    pub fn open_project(&mut self, project: Project) -> Project {
        self.project = Some(project.clone());
        self.store
            .as_mut()
            .unwrap()
            .add_recent_project((&project).into());
        project
    }

    pub fn close_project(&mut self) {
        self.project = None;
    }

    pub fn add_error(&mut self, error: String) {
        if self.ephemeral.is_some() {
            self.ephemeral.as_mut().unwrap().add_error(error);
        } else if self.project.is_some() {
            self.project.as_mut().unwrap().session.add_error(error);
        } else {
            log::error!("No session or project to add error to");
        }
    }
}

pub type AppState = Mutex<AppStateInner>;
