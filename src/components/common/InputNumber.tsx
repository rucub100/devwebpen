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
