import Icon from "./common/Icon";
import IconButton from "./common/IconButton";

export default function Navigation() {
  return (
    <div className="flex flex-col">
      <IconButton icon={<Icon icon="dashboard" width={32}></Icon>} />
      {/* <IconButton icon="traffic" />
      <IconButton icon="api" /> */}
    </div>
  );
}
