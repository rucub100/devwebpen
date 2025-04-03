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
import { ApiRequestTabData } from "../types/view-state";
import SplitPane from "../components/common/SplitPane";
import ApiRequest from "../components/api/request/ApiRequest";
import ApiResponse from "../components/api/response/ApiResponse";

interface ApiRequestProps {
  data?: ApiRequestTabData | null;
}

export default function ApiRequestResponse({ data }: ApiRequestProps) {
  return (
    <SplitPane
      firstPaneChildren={<ApiRequest data={data}></ApiRequest>}
      secondPaneChildren={<ApiResponse data={data}></ApiResponse>}
      orientation="horizontal"
      firstPaneSize={350}
    ></SplitPane>
  );
}
