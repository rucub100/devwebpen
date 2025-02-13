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
      <NavigationItem
        icon="dashboard"
        title="Dashboard"
        navView="dashboard"
      ></NavigationItem>
      {/* Proxy */}
      <NavigationItem
        icon="traffic"
        title="Proxy"
        navView="proxy"
        disabled={!isActive}
      ></NavigationItem>
      {/* API Client */}
      <NavigationItem
        icon="api"
        title="HTTP API Client"
        navView="apiClient"
        disabled={!isActive}
      ></NavigationItem>
    </div>
  );
}
