use std::{collections::HashMap, sync::Mutex};

use uuid::Uuid;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum HttpVersion {
    Http_1_1,
    Http_2,
    Http_3,
}

impl HttpVersion {
    pub fn parse(state: &str) -> Result<HttpVersion, String> {
        match state {
            "HTTP/1.1" => Ok(Self::Http_1_1),
            "HTTP/2" => Ok(Self::Http_2),
            "HTTP/3" => Ok(Self::Http_3),
            _ => Err("Failed to parse HTTP version".to_string()),
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HeaderValue {
    pub name: String,
    pub value: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HttpRequest {
    pub id: Uuid,
    pub method: String,
    pub scheme: String,
    pub authority: String,
    pub path: String,
    pub version: HttpVersion,
    pub query_params: Option<HashMap<String, String>>,
    pub path_params: Option<HashMap<String, String>>,
    pub headers: HashMap<Uuid, HeaderValue>,
    pub body: Option<Vec<u8>>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HttpResponse {
    pub version: HttpVersion,
    pub status: u16,
    pub headers: HashMap<Uuid, HeaderValue>,
    pub body: Option<Vec<u8>>,
    pub request_id: Uuid,
    pub response_time_ms: u64,
    pub response_size_bytes: u64,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ApiCollection {
    pub name: String,
    pub description: Option<String>,
    pub requests: Vec<HttpRequest>,
    pub variables: Option<HashMap<String, String>>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ApiEnvironment {
    pub name: String,
    pub description: Option<String>,
    pub variables: HashMap<String, String>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ApiClientInner {
    pub collections: Vec<ApiCollection>,
    pub environments: Vec<ApiEnvironment>,
    pub history: Vec<(HttpRequest, HttpResponse)>,
}

impl Default for ApiClientInner {
    fn default() -> Self {
        ApiClientInner {
            collections: vec![ApiCollection {
                name: "Default Collection".to_string(),
                description: None,
                requests: vec![],
                variables: None,
            }],
            environments: vec![],
            history: vec![],
        }
    }
}

impl ApiClientInner {
    fn _find_request_mut(&mut self, request_id: &str) -> Result<&mut HttpRequest, String> {
        let req = self
            .collections
            .iter_mut()
            .find_map(|c| {
                c.requests
                    .iter_mut()
                    .find(|r| r.id.to_string() == request_id)
            })
            .ok_or_else(|| "Request not found".to_string())?;

        Ok(req)
    }

    pub fn add_request(&mut self, collection_name: &str) -> Result<HttpRequest, String> {
        let collection = self
            .collections
            .iter_mut()
            .find(|c| c.name == collection_name);

        if let None = collection {
            return Err("Collection not found".to_string());
        }

        let req = HttpRequest {
            id: Uuid::new_v4(),
            method: "GET".to_string(),
            scheme: "https".to_string(),
            authority: String::new(),
            path: "/".to_string(),
            path_params: None,
            query_params: None,
            version: HttpVersion::Http_1_1,
            headers: HashMap::new(),
            body: None,
        };

        let collection = collection.unwrap();
        collection.requests.push(req.clone());

        Ok(req)
    }

    pub fn get_request(&self, request_id: &str) -> Result<HttpRequest, String> {
        self.collections
            .iter()
            .find_map(|c| {
                c.requests
                    .iter()
                    .find(|r| r.id.to_string() == request_id)
                    .map(|r| r.clone())
            })
            .ok_or_else(|| "Request not found".to_string())
    }

    pub fn set_request_method(&mut self, request_id: &str, method: &str) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;
        req.method = method.to_string();
        Ok(())
    }

    pub fn set_request_scheme(&mut self, request_id: &str, scheme: &str) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;
        req.scheme = scheme.to_string();
        Ok(())
    }

    pub fn set_request_authority(
        &mut self,
        request_id: &str,
        authority: &str,
    ) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;
        req.authority = authority.to_string();
        Ok(())
    }

    pub fn set_request_path(&mut self, request_id: &str, path: &str) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;
        req.path = path.to_string();
        Ok(())
    }

    pub fn add_request_header(&mut self, request_id: &str) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;
        req.headers.insert(
            Uuid::new_v4(),
            HeaderValue {
                name: "".to_string(),
                value: "".to_string(),
            },
        );
        Ok(())
    }
}

pub type ApiClient = Mutex<ApiClientInner>;
