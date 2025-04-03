import { Channel } from "@tauri-apps/api/core";
import { useProxy } from "../hooks/useProxy";
import { ProxyTrafficTabData } from "../types/view-state";
import { useEffect, useState } from "react";
import { SuspendedContent } from "../types/proxy";

interface ProxyRequestResponseProps {
  data?: ProxyTrafficTabData | null;
}

export default function ProxyRequestResponse({
  data,
}: ProxyRequestResponseProps) {
  const id = data?.proxyTraffic.id;
  const [content, setContent] = useState<SuspendedContent | undefined>(
    undefined
  );

  const { getSuspendedContent } = useProxy();

  useEffect(() => {
    if (!id) {
      return;
    }
    const channel = new Channel<SuspendedContent>();
    channel.onmessage = (data) => {
      console.log("Received data:", data);
      setContent(data);
    };
    getSuspendedContent(id, channel);
  }, [id]);

  return <div>{id}</div>;
}
