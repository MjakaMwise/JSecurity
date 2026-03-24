import { useState } from "react";

interface TabsProps {
  tabs: { title: string; value: string }[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

const AnimatedTabs = ({ tabs, activeTab, onTabChange, className = "" }: TabsProps) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          style={{
            background: activeTab === tab.value ? "#00D4FF" : "#0F2050",
            color: activeTab === tab.value ? "#07122E" : "#B0BED1",
            border: `1px solid ${activeTab === tab.value ? "#00D4FF" : "rgba(0,212,255,0.15)"}`,
          }}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
};

export default AnimatedTabs;
