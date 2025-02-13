export type NavigationTabItem = {
  name: string;
  label: string;
};

interface NavigationTabsProps {
  tabs: NavigationTabItem[];
  selectedItem: string;
  onSelect: (item: string) => void;
}

export default function NavigationTabs({
  tabs,
  selectedItem,
  onSelect,
}: NavigationTabsProps) {
  return (
    <div className="flex flex-row items-center w-full">
      {tabs.map((tab) => (
        <div
          key={tab.name}
          className={`p-2 cursor-pointer hover:bg-neutral-800 ${
            tab.name === selectedItem ? "bg-neutral-800" : ""
          }`}
          onClick={() => onSelect(tab.name)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}
