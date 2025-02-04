import { invoke } from "@tauri-apps/api/core";
import { Proxy } from "../../types/proxy";

export enum ProxyCommand {
  GetProxyState = "get_proxy_state",
  startProxy = "start_proxy",
  StopProxy = "stop_proxy",
}

export async function getProxy(): Promise<Proxy> {
  return invoke<Proxy>(ProxyCommand.GetProxyState);
}

export async function startProxy(): Promise<Proxy> {
  return invoke<Proxy>(ProxyCommand.startProxy);
}

export async function stopProxy(): Promise<Proxy> {
  return invoke<Proxy>(ProxyCommand.StopProxy);
}
