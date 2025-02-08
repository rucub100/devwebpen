import { Session } from "./session";

export type Project = {
  path: string;
  name?: string;
  description?: string;
  session: Session;
};

export type RecentProject = Pick<Project, "path" | "name">;

export function projectHasName(
  project: Project
): project is Project & { name: string } {
  return project.name !== undefined;
}

export function projectHasDescription(
  project: Project
): project is Project & { description: string } {
  return project.description !== undefined;
}

const projectEvents = {
  ProjectChanged: "devwebpen://project-changed",
} as const;

type ProjectEventKeys = keyof typeof projectEvents;
export type ProjectEvent = (typeof projectEvents)[ProjectEventKeys];
