import { ProxyTrafficTabData } from "../types/view-state";

interface ProxyRequestResponseProps {
  data?: ProxyTrafficTabData | null;
}

export default function ProxyRequestResponse({
  data,
}: ProxyRequestResponseProps) {
  return <div>{data?.proxyTraffic.id}</div>;
}
