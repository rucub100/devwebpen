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
import { Channel, invoke } from "@tauri-apps/api/core";
import { Proxy, SuspendedRequest } from "../../types/proxy";

enum ProxyCommand {
  GetProxyState = "get_proxy_state",
  StartProxy = "start_proxy",
  StopProxy = "stop_proxy",
  SetProxyPort = "set_proxy_port",
  ToggleDebugging = "proxy_toggle_debugging",
  OpenSuspended = "proxy_open_suspended",
  GetSuspendedContent = "proxy_get_suspended_content",
  ForwardSuspended = "proxy_forward_suspended",
  DropSuspended = "proxy_drop_suspended",
  ForwardAllSuspended = "proxy_forward_all_suspended",
  DropAllSuspended = "proxy_drop_all_suspended",
}

export async function getProxy(): Promise<Proxy> {
  return invoke<Proxy>(ProxyCommand.GetProxyState);
}

export async function startProxy(): Promise<void> {
  return invoke(ProxyCommand.StartProxy);
}

export async function stopProxy(): Promise<void> {
  return invoke(ProxyCommand.StopProxy);
}

export async function setProxyPort(port: number): Promise<Proxy> {
  return invoke<Proxy>(ProxyCommand.SetProxyPort, { port });
}

export async function toggleDebugging(): Promise<Proxy> {
  return invoke<Proxy>(ProxyCommand.ToggleDebugging);
}

export async function openSuspended(id: string): Promise<void> {
  return invoke(ProxyCommand.OpenSuspended, { id });
}

export async function getSuspendedContent(
  id: string,
  channel: Channel<SuspendedRequest>
): Promise<void> {
  return invoke(ProxyCommand.GetSuspendedContent, { id, channel });
}

export async function forwardSuspended(id: string): Promise<void> {
  return invoke(ProxyCommand.ForwardSuspended, { id });
}

export async function dropSuspended(id: string): Promise<void> {
  return invoke(ProxyCommand.DropSuspended, { id });
}

export async function forwardAllSuspended(): Promise<void> {
  return invoke(ProxyCommand.ForwardAllSuspended);
}

export async function dropAllSuspended(): Promise<void> {
  return invoke(ProxyCommand.DropAllSuspended);
}
