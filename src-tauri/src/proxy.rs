use std::sync::Mutex;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum ProxyState {
    Stopped,
    Running,
    Error,
}

impl ProxyState {
    pub fn parse(state: &str) -> Result<ProxyState, String> {
        match state {
            "RUNNING" => Ok(Self::Running),
            "STOPPED" => Ok(Self::Stopped),
            "ERROR" => Ok(Self::Error),
            _ => Err("Failed to parse proxy state".to_string()),
        }
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct SuspendedRequest {
    pub id: String,
    pub method: String,
    pub uri: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ProxyInner {
    state: ProxyState,
    port: u16,
    debug: bool,
    suspended_requests: Vec<SuspendedRequest>,
    error: Option<String>,
}

impl Default for ProxyInner {
    fn default() -> Self {
        ProxyInner {
            state: ProxyState::Stopped,
            port: 9090,
            debug: false,
            suspended_requests: vec![],
            error: None,
        }
    }
}

impl ProxyInner {
    pub fn reset(&mut self) -> ProxyInner {
        *self = ProxyInner::default();
        self.clone()
    }

    pub fn get_port(&self) -> u16 {
        self.port
    }

    pub fn set_port(&mut self, port: u16) -> ProxyInner {
        self.port = port;
        self.clone()
    }

    pub fn set_state(&mut self, state: ProxyState) -> ProxyInner {
        self.state = state;
        self.suspended_requests.clear();
        self.clone()
    }

    pub fn set_error(&mut self, error: String) -> ProxyInner {
        self.state = ProxyState::Error;
        self.error = Some(error);
        self.clone()
    }

    pub fn get_debug(&self) -> bool {
        self.debug
    }

    pub fn set_debug(&mut self, debug: bool) -> ProxyInner {
        self.debug = debug;
        if (!debug) {
            self.suspended_requests.clear();
        }
        self.clone()
    }

    pub fn get_suspended_requests_count(&self) -> usize {
        self.suspended_requests.len()
    }

    pub fn add_suspended_request(&mut self, request: SuspendedRequest) -> ProxyInner {
        self.suspended_requests.push(request);
        self.clone()
    }

    pub fn remove_suspended_request(&mut self, id: &str) -> ProxyInner {
        self.suspended_requests.retain(|r| r.id != id);
        self.clone()
    }
}

pub type Proxy = Mutex<ProxyInner>;
