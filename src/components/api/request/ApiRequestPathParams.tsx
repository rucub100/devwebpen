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
import { HttpPathParameter } from "../../../types/api-client";
import NameValueTable from "../../common/NameValueTable";

interface ApiRequestPathParamsProps {
  pathParams: HttpPathParameter[];
  onSetPathParamValue: (id: string, value: string) => void;
}

export default function ApiRequestPathParams({
  pathParams,
  onSetPathParamValue,
}: ApiRequestPathParamsProps) {
  const data: Record<string, [string, string]> = pathParams.reduce(
    (acc: Record<string, [string, string]>, pathParam) => {
      acc[pathParam.id] = [pathParam.name, pathParam.value];
      return acc;
    },
    {}
  );

  return (
    <div className="p-2 w-full">
      <h3 className="text-sm font-semibold pb-2">Path Params</h3>
      <NameValueTable
        readonlyName={true}
        canDelete={false}
        data={data}
        onValueChange={onSetPathParamValue}
      ></NameValueTable>
    </div>
  );
}
