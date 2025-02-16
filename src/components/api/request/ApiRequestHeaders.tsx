import NameValueTable from "../../common/NameValueTable";

interface ApiRequestHeadersProps {
  scheme: string;
  headers: Record<string, string[]>;
}
export default function ApiRequestHeaders({
  scheme,
  headers,
}: ApiRequestHeadersProps) {
  return (
    <div className="flex flex-col items-start p-2 gap-4">
      <div
        className="grid grid-cols-2 gap-x-4 gap-y-2 w-full"
        style={{ gridTemplateColumns: "max-content minmax(0px, 1fr)" }}
      >
        <label>:scheme</label>
        <select
          className="py-1 rounded-l cursor-pointer mr-auto"
          value={scheme}
          onChange={() => {}}
        >
          <option value="https">HTTPS</option>
          <option value="http">HTTP</option>
        </select>
        <label>:authority</label>
        <input type="text" className="px-1 w-full"></input>
        <label>:path</label>
        <input type="text" className="px-1 w-full"></input>
      </div>
      <NameValueTable data={{ test: ["test", "test"] }}></NameValueTable>
    </div>
  );
}
