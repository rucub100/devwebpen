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
import { HttpHeader } from "../../../types/api-client";
import NameValueTable from "../../common/NameValueTable";

interface ApiResponseHeadersProps {
  headers: HttpHeader[];
}
export default function ApiResponseHeaders({
  headers,
}: ApiResponseHeadersProps) {
  const data: Record<string, [string, string]> = headers.reduce(
    (acc: Record<string, [string, string]>, header) => {
      acc[header.id] = [header.name, header.value];
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col items-start p-2 gap-4 overflow-y-auto">
      <NameValueTable
        data={data}
        readonlyName
        readonlyValue
        canDelete={false}
      ></NameValueTable>
    </div>
  );
}
