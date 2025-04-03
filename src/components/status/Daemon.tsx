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
import { useDaemon } from "../../hooks/useDaemon";
import { useContextMenu } from "../../hooks/useContextMenu";
import { ContextMenu } from "../../types/context-menu";
import { HTMLAttributes } from "react";

const restartActionRef = {
  current: () => {
    console.error("Restart action not set");
  },
};

const contextMenu: ContextMenu = {
  items: [
    {
      type: "item",
      label: "Restart Daemon",
      action: () => restartActionRef.current(),
    },
  ],
};

interface DaemonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Daemon({ className = "" }: DaemonProps) {
  const { daemonState, daemonError, restartDaemon } = useDaemon({
    listenDaemonState: true,
    listenDaemonError: true,
  });
  restartActionRef.current = restartDaemon;
  const showContextMenu = useContextMenu(contextMenu);

  return (
    <div
      className={`w-[18ch] ${className}`}
      onContextMenu={daemonError ? showContextMenu : undefined}
      title={daemonError ?? ""}
    >
      Daemon: {daemonState}
    </div>
  );
}
