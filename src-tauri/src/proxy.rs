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
pub struct ProxyInner {
    state: ProxyState,
    port: u16,
    debug: bool,
    error: Option<String>,
}

impl Default for ProxyInner {
    fn default() -> Self {
        ProxyInner {
            state: ProxyState::Stopped,
            port: 9090,
            debug: false,
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
        self.clone()
    }

    pub fn set_error(&mut self, error: String) -> ProxyInner {
        self.state = ProxyState::Error;
        self.error = Some(error);
        self.clone()
    }

    pub fn toggle_debugging(&mut self) -> ProxyInner {
        if self.state == ProxyState::Running {
            self.debug = !self.debug;
        }

        self.clone()
    }
}

pub type Proxy = Mutex<ProxyInner>;
