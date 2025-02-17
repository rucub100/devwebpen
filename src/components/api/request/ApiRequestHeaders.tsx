import { HttpHeader } from "../../../types/api-client";
import Button from "../../common/Button";
import NameValueTable from "../../common/NameValueTable";

interface ApiRequestHeadersProps {
  scheme: string;
  authority: string;
  path: string;
  headers: HttpHeader[];
  onSchemeChange: (scheme: string) => void;
  onAuthorityChange: (authority: string) => void;
  onPathChange: (path: string) => void;
  onAddHeader: () => void;
  onDeleteHeader: (key: string) => void;
  onSetHeaderName: (key: string, name: string) => void;
  onSetHeaderValue: (key: string, value: string) => void;
}
export default function ApiRequestHeaders({
  scheme,
  authority,
  path,
  headers,
  onSchemeChange,
  onAuthorityChange,
  onPathChange,
  onAddHeader,
  onDeleteHeader,
  onSetHeaderName,
  onSetHeaderValue,
}: ApiRequestHeadersProps) {
  const data: Record<string, [string, string]> = headers.reduce(
    (acc: Record<string, [string, string]>, header) => {
      acc[header.id] = [header.name, header.value];
      return acc;
    },
    {}
  );

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
          onChange={(event) => onSchemeChange(event.target.value)}
        >
          <option value="https">HTTPS</option>
          <option value="http">HTTP</option>
        </select>
        <label>:authority</label>
        <input
          type="text"
          className="px-1 w-full"
          value={authority}
          onChange={(event) => onAuthorityChange(event.target.value)}
        ></input>
        <label>:path</label>
        <input
          type="text"
          className="px-1 w-full"
          value={path}
          onChange={(event) => onPathChange(event.target.value)}
        ></input>
      </div>
      <Button className="self-end" onClick={onAddHeader}>
        Add
      </Button>
      <NameValueTable
        data={data}
        onNameChange={onSetHeaderName}
        onValueChange={onSetHeaderValue}
        onDelete={onDeleteHeader}
      ></NameValueTable>
    </div>
  );
}
