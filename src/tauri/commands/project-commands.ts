/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { invoke } from "@tauri-apps/api/core";
import { Project, RecentProject } from "../../types/project";

enum ProjectCommand {
  GetProject = "get_project",
  GetRecentProjects = "get_recent_projects",
  CreateNewProject = "create_project",
  OpenProject = "open_project",
  OpenRecentProject = "open_recent_project",
  CloseProject = "close_project",
}

export async function getProject(): Promise<Project | null> {
  return invoke<Project | null>(ProjectCommand.GetProject);
}

export async function getRecentProjects(): Promise<RecentProject[]> {
  return invoke<RecentProject[]>(ProjectCommand.GetRecentProjects);
}

export async function createProject(): Promise<Project> {
  return invoke<Project>(ProjectCommand.CreateNewProject);
}

export async function openProject(): Promise<Project | null> {
  return invoke<Project | null>(ProjectCommand.OpenProject);
}

export async function openRecentProject(path: string): Promise<Project | null> {
  return invoke<Project | null>(ProjectCommand.OpenRecentProject, { path });
}

export async function closeProject(): Promise<Project | null> {
  return invoke<Project | null>(ProjectCommand.CloseProject);
}
