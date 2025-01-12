import { HTMLAttributes } from "react";
import styles from "./Tabs.module.css";
import Main from "../Main";

interface TabsProps extends HTMLAttributes<HTMLDivElement> {}

export default function Tabs({}: TabsProps) {
  return (
    <div className={styles.tabs}>
      <header className={styles.header}>
        <div className={styles.tab}>Welcome</div>
      </header>
      <div className={styles.content}>
        <Main></Main>
      </div>
    </div>
  );
}
