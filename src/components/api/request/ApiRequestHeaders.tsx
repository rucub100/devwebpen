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
import Button from "../../common/Button";
import NameValueTable from "../../common/NameValueTable";

interface ApiRequestHeadersProps {
  scheme: string;
  authority: string;
  path: string;
  headers: HttpHeader[];
  onSchemeChange: (scheme: string) => void;
  onAuthorityChange: (authority: string) => void;
  onPathChange: (path: string) => void;
  onAddHeader: () => void;
  onDeleteHeader: (key: string) => void;
  onSetHeaderName: (key: string, name: string) => void;
  onSetHeaderValue: (key: string, value: string) => void;
}
export default function ApiRequestHeaders({
  scheme,
  authority,
  path,
  headers,
  onSchemeChange,
  onAuthorityChange,
  onPathChange,
  onAddHeader,
  onDeleteHeader,
  onSetHeaderName,
  onSetHeaderValue,
}: ApiRequestHeadersProps) {
  const data: Record<string, [string, string]> = headers.reduce(
    (acc: Record<string, [string, string]>, header) => {
      acc[header.id] = [header.name, header.value];
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col items-start p-2 gap-4 overflow-y-auto">
      <div
        className="grid grid-cols-2 gap-x-4 gap-y-2 w-full"
        style={{ gridTemplateColumns: "max-content minmax(0px, 1fr)" }}
      >
        <label>:scheme</label>
        <select
          className="py-1 rounded-l cursor-pointer mr-auto"
          value={scheme}
          onChange={(event) => onSchemeChange(event.target.value)}
        >
          <option value="https">HTTPS</option>
          <option value="http">HTTP</option>
        </select>
        <label>:authority</label>
        <input
          type="text"
          className="px-1 w-full"
          value={authority}
          onChange={(event) => onAuthorityChange(event.target.value)}
        ></input>
        <label>:path</label>
        <input
          type="text"
          className="px-1 w-full"
          value={path}
          onChange={(event) => onPathChange(event.target.value)}
        ></input>
      </div>
      <Button className="self-end" onClick={onAddHeader}>
        Add
      </Button>
      <NameValueTable
        data={data}
        onNameChange={onSetHeaderName}
        onValueChange={onSetHeaderValue}
        onDelete={onDeleteHeader}
      ></NameValueTable>
    </div>
  );
}
