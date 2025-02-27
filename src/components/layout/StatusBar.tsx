import { useEphemeralSession } from "../../hooks/useEphemeralSession";
import { useProxy } from "../../hooks/useProxy";
import Icon from "../common/Icon";
import Daemon from "../status/Daemon";

export default function StatusBar() {
  const { isActive: isSessinoActive, session } = useEphemeralSession({
    listenIsActive: true,
    listenSession: true,
  });
  const { proxy } = useProxy({ listenProxy: true });

  const error = session?.errors[0];

  return (
    <div className="flex flex-row-reverse items-center h-[24px] px-4 text-xs text-neutral-400 hover:text-neutral-300">
      <Daemon className="hover:bg-neutral-700 h-full content-center px-2"></Daemon>
      {isSessinoActive && error && (
        <Icon
          icon="error"
          title={error}
          className="hover:bg-neutral-700 h-full content-center px-2"
        ></Icon>
      )}
      {proxy && proxy.state !== "stopped" && (
        <Icon
          icon="traffic"
          title={
            proxy.error ? proxy.error : `Proxy is running on port ${proxy.port}`
          }
          className="hover:bg-neutral-700 h-full content-center px-2"
        ></Icon>
      )}
    </div>
  );
}
