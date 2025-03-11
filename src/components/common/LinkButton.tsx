import { HTMLAttributes, ReactNode } from "react";

interface LinkButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function LinkButton({
  children,
  onClick,
  className,
  disabled,
  ...props
}: LinkButtonProps) {
  const style = disabled
    ? "text-neutral-600"
    : "text-primary-600 hover:bg-primary-600/5 active:text-primary-500";
  return (
    <button
      className={`${style} rounded px-2 py-1 ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
