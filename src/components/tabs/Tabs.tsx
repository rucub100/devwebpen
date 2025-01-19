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
        {main && <Main view={main}></Main>}
      </div>
    </div>
  );
}
