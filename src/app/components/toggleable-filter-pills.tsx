import { ChevronDown, ChevronUp } from "lucide-react";

interface Filter {
  id: string;
  label: string;
  count: number;
  color?: "red" | "blue" | "amber" | "purple" | "green";
  priority?: number;
}

interface ToggleableFilterPillsProps {
  activeFilters: string[];
  onToggleFilter: (filterId: string) => void;
  expandedFilters: string[];
  onToggleExpand: (filterId: string) => void;
}

export function ToggleableFilterPills({
  activeFilters,
  onToggleFilter,
  expandedFilters,
  onToggleExpand,
}: ToggleableFilterPillsProps) {

  const filters: Filter[] = [
    { id: "all", label: "Alla trådar", count: 7, priority: 1 },
    { id: "sprint", label: "Sprint", count: 3, color: "green", priority: 1 },
    { id: "act-now", label: "Agera nu", count: 2, color: "red", priority: 1 },
    { id: "bookable", label: "Bokningsåkara", count: 1, color: "blue", priority: 2 },
    { id: "today", label: "Idag", count: 5, color: "amber", priority: 2 },
    { id: "tomorrow", label: "Imorgon", count: 1, color: "amber", priority: 2 },
    { id: "high-risk", label: "Hög risk", count: 2, color: "red", priority: 2 },
    { id: "unassigned", label: "Oågda", count: 1, color: "purple", priority: 2 },
    { id: "medical", label: "Medicinsk granskning", count: 1, color: "purple", priority: 3 },
    { id: "admin", label: "Admin", count: 1, priority: 3 },
  ];

  const getColorClasses = (color?: string, isActive?: boolean) => {
    if (isActive) {
      return "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-600 dark:border-pink-400 shadow-sm";
    }
    
    switch (color) {
      case "red":
        return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900";
      case "blue":
        return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900";
      case "amber":
        return "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-900";
      case "purple":
        return "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900";
      case "green":
        return "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-900";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700";
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Hair TP Clinic Badge - Always first, not toggleable */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border border-gray-900 dark:border-gray-100">
          Hair TP Clinic - contact
        </span>

        {/* Toggleable Filter Badges */}
        {filters.map((filter) => {
          const isActive = activeFilters.includes(filter.id);
          const isExpanded = expandedFilters.includes(filter.id);
          
          return (
            <button
              key={filter.id}
              onClick={() => onToggleFilter(filter.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all ${getColorClasses(
                filter.color,
                isActive
              )}`}
            >
              <span>
                {filter.label} {filter.count}
              </span>
              {isActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(filter.id);
                  }}
                  className="ml-0.5"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-2.5 w-2.5" />
                  ) : (
                    <ChevronDown className="h-2.5 w-2.5" />
                  )}
                </button>
              )}
            </button>
          );
        })}

        {/* Status info */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] text-gray-600 dark:text-gray-400 ml-auto">
          1 oågda · 2 hög risk · vecka 2026-04-22 17:18
        </span>
      </div>
    </div>
  );
}