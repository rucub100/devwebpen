import Button from "../../common/Button";
import NameValueTable from "../../common/NameValueTable";

interface ApiRequestQueryParamsProps {
  queryParams: Record<string, string | number | boolean>;
}

export default function ApiRequestQueryParams({
  queryParams,
}: ApiRequestQueryParamsProps) {
  return (
    <div>
      <div className="flex flex-row p-2 items-center w-full">
        <h3 className="text-sm font-semibold">Query Params</h3>
        <Button className="ml-auto">Add</Button>
      </div>
      <NameValueTable data={queryParams as any}></NameValueTable>
    </div>
  );
}
