import { useDaemon } from "../../hooks/useDaemon";

export default function StatusBar() {
  const { daemonState } = useDaemon({ listenDaemonState: true });

  return <>{daemonState}</>;
}
