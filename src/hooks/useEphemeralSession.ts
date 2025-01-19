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
} from "../tauri/commands";

// use undefined to indicate that the session has not been initialized
let globalEphemeralSession: Session | null | undefined = undefined;

let _init = false;
let initListeners: Dispatch<SetStateAction<boolean>>[] = [];
let sessionListeners: Dispatch<SetStateAction<Session | null>>[] = [];
let isActiveListeners: Dispatch<SetStateAction<boolean>>[] = [];

function initializeEphemeralSession() {
  if (_init) {
    return;
  }

  _init = true;

  console.debug("Initializing ephemeral session...");

  updateEphemeralSession(getEphemeralSession(), true);
}

function updateEphemeralSession(
  promise: Promise<Session | null>,
  init = false
) {
  promise
    .then((session) => {
      const wasActive = !!globalEphemeralSession;
      globalEphemeralSession = session;
      const isActive = !!globalEphemeralSession;

      if (init) {
        console.debug("Ephemeral session initialized", globalEphemeralSession);
        initListeners.forEach((listener) => listener(true));
      } else {
        console.debug("Ephemeral session updated", globalEphemeralSession);
      }

      sessionListeners.forEach((listener) =>
        listener(globalEphemeralSession || null)
      );

      if (isActive !== wasActive) {
        isActiveListeners.forEach((listener) => listener(isActive));
      }
    })
    .catch((error) => {
      if (init) {
        console.error("Failed to initialize ephemeral session", error);
      } else {
        console.error("Failed to update ephemeral session", error);
      }
    });
}

interface UseEphemeralSessionOptions {
  listenInit?: boolean;
  listenIsActive?: boolean;
  listenSession?: boolean;
}

export function useEphemeralSession({
  listenInit,
  listenIsActive,
  listenSession,
}: UseEphemeralSessionOptions = {}) {
  const [isInitialized, setInitialized] = useState(
    globalEphemeralSession !== undefined
  );
  const setInternalSession = useState<Session | null>(
    globalEphemeralSession || null
  )[1];
  const setInternalIsActive = useState<boolean>(!!globalEphemeralSession)[1];

  useEffect(() => {
    if (globalEphemeralSession) {
      return;
    }

    if (!listenInit) {
      return;
    }

    initListeners.push(setInitialized);

    initializeEphemeralSession();

    return () => {
      initListeners = initListeners.filter(
        (listener) => listener !== setInitialized
      );
    };
  }, []);

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

  return {
    isInitialized,
    isActive: !!globalEphemeralSession,
    session: globalEphemeralSession,
    startEphemeralSession,
  };
}
