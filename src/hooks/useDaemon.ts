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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DaemonState } from "../types/daemon";
import {
  getDaemonState,
  getDaemonError,
  restartDaemon,
} from "../tauri/commands/daemon-commands";
import { subscribe } from "../tauri/events";

let globalDaemonState: DaemonState | undefined = undefined;
let daemonStateListeners: Dispatch<SetStateAction<DaemonState>>[] = [];

let globalDaemonError: string | null | undefined = undefined;
let daemonErrorListeners: Dispatch<SetStateAction<string | null>>[] = [];

export async function initializeDaemon() {
  console.debug("Initializing daemon...");

  if (globalDaemonState !== undefined || globalDaemonError !== undefined) {
    throw new Error("Daemon has already been initialized");
  }

  // no need to unsubscribe since this is a global scope
  subscribe("devwebpen://daemon-state-changed", (state) =>
    updateDaemonState(Promise.resolve(state))
  );
  subscribe("devwebpen://daemon-error", (error) =>
    updateDaemonError(Promise.resolve(error))
  );

  await updateDaemonState(getDaemonState(), true);
  await updateDaemonError(getDaemonError(), true);
}

async function updateDaemonState(promise: Promise<DaemonState>, init = false) {
  if (!init && globalDaemonState === undefined) {
    console.error("Attempted to update daemon state before it was initialized");
  }

  try {
    const daemon = await promise;

    globalDaemonState = daemon;

    if (!init) {
      daemonStateListeners.forEach((listener) => listener(daemon));
    }

    if (init) {
      console.debug("Daemon state initialized", globalDaemonState);
    } else {
      console.debug("Daemon state updated", globalDaemonState);
    }
  } catch (error) {
    if (init) {
      console.error("Failed to initialize daemon state", error);
    } else {
      console.error("Failed to update daemon state", error);
    }
  }
}

async function updateDaemonError(
  promise: Promise<string | null>,
  init = false
) {
  if (!init && globalDaemonError === undefined) {
    console.error("Attempted to update daemon error before it was initialized");
  }

  try {
    const daemon = await promise;

    globalDaemonError = daemon;

    if (!init) {
      daemonErrorListeners.forEach((listener) => listener(daemon));
    }

    if (init) {
      console.debug("Daemon error initialized", globalDaemonError);
    } else {
      console.debug("Daemon error updated", globalDaemonError);
    }
  } catch (error) {
    if (init) {
      console.error("Failed to initialize daemon error", error);
    } else {
      console.error("Failed to update daemon error", error);
    }
  }
}
interface UseDaemonOptions {
  listenDaemonState?: boolean;
  listenDaemonError?: boolean;
}

export function useDaemon({
  listenDaemonState,
  listenDaemonError,
}: UseDaemonOptions = {}) {
  const setInternalDaemonState = useState<DaemonState>(globalDaemonState!)[1];
  const setInternalDaemonError = useState<string | null>(globalDaemonError!)[1];

  // register daemon state listeners
  useEffect(() => {
    if (!listenDaemonState) {
      return;
    }

    daemonStateListeners.push(setInternalDaemonState);

    return () => {
      daemonStateListeners = daemonStateListeners.filter(
        (listener) => listener !== setInternalDaemonState
      );
    };
  }, [listenDaemonState, setInternalDaemonState]);

  // register daemon error listeners
  useEffect(() => {
    if (!listenDaemonError) {
      return;
    }

    daemonErrorListeners.push(setInternalDaemonError);

    return () => {
      daemonErrorListeners = daemonErrorListeners.filter(
        (listener) => listener !== setInternalDaemonError
      );
    };
  }, [listenDaemonError, setInternalDaemonError]);

  return {
    daemonState: globalDaemonState,
    daemonError: globalDaemonError,
    restartDaemon,
  };
}
