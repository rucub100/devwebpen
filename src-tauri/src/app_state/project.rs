use std::sync::atomic::{AtomicU64, Ordering};

use super::session::Session;

#[derive(serde::Serialize, Clone)]
#[serde(rename_all = "lowercase")]
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
