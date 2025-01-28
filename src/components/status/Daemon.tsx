import { useDaemon } from "../../hooks/useDaemon";

export default function Daemon() {
  const { daemonState } = useDaemon({ listenDaemonState: true });

  return <span className="w-[18ch]">Daemon: {daemonState}</span>;
}
