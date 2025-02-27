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
