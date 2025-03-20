import { HTMLAttributes } from "react";

import Icon from "./Icon";
import IconButton from "./IconButton";

interface PanelHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
}

export default function PanelHeader({ onClose }: PanelHeaderProps) {
  return (
    <div className="flex flex-row items-center border-b border-neutral-800 px-1">
      <div className="text-xs font-light border-b border-primary-800 cursor-pointer">
        Proxy Traffic
      </div>
      <IconButton
        icon={<Icon icon="close"></Icon>}
        className="ml-auto hover:bg-primary-600/10 p-0.5 my-1 rounded"
        onClick={onClose}
      ></IconButton>
    </div>
  );
}
