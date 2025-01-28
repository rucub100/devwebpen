import { invoke } from "@tauri-apps/api/core";
import { Project, RecentProject } from "../../types/project";

export enum ProjectCommand {
  GetProject = "get_project",
  GetRecentProjects = "get_recent_projects",
  CreateNewProject = "create_project",
  OpenProject = "open_project",
  OpenRecentProject = "open_recent_project",
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
