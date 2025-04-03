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
