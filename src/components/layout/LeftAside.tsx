import { ReactNode } from "react";
import { NavView } from "../../types/view-state";
import NavStart from "../navigation/NavStart";
import NavProxy from "../navigation/NavProxy";

const components: Record<NavView, ReactNode> = {
  none: undefined,
  dashboard: <NavStart></NavStart>,
  proxy: <NavProxy></NavProxy>,
};

interface LeftAsideProps {
  navigation?: NavView;
}

export default function LeftAside({ navigation }: LeftAsideProps) {
  const component = navigation ? components[navigation] : null;
  return <>{component}</>;
}
