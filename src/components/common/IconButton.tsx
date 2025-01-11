import { HTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends HTMLAttributes<HTMLElement> {
  icon: ReactNode;
}

export default function IconButton({
  icon,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`text-neutral-400 hover:text-neutral-200 outline-none px-2 py-1.5 ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
