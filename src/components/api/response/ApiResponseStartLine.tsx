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
  let statusText = "";

  switch (status) {
    case 200:
      statusText = " OK";
      break;
    case 201:
      statusText = " Created";
      break;
    case 202:
      statusText = " Accepted";
      break;
    case 204:
      statusText = " No Content";
      break;
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
