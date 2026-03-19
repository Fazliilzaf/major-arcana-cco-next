import { useState, useRef, useEffect } from "react";
import { Wand2, RotateCw, Settings } from "lucide-react";
import { toast } from "sonner";

interface DiscreteAIBadgeProps {
  onRegenerate: () => void;
  context?: {
    service: string;
    customer: string;
    basedOn: string[];
  };
}

export function DiscreteAIBadge({ onRegenerate, context }: DiscreteAIBadgeProps) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    }

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPopover]);

  const defaultContext = {
    service: "PRP-behandling",
    customer: "Johan (VIP)",
    basedOn: [
      "Tjänst: PRP-behandling",
      "Kundhistorik: VIP-kund",
      "Bekräftat: Fredag 09:00",
      "Senaste meddelandet"
    ]
  };

  const ctx = context || defaultContext;

  return (
    <div className="relative">
      {/* COMPACT AI ICON */}
      <button
        ref={buttonRef}
        onClick={() => setShowPopover(!showPopover)}
        className="group relative flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm"
        title="AI-genererat svar"
      >
        <Wand2 className="h-3.5 w-3.5 text-white" />
        
        {/* Quick tooltip on hover (if not showing popover) */}
        {!showPopover && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AI-genererat
          </div>
        )}
      </button>

      {/* POPOVER */}
      {showPopover && (
        <div
          ref={popoverRef}
          className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-500">
                <Wand2 className="h-3 w-3 text-white" />
              </div>
              <span className="text-[12px] font-bold text-gray-900">AI-GENERERAT SVAR</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-3 py-2.5">
            <div className="mb-2">
              <div className="text-[10px] font-bold text-gray-700 mb-1">Baserat på:</div>
              <div className="space-y-0.5">
                {ctx.basedOn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[10px] text-gray-600">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="text-[10px] text-gray-600 mb-1">
                <span className="font-semibold">Ton:</span> Vänlig & Professionell
              </div>
              <div className="text-[10px] text-gray-600">
                <span className="font-semibold">Språk:</span> Svenska
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-3 pb-2.5 space-y-1.5">
            <button
              onClick={() => {
                onRegenerate();
                setShowPopover(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[11px] font-bold hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              <RotateCw className="h-3 w-3" />
              Regenerera svar
            </button>
            <button
              onClick={() => {
                toast.info("AI-inställningar");
                setShowPopover(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold hover:bg-gray-200 transition-all"
            >
              <Settings className="h-3 w-3" />
              Ändra inställningar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
