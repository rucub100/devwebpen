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
