use std::{
    hash::{DefaultHasher, Hash, Hasher},
    sync::Mutex,
};

use base64::{prelude::BASE64_STANDARD, Engine};

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

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct SuspendedRequestHttpHeader {
    pub id: String,
    pub name: String,
    pub value: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct SuspendedRequest {
    pub id: String,
    pub protocol_version: String,
    pub method: String,
    pub uri: String,
    pub headers: Option<Vec<SuspendedRequestHttpHeader>>,
    pub body: Option<Vec<u8>>,
}

impl TryFrom<String> for SuspendedRequest {
    type Error = String;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        let lines = value.split("\n").collect::<Vec<&str>>();

        if lines.len() < 3 {
            return Err(format!("Invalid message: {}", value));
        }

        let mut index: usize = 0;

        let id = lines[index].parse::<String>().map_err(|e| e.to_string())?;
        index += 1;
        let protocol_version = lines[index].parse::<String>().map_err(|e| e.to_string())?;
        index += 1;
        let method = lines[index].parse::<String>().map_err(|e| e.to_string())?;
        index += 1;
        let uri = lines[index].parse::<String>().map_err(|e| e.to_string())?;
        index += 1;

        let headers = if index < lines.len() {
            let headers_count = lines[index].parse::<usize>().map_err(|e| e.to_string())?;
            index += 1;
            let mut headers: Vec<SuspendedRequestHttpHeader> = Vec::new();

            for _ in 0..headers_count {
                if index >= lines.len() {
                    return Err(format!("Invalid message: {}", value));
                }

                let header_line = lines[index].split_once(":");

                if header_line.is_none() {
                    return Err(format!("Invalid header line: {}", lines[index]));
                }

                let (name, value) = header_line.unwrap();

                let mut hasher = DefaultHasher::new();
                format!("{}:{}:{}", id, name, value).hash(&mut hasher);
                let header_hash = format!("{:x}", hasher.finish());

                headers.push(SuspendedRequestHttpHeader {
                    id: header_hash,
                    name: name.to_string(),
                    value: value.to_string(),
                });

                index += 1;
            }

            Some(headers)
        } else {
            None
        };

        let body = if index < lines.len() {
            let body = BASE64_STANDARD
                .decode(lines[index])
                .map_err(|e| e.to_string())?;
            Some(body)
        } else {
            None
        };

        Ok(SuspendedRequest {
            id,
            protocol_version,
            method,
            uri,
            headers,
            body,
        })
    }
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
        if !debug {
            self.suspended_requests.clear();
        }
        self.clone()
    }

    pub fn get_suspended_requests_count(&self) -> usize {
        self.suspended_requests.len()
    }

    pub fn set_suspended_requests(&mut self, requests: Vec<SuspendedRequest>) -> ProxyInner {
        self.suspended_requests = requests;
        self.clone()
    }
}

pub type Proxy = Mutex<ProxyInner>;
