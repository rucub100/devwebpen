import NavigationTabs from "../../common/NavigationTabs";

const apiRequestNavigationItem = {
  Params: "params",
  Headers: "headers",
  Body: "body",
} as const;
type ApiRequestNavigationItemKeys = keyof typeof apiRequestNavigationItem;
export type ApiRequestNavigationItem =
  (typeof apiRequestNavigationItem)[ApiRequestNavigationItemKeys];

const tabs = Object.entries(apiRequestNavigationItem).map(([label, name]) => ({
  name,
  label,
}));

interface ApiRequestNavigationProps {
  selectedTab: ApiRequestNavigationItem;
  onSelectTab: (tab: ApiRequestNavigationItem) => void;
}

export default function ApiRequestNavigation({
  selectedTab,
  onSelectTab,
}: ApiRequestNavigationProps) {
  return (
    <NavigationTabs
      tabs={tabs}
      selectedItem={selectedTab}
      onSelect={(item) => onSelectTab(item as ApiRequestNavigationItem)}
    ></NavigationTabs>
  );
}
