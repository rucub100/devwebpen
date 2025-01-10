import Icon, { IconProps } from "./Icon";

interface IconButtonProps {
  icon: IconProps["icon"];
  onClick?: React.MouseEventHandler;
  className?: string;
}

export default function IconButton({
  icon,
  onClick,
  className,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-neutral-400 hover:text-neutral-200 outline-none px-2 py-1.5 ${className}`}
    >
      <Icon icon={icon} />
    </button>
  );
}
