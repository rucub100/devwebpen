import { Session } from "./session";

export interface Project {
  path: string;
  name?: string;
  description?: string;
  session: Session;
}

export interface RecentProject extends Pick<Project, "path" | "name"> {}
