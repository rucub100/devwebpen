import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Session } from "../types/session";
import {
  getEphemeralSession,
  startEphemeralSession as _startEphemeralSession,
  closeEphemeralSession as _closeEphemeralSession,
} from "../tauri/commands/ephemeral-session-commands";
import { subscribe } from "../tauri/events";

// use undefined to indicate that the session has not been initialized
let globalEphemeralSession: Session | null | undefined = undefined;

let sessionListeners: Dispatch<SetStateAction<Session | null>>[] = [];
let isActiveListeners: Dispatch<SetStateAction<boolean>>[] = [];

export async function initializeEphemeralSession() {
  console.debug("Initializing ephemeral session...");

  if (globalEphemeralSession !== undefined) {
    throw new Error("Ephemeral session has already been initialized");
  }

  subscribe("devwebpen://ephemeral-session-changed", (session) =>
    updateEphemeralSession(Promise.resolve(session))
  );

  await updateEphemeralSession(getEphemeralSession(), true);
}

async function updateEphemeralSession(
  promise: Promise<Session | null>,
  init = false
) {
  if (!init && globalEphemeralSession === undefined) {
    console.error(
      "Attempted to update ephemeral session before it was initialized"
    );
  }

  try {
    const session = await promise;
    const wasActive = !!globalEphemeralSession;
    globalEphemeralSession = session;
    const isActive = !!globalEphemeralSession;

    if (!init && isActive !== wasActive) {
      isActiveListeners.forEach((listener) => listener(isActive));
    }

    sessionListeners.forEach((listener) =>
      listener(globalEphemeralSession || null)
    );

    if (init) {
      console.debug("Ephemeral session initialized", globalEphemeralSession);
    } else {
      console.debug("Ephemeral session updated", globalEphemeralSession);
    }
  } catch (error) {
    if (init) {
      console.error("Failed to initialize ephemeral session", error);
    } else {
      console.error("Failed to update ephemeral session", error);
    }
  }
}

interface UseEphemeralSessionOptions {
  listenIsActive?: boolean;
  listenSession?: boolean;
}

export function useEphemeralSession({
  listenIsActive,
  listenSession,
}: UseEphemeralSessionOptions = {}) {
  const setInternalSession = useState<Session | null>(
    globalEphemeralSession || null
  )[1];
  const setInternalIsActive = useState<boolean>(!!globalEphemeralSession)[1];

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

  const startEphemeralSession = useCallback(
    () => updateEphemeralSession(_startEphemeralSession()),
    []
  );

  const closeEphemeralSession = useCallback(
    () => updateEphemeralSession(_closeEphemeralSession()),
    []
  );

  return {
    isActive: !!globalEphemeralSession,
    session: globalEphemeralSession,
    startEphemeralSession,
    closeEphemeralSession,
  };
}
