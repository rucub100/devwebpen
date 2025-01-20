import { Session } from "./session";

export interface Project {
  path: string;
  name?: string;
  description?: string;
  session: Session;
}
