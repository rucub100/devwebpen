use std::sync::atomic::{AtomicU64, Ordering};

use super::navigation::Navigation;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum TabName {
    Welcome,
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub struct TabKind {
    pub nav: Navigation,
    pub name: TabName,
}

impl TabKind {
    pub fn welcome() -> Self {
        Self {
            nav: Navigation::Dashboard,
            name: TabName::Welcome,
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub struct Tab {
    pub id: u64,
    pub kind: TabKind,
    pub label: Option<String>,
}

impl Tab {
    pub fn next_id() -> u64 {
        static COUNTER: AtomicU64 = AtomicU64::new(0);
        COUNTER.fetch_add(1, Ordering::SeqCst)
    }
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub struct TabsView {
    pub tabs: Vec<Tab>,
    #[serde(rename = "activeTabId")]
    pub active_tab_id: Option<u64>,
}
