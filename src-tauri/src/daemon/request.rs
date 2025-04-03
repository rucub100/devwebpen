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

use base64::prelude::*;
use uuid::Uuid;

use crate::api_client::HttpRequest;

pub enum RequestType {
    Command,
    HttpRequest,
}

impl fmt::Display for RequestType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            RequestType::Command => write!(f, "COMMAND"),
            RequestType::HttpRequest => write!(f, "HTTP_REQUEST"),
        }
    }
}

pub struct RequestHeader {
    pub request_id: Uuid,
    pub request_type: RequestType,
}

pub enum RequestBody {
    Text(String),
    // Binary(Vec<u8>),
}

pub struct Request {
    pub header: RequestHeader,
    pub body: RequestBody,
}

impl Request {
    pub fn new_text(request_type: RequestType, body: String) -> Request {
        Request {
            header: RequestHeader {
                request_id: Uuid::new_v4(),
                request_type,
            },
            body: RequestBody::Text(body),
        }
    }
}

impl From<&HttpRequest> for Request {
    fn from(http_request: &HttpRequest) -> Self {
        let mut path_params = String::new();
        let path_params_count = if http_request.path_params.is_some() {
            let params = http_request.path_params.as_ref().unwrap();

            path_params = params.iter().fold(String::new(), |acc, param| {
                if acc.is_empty() {
                    format!("{}:{}:{}", param.id, param.name, param.value)
                } else {
                    format!("{}\n{}:{}:{}", acc, param.id, param.name, param.value)
                }
            });

            params.len()
        } else {
            0
        };

        let mut query_params = String::new();
        let query_params_count = if http_request.query_params.is_some() {
            let params = http_request.query_params.as_ref().unwrap();

            query_params = params.iter().fold(String::new(), |acc, param| {
                if acc.is_empty() {
                    format!("{}:{}:{}", param.id, param.name, param.value)
                } else {
                    format!("{}\n{}:{}:{}", acc, param.id, param.name, param.value)
                }
            });

            params.len()
        } else {
            0
        };

        let http_body = http_request.body.as_ref();
        let http_body = if http_body.is_some() {
            http_body.unwrap().clone()
        } else {
            Vec::new()
        };
        let http_body = BASE64_STANDARD.encode(&http_body);

        let body = format!(
            "{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}\n{}",
            http_request.id,
            http_request.method,
            http_request.scheme,
            http_request.authority,
            http_request.path,
            http_request.http_version,
            path_params_count,
            path_params,
            query_params_count,
            query_params,
            http_request.headers.len(),
            http_request
                .headers
                .iter()
                .fold(String::new(), |acc, header| {
                    if acc.is_empty() {
                        format!("{}:{}:{}", header.id, header.name, header.value)
                    } else {
                        format!("{}\n{}:{}:{}", acc, header.id, header.name, header.value)
                    }
                }),
            http_body
        );

        return Request::new_text(RequestType::HttpRequest, body);
    }
}
