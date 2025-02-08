pub enum Command {
    Reset,
    StartProxy,
    StopProxy,
}

impl AsRef<str> for Command {
    fn as_ref(&self) -> &str {
        match self {
            Command::Reset => "RESET",
            Command::StartProxy => "START_PROXY",
            Command::StopProxy => "STOP_PROXY",
        }
    }
}
