import { useViewState } from "../../hooks/useViewState";
import PanelHeader from "../common/PanelHeader";

export default function Aside() {
  const { closeAside } = useViewState();
  return (
    <div className="p-1">
      <PanelHeader onClose={closeAside}></PanelHeader>
    </div>
  );
}
