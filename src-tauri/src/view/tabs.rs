use std::sync::atomic::{AtomicU64, Ordering};

use crate::api_client::HttpRequest;

use super::nav::NavView;

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum TabName {
    Welcome,
    ApiRequest,
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TabKind {
    pub nav: NavView,
    pub name: TabName,
}

impl TabKind {
    pub fn welcome() -> Self {
        Self {
            nav: NavView::Dashboard,
            name: TabName::Welcome,
        }
    }

    pub fn api_request() -> Self {
        Self {
            nav: NavView::ApiClient,
            name: TabName::ApiRequest,
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Tab {
    pub id: u64,
    pub kind: TabKind,
    pub label: Option<String>,
    pub data: Option<String>,
}

impl Tab {
    pub fn next_id() -> u64 {
        static COUNTER: AtomicU64 = AtomicU64::new(0);
        COUNTER.fetch_add(1, Ordering::SeqCst)
    }

    pub fn new_welcome() -> Self {
        Self {
            id: Self::next_id(),
            kind: TabKind::welcome(),
            label: Some("Welcome".to_string()),
            data: None,
        }
    }

    pub fn new_api_request(req: HttpRequest) -> Self {
        Self {
            id: Self::next_id(),
            kind: TabKind::api_request(),
            label: Some(req.method),
            data: Some(req.id.to_string()),
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TabsView {
    pub tabs: Vec<Tab>,
    pub active_tab_id: Option<u64>,
}
