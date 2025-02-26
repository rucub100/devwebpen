import { ReactNode } from "react";
import { MainView, TabData } from "../types/view-state";
import Welcome from "../views/Welcome";
import styles from "./Main.module.css";
import Default from "../views/Default";
import ApiRequestResponse from "../views/ApiRequestResponse";

const viewComponents: Record<MainView, (data?: TabData | null) => ReactNode> = {
  none: () => <Default></Default>,
  welcome: () => <Welcome></Welcome>,
  apiRequest: (data) => <ApiRequestResponse data={data}></ApiRequestResponse>,
};

interface MainProps {
  view: MainView;
  data?: TabData | null;
}

export default function Main({ view, data }: MainProps) {
  return (
    <div className={`@container ${styles.main}`}>
      {viewComponents[view](data)}
    </div>
  );
}
