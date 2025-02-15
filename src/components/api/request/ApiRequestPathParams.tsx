import NameValueTable from "../../common/NameValueTable";

interface ApiRequestPathParamsProps {
  pathParams: Record<string, string | number | boolean>;
}

export default function ApiRequestPathParams({
  pathParams,
}: ApiRequestPathParamsProps) {
  return (
    <div>
      <div className="flex flex-row p-2 items-center w-full">
        <h3 className="text-sm font-semibold">Path Params</h3>
      </div>
      <NameValueTable data={pathParams as any}></NameValueTable>
    </div>
  );
}
