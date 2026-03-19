import { useState } from "react";
import { 
  ChevronDown, ChevronRight, Calendar, DollarSign, MessageSquare, Clock, 
  ArrowRight, CheckCircle2, AlertCircle, Bell, BellOff, Flag, RotateCcw,
  Sparkles, User, MapPin, FileText
} from "lucide-react";
import { toast } from "sonner";

export interface BookingContext {
  serviceType: "prp" | "hair-transplant" | "consultation" | "fue" | "dhi";
  serviceName: string;
  status: "confirmed" | "pending" | "proposed" | "requires-action";
  confirmedDate?: string;
  proposedDates?: string[];
  price?: number;
  messageCount: number;
  lastActivity: string;
  specialRequests?: string[];
  nextAction: string;
  urgency: "low" | "medium" | "high";
}

interface CompactBookingCardProps {
  context: BookingContext;
}

export function CompactBookingCard({ context }: CompactBookingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Status indicators
  const statusConfig = {
    confirmed: { icon: CheckCircle2, label: "Bekräftad", color: "text-green-600 bg-green-50 border-green-200" },
    pending: { icon: Clock, label: "Väntar", color: "text-amber-600 bg-amber-50 border-amber-200" },
    proposed: { icon: AlertCircle, label: "Föreslagen", color: "text-blue-600 bg-blue-50 border-blue-200" },
    "requires-action": { icon: AlertCircle, label: "Kräver åtgärd", color: "text-red-600 bg-red-50 border-red-200" }
  };

  const StatusIcon = statusConfig[context.status].icon;

  const handleConfirmBooking = () => {
    toast.success("Bokning bekräftad!");
  };

  const handleSnooze = () => {
    toast.success("Påminnelse inställd för senare");
  };

  const handleMarkFollowUp = () => {
    toast.success("Markerad för uppföljning");
  };

  const handleRemindIfNoReply = () => {
    toast.success("Påminnelse aktiverad om inget svar skickas");
  };

  // Collapsed: Ultra-compact single line
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full mb-2 px-2 py-1 rounded-lg border border-pink-200 bg-gradient-to-r from-pink-50/80 to-rose-50/60 hover:from-pink-50 hover:to-rose-50 transition-all group"
      >
        <div className="flex items-center gap-1.5 text-left">
          <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-pink-600 transition-colors flex-shrink-0" />
          
          <span className="text-[12px] font-semibold text-gray-900">
            {context.serviceName}
          </span>
          
          <span className="text-[12px] text-gray-400">·</span>
          
          <span className="text-[12px] text-gray-700">
            {context.status === "confirmed" && context.confirmedDate 
              ? `Bekräftad bokning för ${context.confirmedDate}`
              : context.status === "proposed" && context.proposedDates?.[0]
              ? `Föreslagen ${context.proposedDates[0]}`
              : "Väntar på bekräftelse"
            }
          </span>

          {context.urgency === "high" && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          )}
        </div>
      </button>
    );
  }

  // Expanded: ULTRA-COMPACT horizontal layout - MAX INFO DENSITY!
  return (
    <div className="mb-2 rounded-lg border-2 border-pink-200 bg-gradient-to-br from-pink-50/80 to-rose-50/60 shadow-md overflow-hidden">
      {/* Header Row - SUPER COMPACT - NO AI BADGE */}
      <div className="px-2 py-1 bg-white/50 border-b border-pink-100 flex items-center gap-1.5">
        <button
          onClick={() => setIsExpanded(false)}
          className="p-0.5 rounded hover:bg-pink-100 transition-colors"
        >
          <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
        </button>
        
        <span className="text-[12px] font-bold text-gray-900">{context.serviceName}</span>
        
        <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${statusConfig[context.status].color}`}>
          <StatusIcon className="h-2.5 w-2.5" />
          {statusConfig[context.status].label}
        </div>

        {context.urgency === "high" && (
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-100 border border-red-300 text-[9px] font-semibold text-red-700">
            <Bell className="h-2.5 w-2.5" />
            Hög prio
          </div>
        )}
      </div>

      {/* Content: EXTREME HORIZONTAL DENSITY - Everything on 2 rows max! */}
      <div className="px-2 py-1.5">
        {/* Row 1: Key Metadata - ALL ON ONE LINE */}
        <div className="flex items-center gap-3 mb-1.5 text-[10px]">
          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-pink-600 flex-shrink-0" />
            <span className="font-semibold text-gray-900">
              {context.confirmedDate || context.proposedDates?.[0] || "—"}
            </span>
          </div>
          
          <span className="text-gray-300">|</span>
          
          {/* Price */}
          {context.price && (
            <>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-gray-900">
                  {context.price.toLocaleString("sv-SE")} kr
                </span>
              </div>
              <span className="text-gray-300">|</span>
            </>
          )}
          
          {/* Messages */}
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-gray-700">{context.messageCount} msg</span>
          </div>
          
          <span className="text-gray-300">|</span>
          
          {/* Activity */}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{context.lastActivity}</span>
          </div>

          {/* Special Requests Indicator */}
          {context.specialRequests && context.specialRequests.length > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                <FileText className="h-2.5 w-2.5 text-amber-600" />
                <span className="font-medium text-amber-900">{context.specialRequests.length} önskemål</span>
              </div>
            </>
          )}
        </div>

        {/* Row 2: Next Action + Smart Actions - ALL ON ONE LINE */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Next Action - Inline */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-pink-100/50 border border-pink-200">
            <ArrowRight className="h-3 w-3 text-pink-700 flex-shrink-0" />
            <span className="text-[10px] font-semibold text-pink-900">{context.nextAction}</span>
          </div>

          <span className="text-gray-300 text-[10px]">→</span>

          {/* Smart Actions - Inline with Next Action */}
          {context.status !== "confirmed" && (
            <button
              onClick={handleConfirmBooking}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-green-600 text-white text-[10px] font-semibold hover:bg-green-700 transition-all"
            >
              <CheckCircle2 className="h-3 w-3" />
              Bekräfta
            </button>
          )}
          
          <button
            onClick={handleSnooze}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-gray-300 text-gray-700 text-[10px] font-semibold hover:bg-gray-50 transition-all"
          >
            <BellOff className="h-3 w-3" />
            Snooze
          </button>

          <button
            onClick={handleMarkFollowUp}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-gray-300 text-gray-700 text-[10px] font-semibold hover:bg-gray-50 transition-all"
          >
            <Flag className="h-3 w-3" />
            Uppföljning
          </button>

          <button
            onClick={handleRemindIfNoReply}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-gray-300 text-gray-700 text-[10px] font-semibold hover:bg-gray-50 transition-all"
          >
            <RotateCcw className="h-3 w-3" />
            Påminn
          </button>
        </div>

        {/* Special Requests Details - Collapsible */}
        {context.specialRequests && context.specialRequests.length > 0 && (
          <details className="mt-1.5 group/details">
            <summary className="cursor-pointer text-[9px] font-semibold text-gray-500 uppercase hover:text-gray-700 flex items-center gap-1">
              Visa önskemål ({context.specialRequests.length})
              <ChevronDown className="h-2.5 w-2.5 group-open/details:rotate-180 transition-transform" />
            </summary>
            <ul className="mt-1 space-y-0.5 pl-3">
              {context.specialRequests.map((req, idx) => (
                <li key={idx} className="text-[10px] text-gray-700 flex items-start gap-1">
                  <span className="text-pink-600">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}

// Mock generator
export function generateMockBookingContext(): BookingContext {
  return {
    serviceType: "prp",
    serviceName: "PRP-behandling",
    status: "confirmed",
    confirmedDate: "Fredag 09:00",
    price: 3500,
    messageCount: 8,
    lastActivity: "För 2 min sedan",
    specialRequests: ["Föredrar kvinnlig behandlare", "Allergi mot latex"],
    nextAction: "Skicka bekräftelse och förberedelseinstruktioner",
    urgency: "medium"
  };
}