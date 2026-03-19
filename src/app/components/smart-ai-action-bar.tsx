import { Sparkles, Edit3, Zap } from "lucide-react";

interface SmartAIActionBarProps {
  recommendation: string;
  confidence: number;
  onWriteWithAI: () => void;
  onWriteManually: () => void;
  onQuickSend?: () => void;
}

export function SmartAIActionBar({ 
  recommendation, 
  confidence, 
  onWriteWithAI, 
  onWriteManually,
  onQuickSend 
}: SmartAIActionBarProps) {
  
  // Color based on confidence
  const getConfidenceColor = () => {
    if (confidence >= 85) return {
      bg: "from-green-50 to-emerald-50",
      border: "border-green-300",
      text: "text-green-900",
      badge: "from-green-500 to-emerald-500",
      icon: "text-green-600"
    };
    if (confidence >= 70) return {
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-300",
      text: "text-blue-900",
      badge: "from-blue-500 to-indigo-500",
      icon: "text-blue-600"
    };
    return {
      bg: "from-amber-50 to-yellow-50",
      border: "border-amber-300",
      text: "text-amber-900",
      badge: "from-amber-500 to-yellow-500",
      icon: "text-amber-600"
    };
  };

  const colors = getConfidenceColor();

  return (
    <div className={`rounded-lg border-2 ${colors.border} bg-gradient-to-r ${colors.bg} p-3 shadow-sm`}>
      <div className="flex items-center gap-3">
        {/* AI Icon & Text */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Sparkles className={`h-4 w-4 ${colors.icon} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className={`text-xs font-bold ${colors.text}`}>🤖 AI rekommenderar:</p>
              <span className={`rounded-full bg-gradient-to-r ${colors.badge} px-2 py-0.5 text-[10px] font-bold text-white shadow-sm`}>
                {confidence}%
              </span>
            </div>
            <p className={`text-[11px] font-medium ${colors.text} truncate`}>
              {recommendation}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onWriteWithAI}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[11px] font-bold hover:from-pink-700 hover:to-rose-700 transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Skriv svar med AI
          </button>
          
          <button
            onClick={onWriteManually}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 text-[11px] font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Skriv själv
          </button>

          {onQuickSend && confidence >= 90 && (
            <button
              onClick={onQuickSend}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[11px] font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm"
              title="Skicka AI-genererat svar direkt (hög säkerhet)"
            >
              <Zap className="h-3.5 w-3.5" />
              Skicka nu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
