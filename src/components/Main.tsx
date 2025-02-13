import { ReactNode } from "react";
import { MainView } from "../types/view-state";
import Welcome from "../views/Welcome";
import styles from "./Main.module.css";
import Default from "../views/Default";
import ApiRequest from "../views/ApiRequest";

const viewComponents: Record<MainView, ReactNode> = {
  none: <Default></Default>,
  welcome: <Welcome></Welcome>,
  apiRequest: <ApiRequest></ApiRequest>,
};

interface MainProps {
  view: MainView;
}

export default function Main({ view }: MainProps) {
  return (
    <div className={`@container ${styles.main}`}>{viewComponents[view]}</div>
  );
}
