import { Target, List, Maximize2 } from "lucide-react";
import { toast } from "sonner";

export type DensityMode = "focus" | "work" | "overview";

interface DensityModeSelectorProps {
  mode: DensityMode;
  onChange: (mode: DensityMode) => void;
}

export function DensityModeSelector({ mode, onChange }: DensityModeSelectorProps) {
  const modes: { id: DensityMode; label: string; icon: React.ReactNode; description: string; color: string }[] = [
    { 
      id: "focus", 
      label: "Fokus", 
      icon: <Target className="h-3 w-3" />, 
      description: "Sprint + Kritiskt",
      color: "from-purple-500 to-purple-600"
    },
    { 
      id: "work", 
      label: "Arbete", 
      icon: <List className="h-3 w-3" />, 
      description: "Balanserad",
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "overview", 
      label: "Översikt", 
      icon: <Maximize2 className="h-3 w-3" />, 
      description: "Kompakt",
      color: "from-teal-500 to-teal-600"
    },
  ];

  return (
    <div className="flex gap-1.5">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`group relative overflow-hidden flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[9px] font-bold transition-all ${
            mode === m.id
              ? `bg-gradient-to-r ${m.color} text-white shadow-md`
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          {mode === m.id && (
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          )}
          <span className="relative z-10 flex items-center gap-1">
            {m.icon}
            {m.label}
          </span>
        </button>
      ))}
    </div>
  );
}