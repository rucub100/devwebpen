import { HTMLAttributes } from "react";

interface LinkButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export default function LinkButton({
  children,
  onClick,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <button
      className={`text-primary-600 hover:bg-primary-600/5 active:text-primary-500 rounded px-2 py-1 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
