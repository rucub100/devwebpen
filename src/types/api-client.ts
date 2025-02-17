const httpVersion = {
  HTTP_1_1: "HTTP/1.1",
  HTTP_2: "HTTP/2",
  HTTP_3: "HTTP/3",
} as const;
type HttpVersionKeys = keyof typeof httpVersion;
export type HttpVersion = (typeof httpVersion)[HttpVersionKeys];

export type HttpHeader = {
  id: string;
  name: string;
  value: string;
};

export type HttpRequest = {
  id: string;
  method: string;
  scheme: string;
  authority: string;
  path: string;
  version: HttpVersion;
  queryParams?: Record<string, string | number | boolean>;
  pathParams?: Record<string, string | number | boolean>;
  headers: HttpHeader[];
  body: null | string | ArrayBuffer;
};

export type HttpResponse = {
  version: HttpVersion;
  status: number;
  headers: HttpHeader[];
  body: null | string | ArrayBuffer;
  requestId: string;
  responseTimeMs: number;
  responseSizeBytes: number;
};

export type ApiCollection = {
  name: string;
  description?: string;
  requests: HttpRequest[];
  variables?: Record<string, string>;
};

export type ApiEnvironment = {
  name: string;
  description?: string;
  variables: Record<string, string>;
};

export type ApiClient = {
  collections: ApiCollection[];
  environments: ApiEnvironment[];
  history: [HttpRequest, HttpResponse][];
};

const apiclientEvents = {
  ApiClientChanged: "devwebpen://api-client-changed",
} as const;

type ApiClientEventKeys = keyof typeof apiclientEvents;
export type ApiClientEvent = (typeof apiclientEvents)[ApiClientEventKeys];
