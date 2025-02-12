import { invoke } from "@tauri-apps/api/core";
import { Proxy } from "../../types/proxy";

enum ProxyCommand {
  GetProxyState = "get_proxy_state",
  startProxy = "start_proxy",
  StopProxy = "stop_proxy",
  SetProxyPort = "set_proxy_port",
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
