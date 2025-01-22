import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Session } from "../types/session";
import {
  getProject,
  createProject as _createProject,
  openProject as _openProject,
  getRecentProjects,
} from "../tauri/commands";
import { Project, RecentProject } from "../types/project";

// use undefined to indicate that the project has not been initialized
let globalProject: Project | null | undefined = undefined;
let globalRecentProjects: RecentProject[] | undefined = undefined;

let sessionListeners: Dispatch<SetStateAction<Session | null>>[] = [];
let isActiveListeners: Dispatch<SetStateAction<boolean>>[] = [];
let recentProjectsListeners: Dispatch<SetStateAction<RecentProject[]>>[] = [];

export async function initializeProject() {
  console.debug("Initializing project...");
  await updateProject(getProject(), true);
  await updateRecentProjects(getRecentProjects(), true);
}

async function updateProject(promise: Promise<Project | null>, init = false) {
  if (!init && globalProject === undefined) {
    console.error("Attempted to update project before it was initialized");
  }

  try {
    const project = await promise;
    const wasActive = !!globalProject;
    globalProject = project;
    const isActive = !!globalProject;

    if (init) {
      console.debug("11111 Project initialized", globalProject);
    } else {
      console.debug("Project updated", globalProject);
    }

    if (!init && isActive !== wasActive) {
      isActiveListeners.forEach((listener) => listener(isActive));
      sessionListeners.forEach((listener) =>
        listener(project?.session || null)
      );
    }
  } catch (error) {
    if (init) {
      console.error("Failed to initialize project", error);
    } else {
      console.error("Failed to update project", error);
    }
  }
}

async function updateRecentProjects(
  promise: Promise<RecentProject[]>,
  init = false
) {
  if (!init && globalRecentProjects === undefined) {
    console.error("Attempted to update project before it was initialized");
  }

  try {
    const projects = await promise;

    globalRecentProjects = projects;

    if (!init) {
      recentProjectsListeners.forEach((listener) =>
        listener(globalRecentProjects!)
      );
    }

    if (init) {
      console.debug("Recent project initialized", globalRecentProjects);
    } else {
      console.debug("Recent project updated", globalRecentProjects);
    }
  } catch (error) {
    if (init) {
      console.error("Failed to initialize recent projects", error);
    } else {
      console.error("Failed to update recent projects", error);
    }
  }
}

interface UseProjectOptions {
  listenIsActive?: boolean;
  listenSession?: boolean;
  listenRecentProjects?: boolean;
}

export function useProject({
  listenIsActive,
  listenSession,
  listenRecentProjects,
}: UseProjectOptions = {}) {
  const setInternalSession = useState<Session | null>(
    globalProject?.session || null
  )[1];
  const setInternalIsActive = useState<boolean>(!!globalProject)[1];
  const setInternalRecentProjects = useState<RecentProject[]>(
    globalRecentProjects!
  )[1];

  // register isActive listeners
  useEffect(() => {
    if (!listenIsActive) {
      return;
    }

    isActiveListeners.push(setInternalIsActive);

    return () => {
      isActiveListeners = isActiveListeners.filter(
        (listener) => listener !== setInternalIsActive
      );
    };
  }, [listenIsActive, setInternalIsActive]);

  // register session listeners
  useEffect(() => {
    if (!listenSession) {
      return;
    }

    sessionListeners.push(setInternalSession);

    return () => {
      sessionListeners = sessionListeners.filter(
        (listener) => listener !== setInternalSession
      );
    };
  }, [listenSession, setInternalSession]);

  // register recent projects listeners
  useEffect(() => {
    if (!listenRecentProjects) {
      return;
    }

    recentProjectsListeners.push(setInternalRecentProjects);

    return () => {
      recentProjectsListeners = recentProjectsListeners.filter(
        (listener) => listener !== setInternalRecentProjects
      );
    };
  }, [listenRecentProjects, setInternalRecentProjects]);

  const createProject = useCallback(() => updateProject(_createProject()), []);

  const openProject = useCallback(() => updateProject(_openProject()), []);

  return {
    isActive: !!globalProject,
    path: globalProject?.path,
    name: globalProject?.name,
    description: globalProject?.description,
    session: globalProject?.session,
    recentProjects: globalRecentProjects,
    createProject,
    openProject,
  };
}
