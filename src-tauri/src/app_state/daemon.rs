use tauri_plugin_shell::process::CommandChild;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum DaemonState {
    Stopped,
    Starting,
    Connecting,
    Running,
    Error,
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub struct Daemon {
    state: DaemonState,
    #[serde(skip)]
    sidecar: Option<CommandChild>,
    #[serde(skip)]
    token: Option<String>,
    error: Option<String>,
}

impl Default for Daemon {
    fn default() -> Self {
        Daemon {
            state: DaemonState::Stopped,
            sidecar: None,
            token: None,
            error: None,
        }
    }
}

impl Daemon {
    pub fn set_token(&mut self, token: String) {
        self.token = Some(token);
    }

    pub fn get_token(&self) -> Option<&String> {
        self.token.as_ref()
    }

    pub fn set_starting(&mut self, sidecar: CommandChild) -> Result<(), String> {
        match self.state {
            DaemonState::Stopped => {
                self.state = DaemonState::Starting;
                self.sidecar = Some(sidecar);
                Ok(())
            }
            _ => Err(format!(
                "Invalid state transition from {:?} to Starting",
                self.state
            )),
        }
    }

    pub fn set_connecting(&mut self) -> Result<(), String> {
        match self.state {
            DaemonState::Starting => {
                self.state = DaemonState::Connecting;
                Ok(())
            }
            _ => Err(format!(
                "Invalid state transition from {:?} to Connecting",
                self.state
            )),
        }
    }

    pub fn set_running(&mut self) -> Result<(), String> {
        match self.state {
            DaemonState::Connecting => {
                self.state = DaemonState::Running;
                Ok(())
            }
            _ => Err(format!(
                "Invalid state transition from {:?} to Running",
                self.state
            )),
        }
    }

    pub fn set_error(&mut self, error: String) {
        self.state = DaemonState::Error;
        self.error = Some(error);
    }

    pub fn stop(&mut self) -> Result<(), String> {
        match self.sidecar.take() {
            Some(child) => {
                self.state = DaemonState::Stopped;
                child.kill().map_err(|e| e.to_string())
            }
            None => Err(format!(
                "Invalid state transition from {:?} to Stopped, or sidecar is not running",
                self.state
            )),
        }
    }
}
