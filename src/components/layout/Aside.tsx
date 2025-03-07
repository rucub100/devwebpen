import PanelHeader from "../common/PanelHeader";

export default function Aside() {
  return (
    <div className="p-1">
      <PanelHeader onClose={() => console.log("TODO")}></PanelHeader>
    </div>
  );
}
