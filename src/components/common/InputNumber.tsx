import { HTMLAttributes } from "react";

interface InputNumberProps extends HTMLAttributes<HTMLInputElement> {
  value?: number;
  disabled?: boolean;
}

export default function InputNumber({
  value = 0,
  disabled = false,
  className = "",
  ...props
}: InputNumberProps) {
  return (
    <input
      type="number"
      className={`bg-neutral-800 min-w-max max-w-[250px] ${
        disabled ? "text-neutral-500" : ""
      } ${className}`}
      disabled={disabled}
      value={value}
      {...props}
    />
  );
}
