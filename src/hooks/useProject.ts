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
} from "../tauri/commands";
import { Project } from "../types/project";

// use undefined to indicate that the project has not been initialized
let globalProject: Project | null | undefined = undefined;

let _init = false;
let sessionListeners: Dispatch<SetStateAction<Session | null>>[] = [];
let isActiveListeners: Dispatch<SetStateAction<boolean>>[] = [];

export async function initializeProject() {
  if (_init) {
    return;
  }

  _init = true;

  console.debug("Initializing project...");

  await updateProject(getProject(), true);
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
      console.debug("Project initialized", globalProject);
    } else {
      console.debug("Project updated", globalProject);
    }

    if (isActive !== wasActive) {
      isActiveListeners.forEach((listener) => listener(isActive));
    }

    sessionListeners.forEach((listener) => listener(project?.session || null));
  } catch (error) {
    if (init) {
      console.error("Failed to initialize ephemeral session", error);
    } else {
      console.error("Failed to update ephemeral session", error);
    }
  }
}

interface UseProjectOptions {
  listenIsActive?: boolean;
  listenSession?: boolean;
}

export function useProject({
  listenIsActive,
  listenSession,
}: UseProjectOptions = {}) {
  const setInternalSession = useState<Session | null>(
    globalProject?.session || null
  )[1];
  const setInternalIsActive = useState<boolean>(!!globalProject)[1];

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

  const createProject = useCallback(() => updateProject(_createProject()), []);

  const openProject = useCallback(() => updateProject(_openProject()), []);

  return {
    isActive: !!globalProject,
    path: globalProject?.path,
    name: globalProject?.name,
    description: globalProject?.description,
    session: globalProject?.session,
    createProject,
    openProject,
  };
}
