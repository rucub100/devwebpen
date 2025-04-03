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
import {
  HttpPathParameter,
  HttpQueryParameter,
} from "../../../types/api-client";
import SplitPane from "../../common/SplitPane";
import ApiRequestPathParams from "./ApiRequestPathParams";
import ApiRequestQueryParams from "./ApiRequestQueryParams";

interface ApiRequestParamsProps {
  pathParams: HttpPathParameter[];
  queryParams: HttpQueryParameter[];
  onAddQueryParam: () => void;
  onDeleteQueryParam: (id: string) => void;
  onSetQueryParamName: (id: string, name: string) => void;
  onSetQueryParamValue: (id: string, value: string) => void;
  onSetPathParamValue: (id: string, value: string) => void;
}

export default function ApiRequestParams({
  pathParams,
  queryParams,
  onAddQueryParam,
  onDeleteQueryParam,
  onSetQueryParamName,
  onSetQueryParamValue,
  onSetPathParamValue,
}: ApiRequestParamsProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <SplitPane
        orientation="vertical"
        firstPaneChildren={
          <ApiRequestPathParams
            pathParams={pathParams}
            onSetPathParamValue={onSetPathParamValue}
          ></ApiRequestPathParams>
        }
        secondPaneChildren={
          <ApiRequestQueryParams
            queryParams={queryParams}
            onAddQueryParam={onAddQueryParam}
            onDeleteQueryParam={onDeleteQueryParam}
            onSetQueryParamName={onSetQueryParamName}
            onSetQueryParamValue={onSetQueryParamValue}
          ></ApiRequestQueryParams>
        }
      ></SplitPane>
    </div>
  );
}
