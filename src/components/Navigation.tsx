import { useViewState } from "../hooks/useViewState";
import Icon from "./common/Icon";
import IconButton from "./common/IconButton";

export default function Navigation() {
  const { viewState } = useViewState();
  return (
    <div className="flex flex-col">
      <IconButton
        icon={<Icon icon="dashboard" width={32}></Icon>}
        className="text-neutral-400 hover:text-neutral-200"
        style={{
          color:
            viewState?.navigation === "dashboard"
              ? "text-neutral-200"
              : "inherit",
        }}
      />
      {/* <IconButton icon="traffic" />
      <IconButton icon="api" /> */}
    </div>
  );
}
