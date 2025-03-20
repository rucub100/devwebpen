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
