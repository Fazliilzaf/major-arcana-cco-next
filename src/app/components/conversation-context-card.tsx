import { useState } from "react";
import { 
  Sparkles, Calendar, DollarSign, AlertCircle, CheckCircle, Clock, 
  ChevronDown, ChevronUp, TrendingUp, User, MapPin, Phone, Mail,
  Scissors, Droplet, Zap, MessageSquare, Target, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

export interface ConversationContext {
  // AI-extracted information
  serviceType: "prp" | "hair-transplant" | "consultation" | "fue" | "dhi" | "other";
  serviceName: string;
  intent: "booking" | "question" | "complaint" | "follow-up" | "reschedule" | "cancellation";
  status: "awaiting-confirmation" | "needs-response" | "confirmed" | "completed" | "pending-info";
  
  // Key extracted data
  proposedDates?: string[];
  confirmedDate?: string;
  mentionedPrice?: number;
  budget?: { min: number; max: number };
  
  // Action items
  nextAction: string;
  urgency: "high" | "medium" | "low";
  
  // Metadata
  conversationAge: string; // "2 dagar sedan"
  messageCount: number;
  lastCustomerMessage: string; // relative time
  
  // Optional details
  specialRequests?: string[];
  medicalNotes?: string[];
  previousTreatments?: string[];
}

interface ConversationContextCardProps {
  context: ConversationContext;
}

export function ConversationContextCard({ context }: ConversationContextCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Service type styling
  const serviceStyles = {
    "prp": {
      icon: Droplet,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-900",
      badge: "bg-blue-100 text-blue-700",
    },
    "hair-transplant": {
      icon: Scissors,
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-900",
      badge: "bg-purple-100 text-purple-700",
    },
    "consultation": {
      icon: MessageSquare,
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-900",
      badge: "bg-green-100 text-green-700",
    },
    "fue": {
      icon: Zap,
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
      badge: "bg-amber-100 text-amber-700",
    },
    "dhi": {
      icon: Target,
      gradient: "from-rose-500 to-red-500",
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-900",
      badge: "bg-rose-100 text-rose-700",
    },
    "other": {
      icon: MessageSquare,
      gradient: "from-gray-500 to-slate-500",
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-900",
      badge: "bg-gray-100 text-gray-700",
    },
  };

  const style = serviceStyles[context.serviceType];
  const ServiceIcon = style.icon;

  // Intent labels
  const intentLabels = {
    "booking": "Bokning",
    "question": "Fråga",
    "complaint": "Klagomål",
    "follow-up": "Uppföljning",
    "reschedule": "Omboka",
    "cancellation": "Avbokning",
  };

  // Status labels & colors
  const statusConfig = {
    "awaiting-confirmation": {
      label: "Väntar på bekräftelse",
      color: "bg-amber-100 text-amber-800 border-amber-300",
      icon: Clock,
    },
    "needs-response": {
      label: "Behöver svar",
      color: "bg-red-100 text-red-800 border-red-300",
      icon: AlertCircle,
    },
    "confirmed": {
      label: "Bekräftad",
      color: "bg-green-100 text-green-800 border-green-300",
      icon: CheckCircle,
    },
    "completed": {
      label: "Klar",
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: CheckCircle,
    },
    "pending-info": {
      label: "Väntar på info",
      color: "bg-purple-100 text-purple-800 border-purple-300",
      icon: AlertCircle,
    },
  };

  const statusInfo = statusConfig[context.status];
  const StatusIcon = statusInfo.icon;

  // COLLAPSED MODE: Ultra-compact single line with max info density
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`w-full mb-2 px-2.5 py-1.5 rounded-lg border-2 ${style.border} ${style.bg} hover:shadow-sm transition-all group flex items-center gap-2`}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
          <ServiceIcon className="h-3 w-3 text-white" />
        </div>

        {/* Service name */}
        <span className={`text-[12px] font-bold ${style.text}`}>{context.serviceName}</span>
        
        {/* Badge */}
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${style.badge}`}>
          {intentLabels[context.intent]}
        </span>

        {/* Urgency indicator (if high) */}
        {context.urgency === "high" && (
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        )}

        {/* Expand chevron */}
        <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-auto flex-shrink-0" />
      </button>
    );
  }

  // EXPANDED MODE: ULTRA-COMPACT HORIZONTAL LAYOUT - MAXIMUM INFO DENSITY!
  return (
    <div className={`mb-2 rounded-lg border-2 ${style.border} ${style.bg} shadow-sm overflow-hidden`}>
      {/* RAD 1: Allt horisontellt på EN rad */}
      <div className="px-2.5 py-2 flex items-center gap-2 text-[10px] flex-wrap">
        {/* Icon + Service + Badge */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
            <ServiceIcon className="h-3 w-3 text-white" />
          </div>
          <span className={`text-[12px] font-bold ${style.text}`}>{context.serviceName}</span>
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${style.badge}`}>
            {intentLabels[context.intent]}
          </span>
        </div>

        {/* Next Action */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <ArrowRight className="h-3 w-3 text-pink-700" />
          <span className="text-[11px] font-bold text-pink-900">
            {context.nextAction}
          </span>
          {context.urgency === "high" && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-1" />
          )}
        </div>

        {/* Datum */}
        {(context.confirmedDate || context.proposedDates?.[0]) && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Calendar className="h-3 w-3 text-pink-600" />
            <span className="font-bold text-gray-900 text-[11px]">
              {context.confirmedDate || context.proposedDates?.[0]}
            </span>
          </div>
        )}

        {/* Pris */}
        {context.mentionedPrice && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="font-bold text-gray-900 text-[11px]">
              {context.mentionedPrice.toLocaleString("sv-SE")} kr
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <MessageSquare className="h-3 w-3 text-blue-600" />
          <span className="font-medium text-gray-700 text-[10px]">{context.messageCount} meddelanden</span>
        </div>

        {/* Tid */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <Clock className="h-3 w-3 text-gray-500" />
          <span className="font-medium text-gray-700 text-[10px] whitespace-nowrap">{context.lastCustomerMessage}</span>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold flex-shrink-0 ${statusInfo.color}`}>
          {statusInfo.label}
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setIsExpanded(false)}
          className="flex-shrink-0 p-0.5 rounded hover:bg-white/50 transition-colors ml-auto"
        >
          <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>

      {/* RAD 2: Särskilda önskemål + knappar (endast om det finns önskemål) */}
      {(context.specialRequests && context.specialRequests.length > 0) && (
        <div className="px-2.5 py-1.5 bg-white/30 border-t border-gray-200 flex items-center gap-2">
          {/* Önskemål - horisontella badges */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wide flex-shrink-0">Särskilda önskemål:</span>
            <div className="flex flex-wrap gap-1 text-[10px]">
              {context.specialRequests.map((req, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-medium border border-amber-300 whitespace-nowrap">
                  • {req}
                </span>
              ))}
            </div>
          </div>

          {/* Knappar */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => toast.success("Öppnar bokningsformulär...")}
              className="flex items-center gap-1 px-2 py-1 rounded bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm"
            >
              <Calendar className="h-3 w-3" />
              Boka
            </button>

            <button
              onClick={() => toast.info("Visar alla detaljer...")}
              className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-gray-300 text-gray-700 text-[10px] font-semibold hover:bg-gray-50 transition-all"
            >
              Fler detaljer
            </button>
          </div>
        </div>
      )}

      {/* Medicinska noter varning (om det finns) */}
      {context.medicalNotes && context.medicalNotes.length > 0 && (
        <div className="px-2.5 py-1.5 bg-red-50 border-t border-red-200 flex items-center gap-1.5">
          <AlertCircle className="h-3 w-3 text-red-600 flex-shrink-0" />
          <span className="text-[10px] font-bold text-red-800">
            {context.medicalNotes.length} medicinska {context.medicalNotes.length === 1 ? 'notering' : 'noteringar'} - granska före bokning
          </span>
        </div>
      )}
    </div>
  );
}

// Mock data generator for testing
export function generateMockContext(conversationType: "booking" | "question" | "complaint" = "booking"): ConversationContext {
  if (conversationType === "booking") {
    return {
      serviceType: "prp",
      serviceName: "PRP-behandling",
      intent: "booking",
      status: "awaiting-confirmation",
      proposedDates: ["Fredag 09:00", "Måndag 15:30"],
      confirmedDate: "Fredag 09:00",
      mentionedPrice: 8500,
      nextAction: "Bekräfta bokning för fredag 09:00",
      urgency: "high",
      conversationAge: "2 dagar sedan",
      messageCount: 3,
      lastCustomerMessage: "Idag 10:58",
      specialRequests: ["Föredrar morgontider", "Vill ha SMS-påminnelse"],
      previousTreatments: ["PRP (2025-01-14)", "Konsultation (2024-12-10)"],
    };
  } else if (conversationType === "question") {
    return {
      serviceType: "hair-transplant",
      serviceName: "Hair Transplant (FUE)",
      intent: "question",
      status: "needs-response",
      budget: { min: 30000, max: 50000 },
      nextAction: "Svara på frågor om FUE-metoden och pricing",
      urgency: "medium",
      conversationAge: "1 dag sedan",
      messageCount: 5,
      lastCustomerMessage: "Igår 14:30",
      specialRequests: ["Vill ha före/efter-bilder", "Frågar om finansiering"],
    };
  } else {
    return {
      serviceType: "consultation",
      serviceName: "Uppföljning - Konsultation",
      intent: "follow-up",
      status: "pending-info",
      nextAction: "Boka uppföljning inom 2 veckor",
      urgency: "low",
      conversationAge: "3 dagar sedan",
      messageCount: 2,
      lastCustomerMessage: "3 dagar sedan",
      previousTreatments: ["Konsultation (2025-02-10)"],
    };
  }
}