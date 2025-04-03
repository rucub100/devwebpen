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
import { HTMLAttributes } from "react";
import styles from "./Tabs.module.css";
import Main from "../Main";
import { useViewState } from "../../hooks/useViewState";
import Tab from "./Tab";

interface TabsProps extends HTMLAttributes<HTMLDivElement> {}

export default function Tabs({}: TabsProps) {
  const { tabs, main, selectTab, closeTab } = useViewState({
    listenTabs: true,
    listenMain: true,
  });

  const activeTabData = tabs?.tabs.find(
    (tab) => tab.id === tabs.activeTabId
  )?.data;

  return (
    <div className={styles.tabs}>
      <header className={`${styles.header}`}>
        {tabs &&
          tabs.tabs.map((tab) => (
            <Tab
              key={tab.id}
              tab={tab}
              onCloseTab={closeTab}
              onSelectTab={selectTab}
              isActive={tab.id === tabs.activeTabId}
            ></Tab>
          ))}
      </header>
      <div
        className={`${styles.content} bg-gradient-to-b from-neutral-800/25 to-25% to-transparent`}
      >
        {main && <Main view={main} data={activeTabData}></Main>}
      </div>
    </div>
  );
}
