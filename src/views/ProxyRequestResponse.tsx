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
import { Channel } from "@tauri-apps/api/core";
import { useProxy } from "../hooks/useProxy";
import { ProxyTrafficTabData } from "../types/view-state";
import { useEffect, useState } from "react";
import { SuspendedRequest } from "../types/proxy";
import NameValueTable from "../components/common/NameValueTable";

interface ProxyRequestResponseProps {
  data?: ProxyTrafficTabData | null;
  className?: string;
}

export default function ProxyRequestResponse({
  data,
  className = "",
}: ProxyRequestResponseProps) {
  const id = data?.proxyTraffic.id;
  const [req, setReq] = useState<SuspendedRequest | undefined>(undefined);

  const { getSuspendedContent } = useProxy();

  useEffect(() => {
    if (!id) {
      return;
    }

    const channel = new Channel<SuspendedRequest>();
    channel.onmessage = (data) => {
      setReq(data);
    };

    getSuspendedContent(id, channel);
  }, [id, getSuspendedContent]);

  return req ? (
    <div className={`flex flex-col w-full h-full min-w-max ${className}`}>
      <div>Request ID: {req.id}</div>
      <div className="">
        {req.method} {req.uri} {req.protocolVersion}
      </div>
      {req.headers && (
        <NameValueTable
          readonlyName={true}
          readonlyValue={true}
          canDelete={false}
          data={req.headers!.reduce(
            (acc: Record<string, [string, string]>, header) => {
              acc[header.id] = [header.name, header.value];
              return acc;
            },
            {}
          )}
        ></NameValueTable>
      )}
    </div>
  ) : (
    <div>ID: {id}</div>
  );
}
