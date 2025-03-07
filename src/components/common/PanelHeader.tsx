import { HTMLAttributes } from "react";

import Icon from "./Icon";
import IconButton from "./IconButton";

interface PanelHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
}

export default function PanelHeader({ onClose }: PanelHeaderProps) {
  return (
    <div className="flex flex-row border-b border-neutral-800">
      <IconButton
        icon={<Icon icon="close"></Icon>}
        className="ml-auto hover:bg-primary-600/10 p-0.5 rounded"
        onClick={onClose}
      ></IconButton>
    </div>
  );
}
