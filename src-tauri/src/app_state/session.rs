use std::sync::atomic::{AtomicU64, Ordering};

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub struct Session {
    pub id: u64,
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub struct SessionData {}

impl From<Session> for SessionData {
    fn from(_session: Session) -> Self {
        SessionData {}
    }
}

impl From<SessionData> for Session {
    fn from(_session_data: SessionData) -> Self {
        Session {
            id: Session::next_id(),
        }
    }
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
