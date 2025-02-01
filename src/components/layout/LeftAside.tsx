import { ReactNode } from "react";
import { NavView } from "../../types/view-state";
import Start from "../navigation/Start";

const components: Record<NavView, ReactNode> = {
  none: undefined,
  dashboard: <Start></Start>,
};

interface LeftAsideProps {
  navigation?: NavView;
}

export default function LeftAside({ navigation }: LeftAsideProps) {
  const component = navigation ? components[navigation] : null;
  return <>{component}</>;
}
