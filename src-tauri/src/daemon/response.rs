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

use tokio_tungstenite::tungstenite::{Message, Utf8Bytes};
use uuid::Uuid;

pub enum ResponseType {
    ProxyStatus,
    ProxySuspendedContent,
    HttpResponse,
    HttpRequestError,
}

pub struct ResponseHeader {
    #[allow(dead_code)]
    pub request_id: Uuid,
    pub response_type: ResponseType,
}

pub struct Response {
    pub header: ResponseHeader,
    pub body: String,
}

impl Response {
    pub fn parse(msg: Message) -> Result<Option<Response>, String> {
        if msg.is_text() {
            let text = msg.into_text().unwrap();
            let res = Self::parse_text(text)?;
            return Ok(Some(res));
        } else if msg.is_binary() {
            return Err("Binary messages are not supported yet".to_string());
        }

        Ok(None)
    }

    fn parse_text(text: Utf8Bytes) -> Result<Response, String> {
        let mut lines = text.lines();
        let uuid_line = lines.next();

        if let None = uuid_line {
            return Err("Missing UUID line".to_string());
        }

        let uuid_line = uuid_line.unwrap();
        let request_id = Uuid::parse_str(uuid_line).map_err(|e| e.to_string())?;

        let request_type_line = lines.next();

        if let None = request_type_line {
            return Err("Missing request type line".to_string());
        }

        let request_type_line = request_type_line.unwrap();
        let request_type = match request_type_line {
            "PROXY_STATUS" => ResponseType::ProxyStatus,
            "PROXY_SUSPENDED_CONTENT" => ResponseType::ProxySuspendedContent,
            "HTTP_RESPONSE" => ResponseType::HttpResponse,
            "HTTP_REQUEST_ERROR" => ResponseType::HttpRequestError,
            _ => return Err("Invalid request type".to_string()),
        };

        let mut body_lines = String::new();
        for line in lines {
            body_lines.push_str(line);
            body_lines.push_str("\n");
        }

        Ok(Response {
            header: ResponseHeader {
                request_id,
                response_type: request_type,
            },
            body: body_lines,
        })
    }
}
