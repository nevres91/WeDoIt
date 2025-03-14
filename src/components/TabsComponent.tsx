import { useState } from "react";

type TabId = string;
export interface Tab {
  id: TabId;
  label: string;
  color?: string;
}
export interface TabContent {
  [key: string]: JSX.Element;
}

export function TabsComponent({
  tabs,
  tabContent,
  defaultTab,
  onTabChange,
}: {
  tabs: Tab[];
  tabContent: TabContent;
  defaultTab: TabId;
  onTabChange?: (tabId: string) => void;
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
            className={`px-4 py-2 font-semibold ${
              activeTab === tab.id
                ? `text-calm-n-cool-5 bg-${tab.color} bg-opacity-40 rounded-t-xl`
                : `text-gray-500`
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className={`bg-${activeTabColor} bg-opacity-40 p-0 lg:p-8 lg:pb-0 mx-0 lg:mx-10 shadow-xl space-y-5 h-[calc(100vh-125px)] md:max-h-[calc(100vh-141px)] lg:max-h-[calc(100vh-137px)] bg-red-200`}
      >
        <div className="overflow-auto h-full max-h-[100%] scrollbar-transparent">
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
