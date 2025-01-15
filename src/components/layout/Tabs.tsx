import { HTMLAttributes, ReactNode } from "react";
import styles from "./Tabs.module.css";
import Main from "../Main";
import { useViewState } from "../../hooks/useViewState";
import { defaultTabNames, Navigation, Tab } from "../../types/view-state";
import Icon from "../common/Icon";
import IconButton from "../common/IconButton";

const tabIcons: Record<Navigation, ReactNode> = {
  [Navigation.Dashboard]: <Icon icon="dashboard" className="h-5" />,
};

interface TabsProps extends HTMLAttributes<HTMLDivElement> {}

export default function Tabs({}: TabsProps) {
  const { viewState } = useViewState();

  const tabs: Tab[] = viewState?.tabs || [];

  return (
    <div className={styles.tabs}>
      <header className={`${styles.header}`}>
        {tabs.map((tab) => (
          <div
            key={tab.kind.name}
            className={`${styles.tab} border-r border-neutral-800`}
          >
            {tabIcons[tab.kind.nav]}
            <span>{tab.label || defaultTabNames[tab.kind.name]}</span>
            <IconButton
              icon={<Icon icon="close"></Icon>}
              className="hover:bg-primary-600/10 p-0.5 rounded"
            ></IconButton>
          </div>
        ))}
      </header>
      <div
        className={`${styles.content} bg-gradient-to-b from-neutral-800/25 to-25% to-transparent`}
      >
        <Main></Main>
      </div>
    </div>
  );
}
