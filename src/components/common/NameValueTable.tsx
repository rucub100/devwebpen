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
import Icon from "./Icon";
import IconButton from "./IconButton";

interface NameValueTableProps extends HTMLAttributes<HTMLTableElement> {
  data: Record<string, [string, string]>;
  readonlyName?: boolean;
  readonlyValue?: boolean;
  canDelete?: boolean;
  namePlaceholder?: string;
  valuePlaceholder?: string;
  className?: string;
  onNameChange?: (key: string, name: string) => void;
  onValueChange?: (key: string, value: string) => void;
  onDelete?: (key: string) => void;
}

export default function NameValueTable({
  data,
  readonlyName = false,
  readonlyValue = false,
  namePlaceholder = "Name",
  valuePlaceholder = "Value",
  canDelete = true,
  className,
  onNameChange,
  onValueChange,
  onDelete,
  ...props
}: NameValueTableProps) {
  return (
    <table className={`w-full ${className}`} {...props}>
      <colgroup>
        <col className="w-[30%] @7xl:w-[42ch]"></col>
        <col className="w-4"></col>
        <col></col>
        {canDelete && <col className="w-6"></col>}
      </colgroup>
      <tbody>
        {Object.entries(data).map(([key, [name, value]]) => (
          <tr key={key} className="align-middle">
            <td>
              <input
                type="text"
                value={name}
                className="w-full px-1"
                readOnly={readonlyName}
                placeholder={namePlaceholder}
                onChange={(event) => onNameChange?.(key, event.target.value)}
              ></input>
            </td>
            <td>:</td>
            <td>
              <input
                type="text"
                value={value}
                className="w-full px-1"
                readOnly={readonlyValue}
                placeholder={valuePlaceholder}
                onChange={(event) => onValueChange?.(key, event.target.value)}
              ></input>
            </td>
            {canDelete && (
              <td>
                <div
                  className="flex items-center justify-center"
                  title="Delete"
                >
                  <IconButton
                    icon={<Icon icon="delete"></Icon>}
                    onClick={() => onDelete?.(key)}
                  ></IconButton>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
