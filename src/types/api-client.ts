/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
