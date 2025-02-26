import NavigationTabs from "../../common/NavigationTabs";

const apiResponseNavigationItem = {
  Body: "body",
  Headers: "headers",
} as const;
type ApiResponseNavigationItemKeys = keyof typeof apiResponseNavigationItem;
export type ApiResponseNavigationItem =
  (typeof apiResponseNavigationItem)[ApiResponseNavigationItemKeys];

const tabs = Object.entries(apiResponseNavigationItem).map(([label, name]) => ({
  name,
  label,
}));

interface ApiResponseNavigationProps {
  selectedTab: ApiResponseNavigationItem;
  onSelectTab: (tab: ApiResponseNavigationItem) => void;
}

export default function ApiResponseNavigation({
  selectedTab,
  onSelectTab,
}: ApiResponseNavigationProps) {
  return (
    <NavigationTabs
      tabs={tabs}
      selectedItem={selectedTab}
      onSelect={(item) => onSelectTab(item as ApiResponseNavigationItem)}
    ></NavigationTabs>
  );
}
