import { HttpQueryParameter } from "../../../types/api-client";
import Button from "../../common/Button";
import NameValueTable from "../../common/NameValueTable";

interface ApiRequestQueryParamsProps {
  queryParams: HttpQueryParameter[];
}

export default function ApiRequestQueryParams({
  queryParams,
}: ApiRequestQueryParamsProps) {
  const data: Record<string, [string, string]> = queryParams.reduce(
    (acc: Record<string, [string, string]>, queryParam) => {
      acc[queryParam.id] = [queryParam.name, queryParam.value];
      return acc;
    },
    {}
  );

  return (
    <div>
      <div className="flex flex-row p-2 items-center w-full">
        <h3 className="text-sm font-semibold">Query Params</h3>
        <Button className="ml-auto">Add</Button>
      </div>
      <NameValueTable data={data}></NameValueTable>
    </div>
  );
}
