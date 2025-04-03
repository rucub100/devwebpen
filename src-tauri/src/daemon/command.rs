use std::fmt;

pub enum Command {
    Reset,
    StartProxy,
    StopProxy,
    ProxyDebug,
    ProxyForward,
    ProxyForwardAll,
    ProxyDrop,
    ProxyDropAll,
    ProxySuspendedContent,
}

impl fmt::Display for Command {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Command::Reset => write!(f, "RESET"),
            Command::StartProxy => write!(f, "START_PROXY"),
            Command::StopProxy => write!(f, "STOP_PROXY"),
            Command::ProxyDebug => write!(f, "PROXY_DEBUG"),
            Command::ProxyForward => write!(f, "PROXY_FORWARD"),
            Command::ProxyForwardAll => write!(f, "PROXY_FORWARD_ALL"),
            Command::ProxyDrop => write!(f, "PROXY_DROP"),
            Command::ProxyDropAll => write!(f, "PROXY_DROP_ALL"),
            Command::ProxySuspendedContent => write!(f, "PROXY_SUSPENDED_CONTENT"),
        }
    }
}
