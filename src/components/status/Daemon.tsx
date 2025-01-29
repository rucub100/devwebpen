import { useDaemon } from "../../hooks/useDaemon";
import { useContextMenu } from "../../hooks/useContextMenu";
import { ContextMenu } from "../../types/context-menu";

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

export default function Daemon() {
  const { daemonState, daemonError, restartDaemon } = useDaemon({
    listenDaemonState: true,
    listenDaemonError: true,
  });
  restartActionRef.current = restartDaemon;
  const showContextMenu = useContextMenu(contextMenu);

  return (
    <div
      className="w-[18ch]"
      onContextMenu={daemonError ? showContextMenu : undefined}
      title={daemonError ?? ""}
    >
      Daemon: {daemonState}
    </div>
  );
}
