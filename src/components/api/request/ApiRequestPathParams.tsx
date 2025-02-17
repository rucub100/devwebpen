import { HttpPathParameter } from "../../../types/api-client";
import NameValueTable from "../../common/NameValueTable";

interface ApiRequestPathParamsProps {
  pathParams: HttpPathParameter[];
}

export default function ApiRequestPathParams({
  pathParams,
}: ApiRequestPathParamsProps) {
  const data: Record<string, [string, string]> = pathParams.reduce(
    (acc: Record<string, [string, string]>, pathParam) => {
      acc[pathParam.name] = [pathParam.name, pathParam.value];
      return acc;
    },
    {}
  );

  return (
    <div className="p-2 w-full">
      <h3 className="text-sm font-semibold pb-2">Path Params</h3>
      <NameValueTable
        readonlyName={true}
        canDelete={false}
        data={data}
      ></NameValueTable>
    </div>
  );
}
