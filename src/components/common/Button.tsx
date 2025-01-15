import { HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="bg-primary-950 hover:bg-primary-900 text-neutral-200 active:text-primary-50 rounded px-2 py-1 min-w-max max-w-[250px]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
