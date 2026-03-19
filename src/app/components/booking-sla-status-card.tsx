import { ClipboardList, User, CheckCircle, Clock, Flame } from "lucide-react";

interface BookingSLAStatusCardProps {
  agent: string;
  status: string;
  slaMinutesLeft: number;
  priority: "low" | "medium" | "high" | "critical";
}

export function BookingSLAStatusCard({ 
  agent, 
  status, 
  slaMinutesLeft, 
  priority 
}: BookingSLAStatusCardProps) {
  
  // Priority styling
  const getPriorityStyle = () => {
    if (priority === "critical") return {
      bg: "from-red-50 to-rose-50",
      border: "border-red-300",
      text: "text-red-700",
      badge: "bg-red-100 text-red-700 border-red-300"
    };
    if (priority === "high") return {
      bg: "from-orange-50 to-amber-50",
      border: "border-orange-300",
      text: "text-orange-700",
      badge: "bg-orange-100 text-orange-700 border-orange-300"
    };
    if (priority === "medium") return {
      bg: "from-yellow-50 to-amber-50",
      border: "border-yellow-300",
      text: "text-yellow-700",
      badge: "bg-yellow-100 text-yellow-700 border-yellow-300"
    };
    return {
      bg: "from-gray-50 to-slate-50",
      border: "border-gray-300",
      text: "text-gray-700",
      badge: "bg-gray-100 text-gray-700 border-gray-300"
    };
  };

  const priorityLabels = {
    critical: "KRITISK",
    high: "HÖG",
    medium: "MEDEL",
    low: "LÅG"
  };

  const style = getPriorityStyle();

  return (
    <div className={`rounded-lg bg-gradient-to-br ${style.bg} border-2 ${style.border} p-3 shadow-sm`}>
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className={`h-4 w-4 ${style.text}`} />
        <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
          📋 Boknings & SLA Status
        </h5>
      </div>

      <div className="space-y-2.5">
        {/* Agent */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-gray-600" />
            <span className="text-[11px] text-gray-600">Agent:</span>
          </div>
          <span className="text-[11px] font-bold text-gray-900">{agent}</span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-green-600" />
            <span className="text-[11px] text-gray-600">Status:</span>
          </div>
          <span className="text-[11px] font-bold text-green-700">{status}</span>
        </div>

        {/* SLA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[11px] text-gray-600">SLA:</span>
          </div>
          <span className={`text-[11px] font-bold ${slaMinutesLeft <= 15 ? 'text-red-700 animate-pulse' : 'text-blue-700'}`}>
            {slaMinutesLeft} min kvar {slaMinutesLeft <= 15 && '⚡'}
          </span>
        </div>

        {/* Priority */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={`h-3.5 w-3.5 ${style.text}`} />
            <span className="text-[11px] text-gray-600">Prioritet:</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${style.badge}`}>
            {priorityLabels[priority]}
          </span>
        </div>
      </div>
    </div>
  );
}
