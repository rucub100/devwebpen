use uuid::Uuid;

pub enum RequestType {
    Command,
}

impl AsRef<str> for RequestType {
    fn as_ref(&self) -> &str {
        match self {
            RequestType::Command => "COMMAND",
        }
    }
}

pub struct RequestHeader {
    pub request_id: Uuid,
    pub request_type: RequestType,
}

pub struct Request {
    pub header: RequestHeader,
    pub body: String,
}

impl Request {
    pub fn new(request_type: RequestType, body: String) -> Request {
        Request {
            header: RequestHeader {
                request_id: Uuid::new_v4(),
                request_type,
            },
            body,
        }
    }
}

impl ToString for Request {
    fn to_string(&self) -> String {
        format!(
            "{}\n{}\n{}",
            self.header.request_id,
            self.header.request_type.as_ref(),
            self.body
        )
    }
}
