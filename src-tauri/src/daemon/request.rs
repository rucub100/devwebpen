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
