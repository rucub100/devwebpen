import { useEphemeralSession } from "../../hooks/useEphemeralSession";
import Icon from "../common/Icon";
import Daemon from "../status/Daemon";

export default function StatusBar() {
  const { isActive, session } = useEphemeralSession({
    listenIsActive: true,
    listenSession: true,
  });

  const error = session?.errors[0];

  return (
    <div className="flex flex-row-reverse items-center h-[24px] px-4 py-0.5 text-xs text-neutral-400 hover:text-neutral-300 gap-2">
      <Daemon></Daemon>
      {isActive && error && <Icon icon="error"></Icon>}
    </div>
  );
}
