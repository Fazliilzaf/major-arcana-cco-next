import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, DollarSign, MessageSquare, Clock, ArrowRight, Sparkles } from "lucide-react";
import type { ConversationContext } from "./conversation-context-card";
import { toast } from "sonner";

interface CompactContextBarProps {
  context: ConversationContext;
}

export function CompactContextBar({ context }: CompactContextBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Service type styling
  const serviceStyles = {
    "prp": {
      icon: "💧",
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
    },
    "hair-transplant": {
      icon: "✂️",
      color: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-200",
      badge: "bg-purple-100 text-purple-700",
    },
    "consultation": {
      icon: "💬",
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
      badge: "bg-green-100 text-green-700",
    },
    "fue": {
      icon: "⚡",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700",
    },
    "dhi": {
      icon: "🎯",
      color: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
      badge: "bg-rose-100 text-rose-700",
    },
    "other": {
      icon: "💬",
      color: "text-gray-700",
      bg: "bg-gray-50",
      border: "border-gray-200",
      badge: "bg-gray-100 text-gray-700",
    },
  };

  const style = serviceStyles[context.serviceType];

  // Intent labels (short)
  const intentLabels = {
    "booking": "Bokning",
    "question": "Fråga",
    "complaint": "Klagomål",
    "follow-up": "Uppföljning",
    "reschedule": "Omboka",
    "cancellation": "Avbokning",
  };

  return (
    <div className="mb-4 space-y-2">
      {/* ULTRA-CLEAN HEADER - Just customer + urgency */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">{context.serviceName}</h3>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${style.badge}`}>
            {intentLabels[context.intent]}
          </span>
          {context.urgency === "high" && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </div>
      </div>

      {/* PILLS - Clickable status indicators */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => toast.info("Status: " + context.status)}
          className="px-2 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-[10px] font-semibold hover:bg-red-200 transition-colors"
        >
          ⚡ Agera nu
        </button>
        
        <button
          onClick={() => toast.info("Bokningsstatus: Redo att boka nu")}
          className="px-2 py-1 rounded-full bg-green-100 border border-green-300 text-green-800 text-[10px] font-semibold hover:bg-green-200 transition-colors"
        >
          📅 Redo att boka
        </button>

        {context.confirmedDate && (
          <button
            onClick={() => toast.info("Datum: " + context.confirmedDate)}
            className="px-2 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-800 text-[10px] font-semibold hover:bg-blue-200 transition-colors"
          >
            ⏰ {context.confirmedDate}
          </button>
        )}

        <button
          onClick={() => toast.info("Agent: Sara Lindberg")}
          className="px-2 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-[10px] font-semibold hover:bg-purple-200 transition-colors"
        >
          👤 Sara
        </button>
      </div>

      {/* VARFÖR I FOKUS - Kompakt förklaring */}
      <div className="rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-2">
        <div className="flex items-start gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wide mb-0.5">
              ⚡ Varför i fokus
            </p>
            <p className="text-[11px] text-amber-800 leading-tight">
              SLA bruten - kunden behöver svar senast idag 15:15
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}