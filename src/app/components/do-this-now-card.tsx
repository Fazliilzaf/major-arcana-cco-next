import { Target, Calendar, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface DoThisNowCardProps {
  action: string;
  description: string;
  urgentReason: string;
  onQuickAction?: () => void;
  actionButtonText?: string;
}

export function DoThisNowCard({ 
  action, 
  description, 
  urgentReason, 
  onQuickAction,
  actionButtonText = "Snabbåtgärd"
}: DoThisNowCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-sm">
      {/* Header - Alltid synlig */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-amber-100/30 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-amber-700" />
          <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            🎯 GÖR DETTA NU ★★★
          </h5>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-amber-700" />
        ) : (
          <ChevronDown className="h-4 w-4 text-amber-700" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Action */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1">
              {action}
            </p>
            <p className="text-[11px] text-gray-700">
              {description}
            </p>
          </div>

          {/* Quick Action Button (om tillgänglig) */}
          {onQuickAction && (
            <button
              onClick={onQuickAction}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[11px] font-bold hover:from-pink-700 hover:to-rose-700 transition-all shadow-sm"
            >
              <Calendar className="h-3.5 w-3.5" />
              {actionButtonText}
            </button>
          )}

          {/* Urgent Reason */}
          <div className="rounded-lg bg-white/60 border border-amber-300 p-2.5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wide mb-0.5">
                  ⚠️ Varför i fokus
                </p>
                <p className="text-[11px] text-amber-800 leading-tight">
                  {urgentReason}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}