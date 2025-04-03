// Copyright 2025 Ruslan Curbanov
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
