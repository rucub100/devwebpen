import Button from "../../common/Button";

export default function ApiRequestStartLine() {
  return (
    <div className="flex flex-row items-center w-full p-2">
      <select className="py-1 rounded-l cursor-pointer">
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
      <input className="p-1 flex-grow" type="url"></input>
      <Button className="rounded-l-none">Send</Button>
    </div>
  );
}
