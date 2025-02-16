import React from "react";

export interface Tab<T extends string> {
  key: T;
  label: string;
}

export interface TabsProps<T extends string> {
  activeTab: T;
  tabs: Tab<T>[];
  onTabChange: (tabKey: T) => void;
}

const Tabs: <T extends string>(props: TabsProps<T>) => React.ReactElement = ({
  activeTab,
  tabs,
  onTabChange,
}) => {
  return (
    <div className="w-full max-w-md">
      <div className="relative right-0">
        <ul
          className="relative flex flex-wrap px-2 py-2 list-none rounded-md bg-slate-200"
          role="list"
        >
          {tabs.map((tab) => (
            <li key={tab.key} className="z-30 flex-auto text-center">
              <a
                className={`z-30 flex items-center justify-center w-full px-4 py-3 text-base mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
                  activeTab === tab.key
                    ? "text-violet-600 bg-white shadow"
                    : "text-slate-600 bg-inherit hover:bg-slate-200"
                }`}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => onTabChange(tab.key)}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tabs;
