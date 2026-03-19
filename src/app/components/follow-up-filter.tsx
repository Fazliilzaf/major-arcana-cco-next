import { useState } from "react";
import { Inbox, BellOff, Flag, AlertCircle, CheckCircle2 } from "lucide-react";

export type FollowUpFilterType = "all" | "unanswered" | "follow-up" | "forgotten" | "snoozed";

interface FollowUpFilterProps {
  activeFilter: FollowUpFilterType;
  onFilterChange: (filter: FollowUpFilterType) => void;
  counts?: {
    all: number;
    unanswered: number;
    followUp: number;
    forgotten: number;
    snoozed: number;
  };
}

export function FollowUpFilter({ activeFilter, onFilterChange, counts }: FollowUpFilterProps) {
  const filters = [
    { 
      id: "all" as FollowUpFilterType, 
      label: "Alla", 
      icon: Inbox,
      color: "text-gray-700",
      activeColor: "bg-gray-900 text-white",
      count: counts?.all
    },
    { 
      id: "unanswered" as FollowUpFilterType, 
      label: "Obesvarade", 
      icon: AlertCircle,
      color: "text-red-600",
      activeColor: "bg-red-600 text-white",
      count: counts?.unanswered
    },
    { 
      id: "follow-up" as FollowUpFilterType, 
      label: "Uppföljning", 
      icon: Flag,
      color: "text-blue-600",
      activeColor: "bg-blue-600 text-white",
      count: counts?.followUp
    },
    { 
      id: "forgotten" as FollowUpFilterType, 
      label: "Glömda", 
      icon: AlertCircle,
      color: "text-orange-600",
      activeColor: "bg-orange-600 text-white",
      count: counts?.forgotten
    },
    { 
      id: "snoozed" as FollowUpFilterType, 
      label: "Snoozade", 
      icon: BellOff,
      color: "text-purple-600",
      activeColor: "bg-purple-600 text-white",
      count: counts?.snoozed
    },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        const showCount = filter.count !== undefined && filter.count > 0;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              isActive
                ? `${filter.activeColor} shadow-sm`
                : `bg-white border border-gray-200 ${filter.color} hover:bg-gray-50`
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{filter.label}</span>
            {showCount && (
              <span className={`flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] font-bold ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {filter.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
