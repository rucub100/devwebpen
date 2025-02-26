const httpVersion = {
  HTTP_1_1: "HTTP/1.1",
  HTTP_2: "HTTP/2",
  HTTP_3: "HTTP/3",
} as const;
type HttpVersionKeys = keyof typeof httpVersion;
export type HttpVersion = (typeof httpVersion)[HttpVersionKeys];

export type HttpPathParameter = {
  id: string;
  name: string;
  value: string;
};

export type HttpQueryParameter = {
  id: string;
  name: string;
  value: string;
};

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
  httpVersion: HttpVersion;
  queryParams?: HttpQueryParameter[];
  pathParams?: HttpPathParameter[];
  headers: HttpHeader[];
  body?: Uint8Array;
};

export type HttpResponse = {
  httpVersion: HttpVersion;
  status: number;
  headers: HttpHeader[];
  body?: Uint8Array;
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
