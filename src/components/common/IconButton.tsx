import { HTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  disabled?: boolean;
}

export default function IconButton({
  icon,
  className = "",
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`flex outline-none ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
}
