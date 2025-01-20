use super::session::Session;

#[derive(serde::Serialize, serde::Deserialize, Clone, Default)]
#[serde(rename_all = "lowercase")]
pub struct Project {
    pub path: String,
    pub name: Option<String>,
    pub description: Option<String>,
    pub session: Session,
}
