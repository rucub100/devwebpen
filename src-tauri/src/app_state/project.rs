use std::path::Path;

use tokio::{fs::File, io::AsyncWriteExt};

use super::session::{Session, SessionData};

#[derive(serde::Serialize, serde::Deserialize, Clone, Default)]
#[serde(rename_all = "lowercase")]
pub struct Project {
    pub path: String,
    pub name: Option<String>,
    pub description: Option<String>,
    pub session: Session,
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub struct ProjectData {
    pub name: Option<String>,
    pub description: Option<String>,
    pub session: SessionData,
}

impl From<Project> for ProjectData {
    fn from(project: Project) -> Self {
        ProjectData {
            name: project.name,
            description: project.description,
            session: project.session.into(),
        }
    }
}

impl Project {
    pub async fn save(&self) -> Result<(), String> {
        let path = Path::new(&self.path);
        let file = File::create(path).await;

        if let Err(e) = file {
            return Err(e.to_string());
        }

        let mut file = file.unwrap();
        let project_data: ProjectData = self.clone().into();
        let data = serde_json::to_string(&project_data);

        if let Err(e) = data {
            return Err(e.to_string());
        }

        let data = data.unwrap();
        let result = file.write_all(data.as_bytes()).await;

        if let Err(e) = result {
            return Err(e.to_string());
        }

        Ok(())
    }
}
