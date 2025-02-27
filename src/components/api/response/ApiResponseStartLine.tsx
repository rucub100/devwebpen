import { httpResponseStatusText } from "../../../helpers/http-response-status-codes";
import { HttpResponse } from "../../../types/api-client";

interface ApiResponseStartLineProps {
  response: HttpResponse;
}

function formatBytes(bytes: number) {
  if (bytes > 1048576) {
    return `${(bytes / 1048576).toFixed(2)} MB`;
  } else if (bytes > 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${bytes} Bytes`;
  }
}

function formatMs(ms: number) {
  if (ms > 1000) {
    return `${(ms / 1000).toFixed(2)} s`;
  } else {
    return `${ms} ms`;
  }
}

function formatStatus(status: number) {
  let statusText = httpResponseStatusText(status);
  if (statusText.length > 0) {
    statusText = ` ${statusText}`;
  }
  return `${status}${statusText}`;
}

export default function ApiResponseStartLine({
  response,
}: ApiResponseStartLineProps) {
  return (
    <div className="flex flex-row items-center w-full p-2 gap-2">
      <div className="px-2 py-1 bg-neutral-800">
        {formatStatus(response.status)}
      </div>
      <div className="px-2 py-1 bg-neutral-800">
        {formatMs(response.responseTimeMs)}
      </div>
      <div className="px-2 py-1 bg-neutral-800">
        {formatBytes(response.responseSizeBytes)}
      </div>
    </div>
  );
}
