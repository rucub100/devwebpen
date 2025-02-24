use std::path::Path;

use tokio::{
    fs::File,
    io::{AsyncReadExt, AsyncWriteExt},
};

use super::session::Session;

#[derive(serde::Serialize, serde::Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct Project {
    #[serde(skip)]
    pub path: String,
    pub name: Option<String>,
    pub description: Option<String>,
    pub session: Session,
}

impl Project {
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

        let project = serde_json::from_str::<Project>(&data);

        if let Err(e) = project {
            return Err(e.to_string());
        }

        let mut project = project.unwrap();
        project.path = path;

        Ok(project)
    }

    pub async fn save(&self) -> Result<(), String> {
        let path = Path::new(&self.path);
        let file = File::create(path).await;

        if let Err(e) = file {
            return Err(e.to_string());
        }

        let mut file = file.unwrap();
        let project: Project = self.clone();
        let data = serde_json::to_string(&project);

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
