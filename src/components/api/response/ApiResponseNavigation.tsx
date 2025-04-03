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
import NavigationTabs from "../../common/NavigationTabs";

const apiResponseNavigationItem = {
  Body: "body",
  Headers: "headers",
} as const;
type ApiResponseNavigationItemKeys = keyof typeof apiResponseNavigationItem;
export type ApiResponseNavigationItem =
  (typeof apiResponseNavigationItem)[ApiResponseNavigationItemKeys];

const tabs = Object.entries(apiResponseNavigationItem).map(([label, name]) => ({
  name,
  label,
}));

interface ApiResponseNavigationProps {
  selectedTab: ApiResponseNavigationItem;
  onSelectTab: (tab: ApiResponseNavigationItem) => void;
}

export default function ApiResponseNavigation({
  selectedTab,
  onSelectTab,
}: ApiResponseNavigationProps) {
  return (
    <NavigationTabs
      tabs={tabs}
      selectedItem={selectedTab}
      onSelect={(item) => onSelectTab(item as ApiResponseNavigationItem)}
    ></NavigationTabs>
  );
}
