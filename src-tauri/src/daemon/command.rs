use std::fmt;

pub enum Command {
    Reset,
    StartProxy,
    StopProxy,
    ProxyDebug,
}

impl fmt::Display for Command {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Command::Reset => write!(f, "RESET"),
            Command::StartProxy => write!(f, "START_PROXY"),
            Command::StopProxy => write!(f, "STOP_PROXY"),
            Command::ProxyDebug => write!(f, "PROXY_DEBUG"),
        }
    }
}
