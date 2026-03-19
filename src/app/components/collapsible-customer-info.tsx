import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, User, FileText, Star } from "lucide-react";

interface CollapsibleCustomerInfoProps {
  previousBookings: number;
  lastBooking: string;
  customerSince: string;
  isVIP?: boolean;
}

export function CollapsibleCustomerInfo({ 
  previousBookings, 
  lastBooking, 
  customerSince,
  isVIP = false 
}: CollapsibleCustomerInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 overflow-hidden">
      {/* COLLAPSED (default) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-[12px] font-semibold text-gray-700">
            Kundinfo
          </span>
          {isVIP && (
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        )}
      </button>

      {/* EXPANDED */}
      {isExpanded && (
        <div className="px-3 pb-2 border-t border-gray-200 pt-2 bg-white/50">
          <div className="space-y-1.5">
            {/* Previous Bookings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText className="h-3 w-3 text-gray-500" />
                <span className="text-[11px] text-gray-600">Tidigare bokningar:</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-900">{previousBookings}</span>
            </div>

            {/* Last Booking */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-[11px] text-gray-600">Senaste behandling:</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-900">{lastBooking}</span>
            </div>

            {/* Customer Since */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3 text-gray-500" />
                <span className="text-[11px] text-gray-600">Kund sedan:</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-900">{customerSince}</span>
            </div>

            {/* VIP Badge */}
            {isVIP && (
              <div className="mt-2 pt-2 border-t border-amber-200">
                <div className="flex items-center justify-center gap-1.5 px-2 py-1 rounded-md bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300">
                  <Star className="h-3 w-3 text-amber-700 fill-amber-700" />
                  <span className="text-[11px] font-bold text-amber-900">VIP-Kund</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
