import { ApiRequestTabData } from "../types/view-state";
import SplitPane from "../components/common/SplitPane";
import ApiRequest from "../components/api/request/ApiRequest";
import ApiResponse from "../components/api/response/ApiResponse";

interface ApiRequestProps {
  data?: ApiRequestTabData | null;
}

export default function ApiRequestResponse({ data }: ApiRequestProps) {
  return (
    <SplitPane
      firstPaneChildren={<ApiRequest data={data}></ApiRequest>}
      secondPaneChildren={<ApiResponse data={data}></ApiResponse>}
      orientation="horizontal"
      firstPaneSize={350}
    ></SplitPane>
  );
}
