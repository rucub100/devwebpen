import useApiResponseHistory from "../../../hooks/useApiResponseHistory";
import { ApiRequestTabData } from "../../../types/view-state";
import ApiResponseStartLine from "./ApiResponseStartLine";

interface ApiRequestProps {
  data?: ApiRequestTabData | null;
}

export default function ApiResponse({ data }: ApiRequestProps) {
  const requestId = data?.apiRequest.requestId;
  const { responseHistory } = useApiResponseHistory(requestId);

  const response =
    responseHistory.length > 0
      ? responseHistory[responseHistory.length - 1]
      : null;

  return (
    <div className="flex flex-col w-full h-full min-w-max">
      {response ? (
        <>
          <ApiResponseStartLine response={response}></ApiResponseStartLine>
        </>
      ) : (
        "NO RESPONSE"
      )}
    </div>
  );
}
