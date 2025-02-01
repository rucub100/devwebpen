import { useViewState } from "../hooks/useViewState";
import Icon from "./common/Icon";
import IconButton from "./common/IconButton";

export default function Navigation() {
  const { nav, navigateTo } = useViewState({ listenNav: true });

  const textColor = `hover:text-neutral-200 ${
    nav === "dashboard" ? "text-neutral-200" : "text-neutral-400"
  }`;

  const displayIndicator = nav === "dashboard" ? "block" : "hidden";

  return (
    <div className="flex flex-col">
      {/* Dashboard */}
      <div className="relative">
        <div
          className={`${displayIndicator} absolute left-0 bg-primary-600/50 h-12 w-0.5`}
        ></div>
        <IconButton
          onClick={() => navigateTo("dashboard")}
          icon={<Icon icon="dashboard" width={32}></Icon>}
          className={`${textColor} p-2`}
          title="Dashboard"
        />
      </div>
      {/* <IconButton icon="traffic" />
      <IconButton icon="api" /> */}
    </div>
  );
}
