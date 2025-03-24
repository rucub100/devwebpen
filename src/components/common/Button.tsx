import { HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const style = disabled
    ? "bg-primary-950/50 text-neutral-400"
    : "bg-primary-950 hover:bg-primary-900 text-neutral-200 active:text-primary-50";

  return (
    <button
      className={`${style} rounded px-2 py-1 min-w-max max-w-[250px] ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
