use super::project::Project;

const MAX_RECENT_PROJECTS: usize = 5;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RecentProject {
    path: String,
    name: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Store {
    open_recent: Vec<RecentProject>,
}

impl Store {
    pub fn add_recent_project(&mut self, project: RecentProject) {
        if let Some(existing_project) = self.open_recent.iter_mut().find(|p| p.path == project.path)
        {
            // Update the project name if it exists
            existing_project.name = project.name;
        } else {
            self.open_recent.push(project.into());
            if self.open_recent.len() > MAX_RECENT_PROJECTS {
                self.open_recent.remove(0);
            }
        }
    }

    pub fn get_recent_projects(&self) -> Vec<RecentProject> {
        let mut recent_projects = self.open_recent.clone();
        recent_projects.reverse();
        recent_projects
    }
}

impl From<&Project> for RecentProject {
    fn from(project: &Project) -> Self {
        RecentProject {
            path: project.path.clone(),
            name: project.name.clone(),
        }
    }
}
