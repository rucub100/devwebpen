import { useViewState } from "../../hooks/useViewState";
import PanelHeader from "../common/PanelHeader";

export default function BottomPanel() {
  const { closeBottom } = useViewState();

  return (
    <div className="p-1">
      <PanelHeader onClose={closeBottom}></PanelHeader>
    </div>
  );
}
