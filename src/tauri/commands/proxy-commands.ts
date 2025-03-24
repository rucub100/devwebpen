import { invoke } from "@tauri-apps/api/core";
import { Proxy } from "../../types/proxy";

enum ProxyCommand {
  GetProxyState = "get_proxy_state",
  startProxy = "start_proxy",
  StopProxy = "stop_proxy",
  SetProxyPort = "set_proxy_port",
  ToggleDebugging = "proxy_toggle_debugging",
  OpenSuspended = "proxy_open_suspended",
  ForwardSuspended = "proxy_forward_suspended",
  DropSuspended = "proxy_drop_suspended",
  ForwardAllSuspended = "proxy_forward_all_suspended",
  DropAllSuspended = "proxy_drop_all_suspended",
}

export async function getProxy(): Promise<Proxy> {
  return invoke<Proxy>(ProxyCommand.GetProxyState);
}

export async function startProxy(): Promise<void> {
  return invoke(ProxyCommand.startProxy);
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
