import { ReactNode } from "react";
import { Navigation } from "../../types/view-state";
import Start from "../navigation/Start";

const components: Record<Navigation, ReactNode> = {
  [Navigation.Dashboard]: <Start></Start>,
};

interface LeftAsideProps {
  navigation?: Navigation;
}

export default function LeftAside({ navigation }: LeftAsideProps) {
  const component = navigation ? components[navigation] : null;
  return <>{component}</>;
}
