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
export type NavigationTabItem = {
  name: string;
  label: string;
};

interface NavigationTabsProps {
  tabs: NavigationTabItem[];
  selectedItem: string;
  onSelect: (item: string) => void;
}

export default function NavigationTabs({
  tabs,
  selectedItem,
  onSelect,
}: NavigationTabsProps) {
  return (
    <div className="flex flex-row items-center w-full">
      {tabs.map((tab) => (
        <div
          key={tab.name}
          className={`p-2 cursor-pointer hover:bg-neutral-800 ${
            tab.name === selectedItem ? "bg-neutral-800" : ""
          }`}
          onClick={() => onSelect(tab.name)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}
