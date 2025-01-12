import { HTMLAttributes } from "react";

interface LinkButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export default function LinkButton({ children, onClick }: LinkButtonProps) {
  return (
    <button
      className="text-primary-600 hover:text-primary-500"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
