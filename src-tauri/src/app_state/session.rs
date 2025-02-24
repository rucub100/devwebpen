use std::sync::atomic::{AtomicU64, Ordering};

/**
 * This is empty at the moment, but it may be a good place for general and common temporary states as opposed to the states like
 * ViewState, Daemon, Proxy, ApiClient, etc. which are more specific to a particular feature.
 */
#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Session {
    pub id: u64,
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
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
