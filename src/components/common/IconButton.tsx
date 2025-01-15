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
    <button className={`outline-none ${className}`} {...props}>
      {icon}
    </button>
  );
}
