use tauri_plugin_shell::process::CommandChild;

#[derive(Debug)]
pub enum DaemonState {
    Stopped,
    Starting,
    Connecting,
    Running,
    Error,
}

pub struct Daemon {
    state: DaemonState,
    sidecar: Option<CommandChild>,
    error: Option<String>,
}

impl Default for Daemon {
    fn default() -> Self {
        Daemon {
            state: DaemonState::Stopped,
            sidecar: None,
            error: None,
        }
    }
}

impl Daemon {
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
}
