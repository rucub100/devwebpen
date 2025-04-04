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

use std::{fmt, sync::Mutex};

use base64::prelude::*;
use uuid::Uuid;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub enum HttpVersion {
    #[serde(rename = "HTTP/1.1")]
    #[serde(alias = "HTTP/1.1")]
    Http11,
    #[serde(rename = "HTTP/2")]
    #[serde(alias = "HTTP/2")]
    Http2,
    #[serde(rename = "HTTP/3")]
    #[serde(alias = "HTTP/3")]
    Http3,
}

impl HttpVersion {
    pub fn parse(state: &str) -> Result<HttpVersion, String> {
        match state {
            "HTTP/1.1" => Ok(Self::Http11),
            "HTTP/2" => Ok(Self::Http2),
            "HTTP/3" => Ok(Self::Http3),
            _ => Err("Failed to parse HTTP version".to_string()),
        }
    }
}

impl fmt::Display for HttpVersion {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Http11 => write!(f, "HTTP/1.1"),
            Self::Http2 => write!(f, "HTTP/2"),
            Self::Http3 => write!(f, "HTTP/3"),
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HttpPathParameter {
    pub id: Uuid,
    pub name: String,
    pub value: String,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HttpQueryParameter {
    pub id: Uuid,
    pub name: String,
    pub value: String,
}

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HttpHeader {
    pub id: Uuid,
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
    pub http_version: HttpVersion,
    pub query_params: Option<Vec<HttpQueryParameter>>,
    pub path_params: Option<Vec<HttpPathParameter>>,
    pub headers: Vec<HttpHeader>,
    pub body: Option<Vec<u8>>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum HttpRequestErrorCode {
    UnknownError,
    UnsupportedHttpVersion,
    UnsupportedHttpMethod,
    InvalidUri,
}

impl<T> From<T> for HttpRequestErrorCode
where
    T: Into<u64>,
{
    fn from(error: T) -> Self {
        match error.into() {
            0 => Self::UnknownError,
            1 => Self::UnsupportedHttpVersion,
            2 => Self::UnsupportedHttpMethod,
            3 => Self::InvalidUri,
            _ => Self::UnknownError,
        }
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HttpRequestError {
    pub request_id: Uuid,
    pub error_code: HttpRequestErrorCode,
    pub error_message: String,
}

impl fmt::Display for HttpRequestError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{} (code: {:?}; request_id: {})",
            self.error_message, self.error_code, self.request_id
        )
    }
}

impl TryFrom<String> for HttpRequestError {
    type Error = String;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        let lines = value.split("\n").collect::<Vec<&str>>();

        if lines.len() < 3 {
            return Err(format!("Invalid message: {}", value));
        }

        let request_id = Uuid::parse_str(lines[0]).map_err(|e| e.to_string())?;
        let error_code = lines[1].parse::<u64>().map_err(|e| e.to_string())?;
        let error_message = lines[2].to_string();

        Ok(HttpRequestError {
            request_id,
            error_code: error_code.into(),
            error_message,
        })
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HttpResponse {
    pub request_id: Uuid,
    pub status: u16,
    pub http_version: HttpVersion,
    pub headers: Vec<HttpHeader>,
    pub response_time_ms: u64,
    pub response_size_bytes: u64,
    pub body: Option<Vec<u8>>,
}

impl TryFrom<String> for HttpResponse {
    type Error = String;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        let lines = value.split("\n").collect::<Vec<&str>>();

        if lines.len() < 6 {
            return Err(format!("Invalid message: {}", value));
        }

        let mut index: usize = 0;

        let request_id = Uuid::parse_str(lines[index]).map_err(|e| e.to_string())?;
        index += 1;
        let status = lines[index].parse::<u16>().map_err(|e| e.to_string())?;
        index += 1;
        let http_version = HttpVersion::parse(lines[index])?;
        index += 1;
        let headers_count = lines[index].parse::<usize>().map_err(|e| e.to_string())?;
        index += 1;
        let mut headers: Vec<HttpHeader> = Vec::new();

        for _ in 0..headers_count {
            if index >= lines.len() {
                return Err(format!("Invalid message: {}", value));
            }

            let header_line = lines[index].split_once(":");

            if header_line.is_none() {
                return Err(format!("Invalid header line: {}", lines[index]));
            }

            let (name, value) = header_line.unwrap();

            headers.push(HttpHeader {
                id: Uuid::new_v4(),
                name: name.to_string(),
                value: value.to_string(),
            });

            index += 1;
        }

        let response_time_ms = lines[index].parse::<u64>().map_err(|e| e.to_string())?;
        index += 1;
        let response_size_bytes = lines[index].parse::<u64>().map_err(|e| e.to_string())?;
        index += 1;

        let body = if index < lines.len() {
            let body = BASE64_STANDARD
                .decode(lines[index])
                .map_err(|e| e.to_string())?;
            Some(body)
        } else {
            None
        };

        Ok(HttpResponse {
            request_id,
            status,
            http_version,
            headers,
            response_time_ms,
            response_size_bytes,
            body,
        })
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ApiCollection {
    pub name: String,
    pub description: Option<String>,
    pub requests: Vec<HttpRequest>,
    pub variables: Option<Vec<(String, String)>>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ApiEnvironment {
    pub name: String,
    pub description: Option<String>,
    pub variables: Vec<(String, String)>,
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

    fn _find_request_header_mut(
        &mut self,
        request_id: &str,
        header_id: &str,
    ) -> Result<&mut HttpHeader, String> {
        let req = self._find_request_mut(request_id)?;
        let header = req
            .headers
            .iter_mut()
            .find(|header| header.id.to_string() == header_id)
            .ok_or_else(|| "Header not found".to_string())?;
        Ok(header)
    }

    fn _find_request_query_param_mut(
        &mut self,
        request_id: &str,
        param_id: &str,
    ) -> Result<&mut HttpQueryParameter, String> {
        let req = self._find_request_mut(request_id)?;
        let param = req
            .query_params
            .as_mut()
            .ok_or_else(|| "Query parameters not found".to_string())?
            .iter_mut()
            .find(|param| param.id.to_string() == param_id)
            .ok_or_else(|| "Query parameter not found".to_string())?;
        Ok(param)
    }

    fn _find_request_path_param_mut(
        &mut self,
        request_id: &str,
        param_id: &str,
    ) -> Result<&mut HttpPathParameter, String> {
        let req = self._find_request_mut(request_id)?;
        let param = req
            .path_params
            .as_mut()
            .ok_or_else(|| "Path parameters not found".to_string())?
            .iter_mut()
            .find(|param| param.id.to_string() == param_id)
            .ok_or_else(|| "Path parameter not found".to_string())?;
        Ok(param)
    }

    fn _update_request_path_params(req: &mut HttpRequest) {
        let path = match req.path.find("?") {
            Some(index) => &req.path[0..index],
            None => &req.path,
        };

        let path_params: Vec<String> = path
            .split("/")
            .filter(|segment| segment.starts_with(":"))
            .map(|segment| segment.to_string())
            .collect();

        if path_params.len() > 0 {
            if req.path_params.is_none() {
                req.path_params = Some(Vec::new());
            }
        }

        // Remove path params that are no longer in the path
        if req.path_params.is_none() {
            req.path_params = Some(Vec::new());
        }
        let req_path_params = req.path_params.as_mut().unwrap();
        req_path_params.retain(|path_param| path_params.contains(&path_param.name));

        for path_param in path_params {
            if !req_path_params.iter().any(|p| p.name == path_param) {
                req_path_params.push(HttpPathParameter {
                    id: Uuid::new_v4(),
                    name: path_param,
                    value: String::new(),
                });
            }
        }
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
            http_version: HttpVersion::Http11,
            headers: Vec::new(),
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

    pub fn set_request_url(
        &mut self,
        request_id: &str,
        scheme: &str,
        authority: &str,
        path: &str,
    ) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;
        req.scheme = scheme.to_string();
        req.authority = authority.to_string();
        req.path = path.to_string();
        Self::_update_request_path_params(req);
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
        Self::_update_request_path_params(req);
        Ok(())
    }

    pub fn add_request_query_param(&mut self, request_id: &str) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;

        if req.query_params.is_none() {
            req.query_params = Some(Vec::new());
        }

        req.query_params.as_mut().unwrap().push(HttpQueryParameter {
            id: Uuid::new_v4(),
            name: "".to_string(),
            value: "".to_string(),
        });

        Ok(())
    }

    pub fn set_request_query_param_name(
        &mut self,
        request_id: &str,
        param_id: &str,
        name: String,
    ) -> Result<(), String> {
        let param = self._find_request_query_param_mut(request_id, param_id)?;
        param.name = name;
        Ok(())
    }

    pub fn set_request_query_param_value(
        &mut self,
        request_id: &str,
        param_id: &str,
        value: String,
    ) -> Result<(), String> {
        let param = self._find_request_query_param_mut(request_id, param_id)?;
        param.value = value;
        Ok(())
    }

    pub fn set_request_path_param_value(
        &mut self,
        request_id: &str,
        param_id: &str,
        value: String,
    ) -> Result<(), String> {
        let param = self._find_request_path_param_mut(request_id, param_id)?;
        param.value = value;
        Ok(())
    }

    pub fn delete_request_query_param(
        &mut self,
        request_id: &str,
        param_id: &str,
    ) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;

        if req.query_params.is_none() {
            return Err("Query parameters not found".to_string());
        }

        req.query_params
            .as_mut()
            .unwrap()
            .retain(|param| param.id.to_string() != param_id);

        Ok(())
    }

    pub fn add_request_header(&mut self, request_id: &str) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;
        req.headers.push(HttpHeader {
            id: Uuid::new_v4(),
            name: "".to_string(),
            value: "".to_string(),
        });
        Ok(())
    }

    pub fn delete_request_header(
        &mut self,
        request_id: &str,
        header_id: &str,
    ) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;
        req.headers
            .retain(|header| header.id.to_string() != header_id);
        Ok(())
    }

    pub fn set_request_header_name(
        &mut self,
        request_id: &str,
        header_id: &str,
        header_name: String,
    ) -> Result<(), String> {
        let header = self._find_request_header_mut(request_id, header_id)?;
        header.name = header_name;
        Ok(())
    }

    pub fn set_request_header_value(
        &mut self,
        request_id: &str,
        header_id: &str,
        header_value: String,
    ) -> Result<(), String> {
        let header = self._find_request_header_mut(request_id, header_id)?;
        header.value = header_value;
        Ok(())
    }

    pub fn add_response(&mut self, res: HttpResponse) -> Result<(), String> {
        let request_id = res.request_id.to_string();
        let req = self._find_request_mut(request_id.as_str())?;
        let pair = (req.clone(), res);
        self.history.push(pair);
        Ok(())
    }

    pub fn set_request_body(
        &mut self,
        request_id: &str,
        body: Option<Vec<u8>>,
    ) -> Result<(), String> {
        let req = self._find_request_mut(request_id)?;
        req.body = body;
        Ok(())
    }

    pub fn reset(&mut self) -> ApiClientInner {
        *self = ApiClientInner::default();
        self.clone()
    }
}

pub type ApiClient = Mutex<ApiClientInner>;
