import Button from "../../common/Button";

interface ApiRequestStartLineProps {
  method: string;
  url: string;
}

export default function ApiRequestStartLine({
  method,
  url,
}: ApiRequestStartLineProps) {
  return (
    <div className="flex flex-row items-center w-full p-2">
      <select className="py-1 rounded-l cursor-pointer" value={method} disabled>
        <option value="GET">GET</option>
        <option value="HEAD">HEAD</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
        <option value="CONNECT">CONNECT</option>
        <option value="OPTIONS">OPTIONS</option>
        <option value="TRACE">TRACE</option>
        <option value="PATCH">PATCH</option>
      </select>
      <input
        className="p-1 flex-grow"
        type="url"
        value={url}
        title={url || "Readonly URL"}
        readOnly={true}
        disabled
        placeholder="https://example.com/api/v2/foo"
      ></input>
      <Button className="rounded-l-none">Send</Button>
    </div>
  );
}
