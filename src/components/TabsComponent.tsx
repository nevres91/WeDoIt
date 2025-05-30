import { useState } from "react";

type TabId = string;
export interface Tab {
  id: TabId;
  label: string | JSX.Element;
  color?: string;
  fullLabel?: string;
}
export interface TabContent {
  [key: string]: JSX.Element;
}

export function TabsComponent({
  tabs,
  tabContent,
  defaultTab,
  onTabChange,
  isSmallScreen,
}: {
  tabs: Tab[];
  tabContent: TabContent;
  defaultTab: TabId;
  onTabChange?: (tabId: string) => void;
  isSmallScreen?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId); // Call the callback when tab changes
    }
  };

  // Get the color of the active tab
  const activeTabColor =
    tabs.find((tab) => tab.id === activeTab)?.color || "gray-500";

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap h-[40px] p-0 lg:pl-10 ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-semibold transition-all ease-in-out duration-200 ${
              activeTab === tab.id
                ? `text-calm-n-cool-5 bg-${tab.color} bg-opacity-50 rounded-t-xl`
                : `text-gray-500 hover:text-calm-n-cool-5`
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {isSmallScreen && activeTab === tab.id && tab.fullLabel ? (
              <>
                {tab.label} {/* Icon */}
                <span>{tab.fullLabel}</span> {/* Label */}
              </>
            ) : (
              tab.label /* Default rendering (icon on mobile, icon+label on desktop) */
            )}
          </button>
        ))}
      </div>
      <div
        className={`bg-${activeTabColor} transition-all ease-in-out duration-200 bg-opacity-50 pt-2 p-0 md:p-4 md:pb-0 lg:p-8 lg:pb-0 mx-0 lg:mx-10 shadow-xl space-y-5 h-[calc(100vh-106px)] rounded-sm md:max-h-[calc(100vh-141px)] lg:max-h-[calc(100vh-137px)]`}
      >
        <div className="overflow-auto h-full max-h-[100%] scrollbar-transparent scroll-smooth">
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
