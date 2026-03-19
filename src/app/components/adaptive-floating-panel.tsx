import { AlertTriangle, Zap, Edit3, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AdaptiveFloatingPanelProps {
  isVisible: boolean;
  urgency: "critical" | "high" | "medium";
  minutesLeft: number;
  recommendation: string;
  onQuickSend: () => void;
  onCustomize: () => void;
  onDismiss: () => void;
}

export function AdaptiveFloatingPanel({
  isVisible,
  urgency,
  minutesLeft,
  recommendation,
  onQuickSend,
  onCustomize,
  onDismiss
}: AdaptiveFloatingPanelProps) {
  
  const getUrgencyStyle = () => {
    if (urgency === "critical") return {
      bg: "from-red-500 to-rose-600",
      border: "border-red-400",
      text: "text-red-50",
      icon: "text-red-100",
      pulse: true
    };
    if (urgency === "high") return {
      bg: "from-orange-500 to-amber-600",
      border: "border-orange-400",
      text: "text-orange-50",
      icon: "text-orange-100",
      pulse: true
    };
    return {
      bg: "from-amber-500 to-yellow-600",
      border: "border-amber-400",
      text: "text-amber-50",
      icon: "text-amber-100",
      pulse: false
    };
  };

  const style = getUrgencyStyle();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        >
          <div className={`rounded-2xl border-2 ${style.border} bg-gradient-to-r ${style.bg} p-4 shadow-2xl ${style.pulse ? 'animate-pulse' : ''}`}>
            {/* Close button */}
            <button
              onClick={onDismiss}
              className="absolute top-3 right-3 rounded-full p-1 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className={`rounded-full bg-white/20 p-2.5 ${style.pulse ? 'animate-pulse' : ''}`}>
                  {urgency === "critical" ? (
                    <AlertTriangle className="h-6 w-6 text-white" />
                  ) : (
                    <Zap className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    {urgency === "critical" ? "⚡ AKUT" : urgency === "high" ? "🔥 Brådskande" : "⚠️ Viktigt"}
                  </h4>
                  <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-bold text-white">
                    {minutesLeft} min kvar
                  </span>
                </div>
                
                <p className="text-[13px] font-semibold text-white mb-1">
                  SLA går ut om {minutesLeft} minuter!
                </p>
                
                <p className={`text-[11px] ${style.text} mb-3`}>
                  🤖 AI har förberett {recommendation}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={onQuickSend}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-gray-900 text-[11px] font-bold hover:bg-gray-100 transition-all shadow-lg"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Skicka nu (AI)
                  </button>
                  
                  <button
                    onClick={onCustomize}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[11px] font-semibold hover:bg-white/30 transition-all"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Anpassa först
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
