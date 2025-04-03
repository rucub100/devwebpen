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
import { useViewState } from "../hooks/useViewState";
import { NavView } from "../types/view-state";
import Icon from "./common/Icon";
import IconButton from "./common/IconButton";

interface NavigationItemProps {
  icon: Parameters<typeof Icon>[0]["icon"];
  title: string;
  navView: NavView;
  disabled?: boolean;
}

export default function NavigationItem({
  icon,
  title,
  navView,
  disabled,
}: NavigationItemProps) {
  const { nav, navigateTo } = useViewState({ listenNav: true });

  const displayIndicator = nav === navView && !disabled ? "block" : "hidden";
  const textColor = `${
    disabled
      ? "text-neutral-600 cursor-not-allowed"
      : `hover:text-neutral-200 ${
          nav === navView ? "text-neutral-200" : "text-neutral-400"
        }`
  }`;

  return (
    <div className="relative">
      <div
        className={`${displayIndicator} absolute left-0 bg-primary-600/50 h-12 w-0.5`}
      ></div>
      <IconButton
        icon={<Icon icon={icon} fontSize={32} wght={200}></Icon>}
        title={title}
        className={`${textColor} p-2`}
        disabled={disabled}
        onClick={() => navigateTo(navView)}
      />
    </div>
  );
}
