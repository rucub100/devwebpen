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

interface PanelHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
}

export default function PanelHeader({ onClose }: PanelHeaderProps) {
  return (
    <div className="flex flex-row items-center border-b border-neutral-800 px-1">
      <div className="text-xs font-light border-b border-primary-800 cursor-pointer">
        Proxy Traffic
      </div>
      <IconButton
        icon={<Icon icon="close"></Icon>}
        className="ml-auto hover:bg-primary-600/10 p-0.5 my-1 rounded"
        onClick={onClose}
      ></IconButton>
    </div>
  );
}
