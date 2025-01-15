import { useViewState } from "../hooks/useViewState";
import Icon from "./common/Icon";
import IconButton from "./common/IconButton";
import { Navigation as Nav } from "../types/view-state";

export default function Navigation() {
  const { viewState, navigateTo } = useViewState();

  const textColor = `hover:text-neutral-200 ${
    viewState?.navigation === "dashboard"
      ? "text-neutral-200"
      : "text-neutral-400"
  }`;

  const displayIndicator =
    viewState?.navigation === "dashboard" ? "block" : "hidden";

  return (
    <div className="flex flex-col">
      {/* Dashboard */}
      <div className="relative">
        <div
          className={`${displayIndicator} absolute left-0 bg-primary-600 h-12 w-0.5`}
        ></div>
        <IconButton
          onClick={() => navigateTo(Nav.Dashboard)}
          icon={<Icon icon="dashboard" width={32}></Icon>}
          className={`${textColor} p-2`}
        />
      </div>
      {/* <IconButton icon="traffic" />
      <IconButton icon="api" /> */}
    </div>
  );
}
