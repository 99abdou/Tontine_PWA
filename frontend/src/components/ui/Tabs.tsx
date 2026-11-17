import React from 'react';
import clsx from 'clsx';

interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div className={clsx('flex overflow-x-auto no-scrollbar border-b border-gray-100 gap-2 sm:gap-6', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 py-3 px-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-150',
              isActive
                ? 'border-primary-700 text-primary-800'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
            )}
          >
            {tab.icon && <span className="text-current">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'text-xs px-2 py-0.5 rounded-full font-bold',
                  isActive ? 'bg-primary-100 text-primary-900' : 'bg-gray-100 text-gray-600'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
