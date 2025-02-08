import { useEphemeralSession } from "../hooks/useEphemeralSession";
import { useProject } from "../hooks/useProject";
import NavigationItem from "./NavigationItem";

export default function Navigation() {
  const { isActive: ephemeralSessionIsActive } = useEphemeralSession({
    listenIsActive: true,
  });
  const { isActive: projectIsActive } = useProject({ listenIsActive: true });

  const isActive = ephemeralSessionIsActive || projectIsActive;

  return (
    <div className="flex flex-col">
      {/* Dashboard */}
      <NavigationItem icon="dashboard" navView="dashboard"></NavigationItem>
      {/* Proxy */}
      <NavigationItem
        icon="traffic"
        navView="proxy"
        disabled={!isActive}
      ></NavigationItem>
      {/* TODO: API Client <IconButton icon="api" /> */}
    </div>
  );
}
