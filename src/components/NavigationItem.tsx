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
        icon={<Icon icon={icon} width={32}></Icon>}
        title={title}
        className={`${textColor} p-2`}
        disabled={disabled}
        onClick={() => navigateTo(navView)}
      />
    </div>
  );
}
