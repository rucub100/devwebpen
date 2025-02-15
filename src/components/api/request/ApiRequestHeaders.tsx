import NameValueTable from "../../common/NameValueTable";

interface ApiRequestHeadersProps {
  headers: Record<string, string[]>;
}
export default function ApiRequestHeaders({}: ApiRequestHeadersProps) {
  return (
    <div>
      <NameValueTable data={{ test: ["test", "test"] }}></NameValueTable>
    </div>
  );
}
