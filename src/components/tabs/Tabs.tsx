import { HTMLAttributes } from "react";
import styles from "./Tabs.module.css";
import Main from "../Main";
import { useViewState } from "../../hooks/useViewState";
import { Tab as TabData } from "../../types/view-state";
import Tab from "./Tab";

interface TabsProps extends HTMLAttributes<HTMLDivElement> {}

export default function Tabs({}: TabsProps) {
  const { viewState, selectTab, closeTab } = useViewState();

  const tabs: TabData[] = viewState?.tabs.tabs || [];

  return (
    <div className={styles.tabs}>
      <header className={`${styles.header}`}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            onCloseTab={closeTab}
            onSelectTab={selectTab}
            isActive={tab.id === viewState?.tabs.activeTabId}
          ></Tab>
        ))}
      </header>
      <div
        className={`${styles.content} bg-gradient-to-b from-neutral-800/25 to-25% to-transparent`}
      >
        {/* TODO: render based on active tab */}
        <Main view={viewState?.main}></Main>
      </div>
    </div>
  );
}
