use std::sync::Mutex;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum ProxyState {
    Stopped,
    Running,
    Error,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ProxyInner {
    state: ProxyState,
    port: u16,
    error: Option<String>,
}

impl Default for ProxyInner {
    fn default() -> Self {
        ProxyInner {
            state: ProxyState::Stopped,
            port: 8080,
            error: None,
        }
    }
}

pub type Proxy = Mutex<ProxyInner>;
