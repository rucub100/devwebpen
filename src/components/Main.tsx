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
import { ReactNode } from "react";
import {
  isApiRequestTabData,
  isProxyTrafficTabData,
  MainView,
  TabData,
} from "../types/view-state";
import Welcome from "../views/Welcome";
import styles from "./Main.module.css";
import Default from "../views/Default";
import ApiRequestResponse from "../views/ApiRequestResponse";
import ProxyRequestResponse from "../views/ProxyRequestResponse";

const viewComponents: Record<MainView, (data?: TabData | null) => ReactNode> = {
  none: () => <Default></Default>,
  welcome: () => <Welcome></Welcome>,
  apiRequest: (data) => (
    <ApiRequestResponse
      data={isApiRequestTabData(data) ? data : undefined}
    ></ApiRequestResponse>
  ),
  proxyTraffic: (data) => (
    <ProxyRequestResponse
      data={isProxyTrafficTabData(data) ? data : undefined}
    ></ProxyRequestResponse>
  ),
};

interface MainProps {
  view: MainView;
  data?: TabData | null;
}

export default function Main({ view, data }: MainProps) {
  return (
    <div className={`@container ${styles.main}`}>
      {viewComponents[view](data)}
    </div>
  );
}
