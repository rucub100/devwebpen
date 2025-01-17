import { ReactNode } from "react";
import { MainView } from "../types/view-state";
import Welcome from "../views/Welcome";
import styles from "./Main.module.css";
import Default from "../views/Default";

const viewComponents: Record<MainView, ReactNode> = {
  [MainView.Welcome]: <Welcome></Welcome>,
};

interface MainProps {
  view?: MainView | null;
}

export default function Main({ view }: MainProps) {
  return (
    <div className={`@container ${styles.main}`}>
      {view ? viewComponents[view] : <Default></Default>}
    </div>
  );
}
