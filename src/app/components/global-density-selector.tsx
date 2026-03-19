import { Maximize, Minus, Minimize } from "lucide-react";
import { useDensity, GlobalDensity } from "../context/density-context";
import { useLanguage } from "../context/language-context";

export function GlobalDensitySelector() {
  const { density, setDensity } = useDensity();
  const { t } = useLanguage();

  const densityOptions: { value: GlobalDensity; icon: any; label: string; desc: string }[] = [
    { 
      value: "compact", 
      icon: Minimize, 
      label: t("density.compact") || "Compact",
      desc: t("density.compactDesc") || "More visible, less space"
    },
    { 
      value: "comfortable", 
      icon: Minus, 
      label: t("density.comfortable") || "Comfortable",
      desc: t("density.comfortableDesc") || "Balanced (default)"
    },
    { 
      value: "spacious", 
      icon: Maximize, 
      label: t("density.spacious") || "Spacious",
      desc: t("density.spaciousDesc") || "More space, easier reading"
    },
  ];

  return (
    <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg p-1">
      {densityOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setDensity(option.value)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            density === option.value
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          title={option.desc}
        >
          <option.icon className="h-3.5 w-3.5" />
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

// Compact version for toolbars
export function DensityToggle() {
  const { density, setDensity } = useDensity();

  const cycle = () => {
    const order: GlobalDensity[] = ["compact", "comfortable", "spacious"];
    const current = order.indexOf(density);
    const next = (current + 1) % order.length;
    setDensity(order[next]);
  };

  const Icon = density === "compact" ? Minimize : density === "spacious" ? Maximize : Minus;

  return (
    <button
      onClick={cycle}
      className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-xs font-semibold"
      title={`Density: ${density} (click to cycle)`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="capitalize">{density}</span>
    </button>
  );
}
