import NavigationTabs from "../../common/NavigationTabs";

const apiRequestNavigationItem = {
  Headers: "headers",
  Params: "params",
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
