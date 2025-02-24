use uuid::Uuid;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Session {
    #[serde(skip)]
    pub id: Uuid,
    pub errors: Vec<String>,
}

impl Default for Session {
    fn default() -> Self {
        Session {
            id: Uuid::new_v4(),
            errors: Vec::new(),
        }
    }
}

impl Session {
    pub fn add_error(&mut self, error: String) {
        self.errors.push(error);
    }
}
