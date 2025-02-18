import {
  HttpPathParameter,
  HttpQueryParameter,
} from "../../../types/api-client";
import SplitPane from "../../common/SplitPane";
import ApiRequestPathParams from "./ApiRequestPathParams";
import ApiRequestQueryParams from "./ApiRequestQueryParams";

interface ApiRequestParamsProps {
  pathParams: HttpPathParameter[];
  queryParams: HttpQueryParameter[];
  onAddQueryParam: () => void;
  onDeleteQueryParam: (id: string) => void;
  onSetQueryParamName: (id: string, name: string) => void;
  onSetQueryParamValue: (id: string, value: string) => void;
  onSetPathParamValue: (id: string, value: string) => void;
}

export default function ApiRequestParams({
  pathParams,
  queryParams,
  onAddQueryParam,
  onDeleteQueryParam,
  onSetQueryParamName,
  onSetQueryParamValue,
  onSetPathParamValue,
}: ApiRequestParamsProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <SplitPane
        orientation="vertical"
        firstPaneChildren={
          <ApiRequestPathParams
            pathParams={pathParams}
            onSetPathParamValue={onSetPathParamValue}
          ></ApiRequestPathParams>
        }
        secondPaneChildren={
          <ApiRequestQueryParams
            queryParams={queryParams}
            onAddQueryParam={onAddQueryParam}
            onDeleteQueryParam={onDeleteQueryParam}
            onSetQueryParamName={onSetQueryParamName}
            onSetQueryParamValue={onSetQueryParamValue}
          ></ApiRequestQueryParams>
        }
      ></SplitPane>
    </div>
  );
}
