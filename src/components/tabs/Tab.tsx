import { ReactNode, useCallback, MouseEvent } from "react";

import {
  defaultTabNames,
  Navigation,
  Tab as TabData,
} from "../../types/view-state";
import Icon from "../common/Icon";
import IconButton from "../common/IconButton";
import styles from "./Tabs.module.css";

const tabIcons: Record<Navigation, ReactNode> = {
  [Navigation.Dashboard]: <Icon icon="dashboard" className="h-5" />,
};

interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  tab: TabData;
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
  const closeTabHandler = useCallback(
    (event: MouseEvent, id: number) => {
      event.preventDefault();
      onCloseTab(id);
    },
    [onCloseTab]
  );

  return (
    <div
      key={tab.id}
      className={`${styles.tab} hover:bg-neutral-800/25 border-r border-neutral-800 ${isActiveClass} ${className}`}
      {...props}
    >
      {tabIcons[tab.kind.nav]}
      <span>{tab.label || defaultTabNames[tab.kind.name]}</span>
      <IconButton
        icon={<Icon icon="close"></Icon>}
        className="hover:bg-primary-600/10 p-0.5 rounded"
        onClick={(event) => closeTabHandler(event, tab.id)}
      ></IconButton>
    </div>
  );
}
