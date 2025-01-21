use std::path::Path;

use tokio::{
    fs::File,
    io::{AsyncReadExt, AsyncWriteExt},
};

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
    pub fn from(data: ProjectData, path: String) -> Project {
        Project {
            path,
            name: data.name,
            description: data.description,
            session: data.session.into(),
        }
    }

    pub async fn load(path: String) -> Result<Project, String> {
        let _path = Path::new(&path);
        let file = File::open(_path).await;

        if let Err(e) = file {
            return Err(e.to_string());
        }

        let mut file = file.unwrap();
        let mut data = String::new();
        let result = file.read_to_string(&mut data).await;

        if let Err(e) = result {
            return Err(e.to_string());
        }

        let project_data = serde_json::from_str::<ProjectData>(&data);

        if let Err(e) = project_data {
            return Err(e.to_string());
        }

        let project_data = project_data.unwrap();

        Ok(Project::from(project_data, path))
    }

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
