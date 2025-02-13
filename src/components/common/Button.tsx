import { HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  className,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`bg-primary-950 hover:bg-primary-900 text-neutral-200 active:text-primary-50 rounded px-2 py-1 min-w-max max-w-[250px] ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
