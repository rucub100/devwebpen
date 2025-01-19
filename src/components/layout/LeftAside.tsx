import { ReactNode } from "react";
import { NavView } from "../../types/view-state";
import Start from "../navigation/Start";

const components: Record<NavView, ReactNode> = {
  [NavView.None]: undefined,
  [NavView.Dashboard]: <Start></Start>,
};

interface LeftAsideProps {
  navigation?: NavView;
}

export default function LeftAside({ navigation }: LeftAsideProps) {
  const component = navigation ? components[navigation] : null;
  return <>{component}</>;
}
