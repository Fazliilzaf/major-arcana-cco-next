import { useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface SmartSLABadgeProps {
  minutesLeft: number;
  totalMinutes: number;
  autoExpand?: boolean;
}

export function SmartSLABadge({ minutesLeft, totalMinutes, autoExpand = false }: SmartSLABadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const progress = (minutesLeft / totalMinutes) * 100;
  const status = progress < 25 ? 'breach' : progress < 50 ? 'warning' : 'safe';
  
  // FIXED: Only auto-expand for EXTREME cases (< 5 min or very long breach)
  const shouldAutoExpand = minutesLeft < 5 || autoExpand;
  const showExpanded = isHovered || shouldAutoExpand;

  const statusConfig = {
    safe: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: 'text-green-600',
      bar: 'bg-green-500',
    },
    warning: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      icon: 'text-amber-600',
      bar: 'bg-amber-500',
    },
    breach: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: 'text-red-600',
      bar: 'bg-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* COMPACT VERSION - SAMMA STORLEK SOM INKORG BUBBLOR */}
      <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${config.bg} border border-current cursor-help transition-all`}>
        {status === 'breach' ? (
          <AlertTriangle className={`h-2.5 w-2.5 ${config.icon}`} />
        ) : (
          <Clock className={`h-2.5 w-2.5 ${config.icon}`} />
        )}
        <span className={`text-[10px] font-semibold ${config.text}`}>
          SLA {minutesLeft}m
        </span>
      </div>

      {/* EXPANDED TOOLTIP (on hover or auto-expand) */}
      {showExpanded && (
        <div className="absolute z-50 top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-gray-700">
              SLA Status
            </span>
            <span className={`text-[11px] font-bold ${config.text}`}>
              {minutesLeft}m kvar
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${config.bar} transition-all duration-300`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-0.5 text-[10px] text-gray-600">
            <div className="flex justify-between">
              <span>Total tid:</span>
              <span className="font-medium">{totalMinutes}m</span>
            </div>
            <div className="flex justify-between">
              <span>Använt:</span>
              <span className="font-medium">{totalMinutes - minutesLeft}m</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-semibold ${config.text}`}>
                {status === 'safe' ? 'Säker ✓' : status === 'warning' ? 'Varning ⚠️' : 'Överskriden! 🔴'}
              </span>
            </div>
          </div>

          {/* Alert for breach */}
          {status === 'breach' && (
            <div className="mt-2 pt-2 border-t border-red-200 text-[10px] text-red-800 font-semibold">
              ⚠️ Skynda! SLA håller på att brytas!
            </div>
          )}
        </div>
      )}
    </div>
  );
}