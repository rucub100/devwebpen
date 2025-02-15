import SplitPane from "../../common/SplitPane";
import ApiRequestPathParams from "./ApiRequestPathParams";
import ApiRequestQueryParams from "./ApiRequestQueryParams";

interface ApiRequestParamsProps {
  pathParams: Record<string, string | number | boolean>;
  queryParams: Record<string, string | number | boolean>;
}

export default function ApiRequestParams({
  pathParams,
  queryParams,
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
          ></ApiRequestQueryParams>
        }
      ></SplitPane>
    </div>
  );
}
