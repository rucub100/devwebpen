use tokio_tungstenite::tungstenite::{Message, Utf8Bytes};
use uuid::Uuid;

pub enum ResponseType {
    ProxyStatus,
    HttpResponse,
    HttpRequestError,
    ProxyRequestDebug,
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
            "HTTP_RESPONSE" => ResponseType::HttpResponse,
            "HTTP_REQUEST_ERROR" => ResponseType::HttpRequestError,
            "PROXY_REQUEST_DEBUG" => ResponseType::ProxyRequestDebug,
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
