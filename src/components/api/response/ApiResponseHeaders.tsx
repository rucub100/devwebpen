import { HttpHeader } from "../../../types/api-client";
import NameValueTable from "../../common/NameValueTable";

interface ApiResponseHeadersProps {
  headers: HttpHeader[];
}
export default function ApiResponseHeaders({
  headers,
}: ApiResponseHeadersProps) {
  const data: Record<string, [string, string]> = headers.reduce(
    (acc: Record<string, [string, string]>, header) => {
      acc[header.id] = [header.name, header.value];
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col items-start p-2 gap-4 overflow-y-auto">
      <NameValueTable
        data={data}
        readonlyName
        readonlyValue
        canDelete={false}
      ></NameValueTable>
    </div>
  );
}
