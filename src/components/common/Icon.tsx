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
import { CSSProperties, HTMLAttributes } from "react";

/**
 * Icons from Material Design Icons repo:
 * https://github.com/google/material-design-icons
 *
 */
type IconString =
  | "api"
  | "close"
  | "dashboard"
  | "delete"
  | "error"
  | "traffic"
  | "toggle_on"
  | "toggle_off";

export interface IconProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  icon: IconString;
  fontSize?: CSSProperties["fontSize"];
  style?: "outlined" | "rounded" | "sharp";
  className?: string;
  fill?: boolean;
  wght?: number; // weight from 100 to 700
  grad?: number; // grade from -25 to 200
  opsz?: number; // optical size from 20 to 48
}

export default function Icon({
  icon,
  fontSize,
  style = "sharp",
  className = "",
  fill = false,
  grad = 0,
  opsz = 20,
  wght = 400,
  ...props
}: IconProps) {
  const fontVariationSettings = `'FILL' ${
    fill ? 1 : 0
  }, 'wght' ${wght}, 'GRAD' ${grad}, 'opsz' ${opsz}`;

  return (
    <span
      className={`material-symbols-${style} ${className}`}
      style={{ fontVariationSettings: fontVariationSettings, fontSize }}
      {...props}
    >
      {icon}
    </span>
  );
}
