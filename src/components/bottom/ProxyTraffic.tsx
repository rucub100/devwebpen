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
import { useProxy } from "../../hooks/useProxy";

export default function ProxyTraffic() {
  const { proxy, openSuspended } = useProxy({ listenProxy: true });

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      {proxy && (
        <table className="font-normal text-xs font-mono">
          <colgroup>
            <col className="min-w-16"></col>
            <col className="w-full"></col>
          </colgroup>
          <thead>
            <tr>
              <th className="border-y border-r border-neutral-600 text-start px-2">
                Method
              </th>
              <th className="border-y border-r border-neutral-600  text-start px-2">
                URI
              </th>
            </tr>
          </thead>
          <tbody>
            {proxy.suspendedRequests.map((request, index) => (
              <tr
                key={request.id}
                className={`${
                  index % 2 === 0 ? "bg-neutral-800" : ""
                } cursor-pointer hover:bg-neutral-600`}
                onClick={() => openSuspended(request.id)}
              >
                <td className="px-2">{request.method}</td>
                <td className="px-2">{request.uri}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
