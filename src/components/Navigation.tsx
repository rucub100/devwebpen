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
