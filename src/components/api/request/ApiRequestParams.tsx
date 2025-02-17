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
}

export default function ApiRequestParams({
  pathParams,
  queryParams,
  onAddQueryParam,
  onDeleteQueryParam,
}: ApiRequestParamsProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <SplitPane
        orientation="vertical"
        firstPaneChildren={
          <ApiRequestPathParams pathParams={pathParams}></ApiRequestPathParams>
        }
        secondPaneChildren={
          <ApiRequestQueryParams
            queryParams={queryParams}
            onAddQueryParam={onAddQueryParam}
            onDeleteQueryParam={onDeleteQueryParam}
          ></ApiRequestQueryParams>
        }
      ></SplitPane>
    </div>
  );
}
