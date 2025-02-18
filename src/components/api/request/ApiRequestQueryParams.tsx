import { HttpQueryParameter } from "../../../types/api-client";
import Button from "../../common/Button";
import NameValueTable from "../../common/NameValueTable";

interface ApiRequestQueryParamsProps {
  queryParams: HttpQueryParameter[];
  onAddQueryParam: () => void;
  onDeleteQueryParam: (id: string) => void;
  onSetQueryParamName: (id: string, name: string) => void;
  onSetQueryParamValue: (id: string, value: string) => void;
}

export default function ApiRequestQueryParams({
  queryParams,
  onAddQueryParam,
  onDeleteQueryParam,
  onSetQueryParamName,
  onSetQueryParamValue,
}: ApiRequestQueryParamsProps) {
  const data: Record<string, [string, string]> = queryParams.reduce(
    (acc: Record<string, [string, string]>, queryParam) => {
      acc[queryParam.id] = [queryParam.name, queryParam.value];
      return acc;
    },
    {}
  );

  return (
    <div className="p-2 w-full">
      <div className="flex flex-row items-center pb-2">
        <h3 className="text-sm font-semibold">Query Params</h3>
        <Button className="ml-auto" onClick={onAddQueryParam}>
          Add
        </Button>
      </div>
      <NameValueTable
        data={data}
        onNameChange={onSetQueryParamName}
        onValueChange={onSetQueryParamValue}
        onDelete={onDeleteQueryParam}
      ></NameValueTable>
    </div>
  );
}
