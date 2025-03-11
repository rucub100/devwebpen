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
