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
