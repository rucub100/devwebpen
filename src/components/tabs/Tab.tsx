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
import { ReactNode, useCallback, MouseEvent } from "react";

import { NavView, TabData, Tab as TabState } from "../../types/view-state";
import Icon from "../common/Icon";
import IconButton from "../common/IconButton";
import styles from "./Tabs.module.css";

import Logo from "../../../app-icon.svg";

const tabIcons: Record<NavView, ReactNode> = {
  none: undefined,
  dashboard: (
    <img src={Logo} alt="Devwebpen Logo" className="h-4 aspect-square" />
  ),
  proxy: <Icon icon="traffic"></Icon>,
  apiClient: <Icon icon="api"></Icon>,
};

interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  tab: TabState<TabData>;
  isActive: boolean;
  className?: string;
  onCloseTab: (id: number) => void;
  onSelectTab: (id: number) => void;
}

export default function Tab({
  tab,
  isActive,
  onCloseTab,
  onSelectTab,
  className,
  ...props
}: TabProps) {
  const isActiveClass = isActive ? "bg-neutral-800/25" : "";
  const displayIndicator = isActive ? "block" : "hidden";

  const closeTabHandler = useCallback(
    (event: MouseEvent, id: number) => {
      event.preventDefault();
      if (event.button === 0 || event.button === 1) {
        onCloseTab(id);
      }
    },
    [onCloseTab]
  );

  return (
    <div
      key={tab.id}
      className={`${styles.tab} relative hover:bg-neutral-800/25 border-r border-neutral-800 ${isActiveClass} ${className}`}
      onAuxClick={(event) => closeTabHandler(event, tab.id)}
      onClick={() => onSelectTab(tab.id)}
      {...props}
    >
      <div
        className={`${displayIndicator} absolute top-0 left-0 right-0 bg-primary-600/50 h-0.5`}
      ></div>
      {tabIcons[tab.kind.nav]}
      <span>{tab.label ?? tab.kind.name}</span>
      <IconButton
        icon={<Icon icon="close"></Icon>}
        className="hover:bg-primary-600/10 p-0.5 rounded"
        onClick={(event) => closeTabHandler(event, tab.id)}
      ></IconButton>
    </div>
  );
}
