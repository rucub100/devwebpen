import { ReactNode } from "react";

import { useViewState } from "../../hooks/useViewState";
import { BottomView } from "../../types/view-state";
import PanelHeader from "../common/PanelHeader";
import ProxyTraffic from "../bottom/ProxyTraffic";

const viewComponents: Record<BottomView, () => ReactNode> = {
  none: () => <></>,
  proxyTraffic: () => <ProxyTraffic></ProxyTraffic>,
};

interface BottomPanelProps {
  view?: BottomView;
}

export default function BottomPanel({ view }: BottomPanelProps) {
  const { closeBottom } = useViewState();

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <PanelHeader onClose={closeBottom}></PanelHeader>
      {view && viewComponents[view]()}
    </div>
  );
}
