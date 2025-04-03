/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
