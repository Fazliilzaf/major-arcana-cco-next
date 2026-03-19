import { FileText, Sparkles, MessageSquare, User, Calendar, DollarSign, AlertCircle, Clock, TrendingUp, Zap, Brain, FileCheck, Target } from "lucide-react";
import { useState } from "react";

interface SmartNotesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: "manual" | "ai-summary" | "ai-extract" | "ai-action-items") => void;
  customerName: string;
  context: string;
}

export function SmartNotesMenu({ isOpen, onClose, onSelectMode, customerName, context }: SmartNotesMenuProps) {
  if (!isOpen) return null;

  const menuOptions = [
    {
      id: "ai-summary" as const,
      icon: Brain,
      label: "Sammanfatta konversation",
      description: "Låt systemet analysera och sammanfatta hela konversationen",
      color: "from-purple-500 to-violet-600",
      iconBg: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
      badge: "Smart",
    },
    {
      id: "ai-extract" as const,
      icon: Zap,
      label: "Extrahera viktiga detaljer",
      description: "Hitta automatiskt datum, tider, preferenser och problem",
      color: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100 dark:bg-amber-900",
      iconColor: "text-amber-600 dark:text-amber-400",
      badge: "Smart",
    },
    {
      id: "ai-action-items" as const,
      icon: Target,
      label: "Identifiera åtgärder",
      description: "Hitta uppgifter och åtgärder som behöver göras",
      color: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-100 dark:bg-rose-900",
      iconColor: "text-rose-600 dark:text-rose-400",
      badge: "Smart",
    },
    {
      id: "manual" as const,
      icon: FileText,
      label: "Skapa manuell anteckning",
      description: "Skriv din egen anteckning från grunden",
      color: "from-gray-500 to-gray-600",
      iconBg: "bg-gray-100 dark:bg-gray-800",
      iconColor: "text-gray-600 dark:text-gray-400",
      badge: null,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-w-md w-full pointer-events-auto animate-scale-in">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">
                  Smart Anteckningsassistent
                </h3>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">
                  Välj hur du vill anteckna för {customerName}
                </p>
              </div>
            </div>
          </div>

          {/* Context Preview */}
          <div className="px-5 py-3 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wide mb-0.5">
                  Aktuell kontext
                </p>
                <p className="text-[10px] text-blue-800 dark:text-blue-200 leading-snug">
                  {context}
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
            {menuOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelectMode(option.id);
                  onClose();
                }}
                className="w-full flex items-start gap-3 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-rose-50/50 dark:hover:from-pink-950/20 dark:hover:to-rose-950/20 transition-all group"
              >
                <div className={`p-2 rounded-lg ${option.iconBg} flex-shrink-0`}>
                  <option.icon className={`h-4 w-4 ${option.iconColor}`} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-[11px] font-bold text-gray-900 dark:text-gray-100">
                      {option.label}
                    </h4>
                    {option.badge && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white text-[7px] font-bold uppercase tracking-wide">
                        <Sparkles className="h-2 w-2" />
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-gray-600 dark:text-gray-400 leading-snug">
                    {option.description}
                  </p>
                </div>
                <div className="flex-shrink-0 mt-1">
                  <div className="text-pink-500 dark:text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-[8px] text-gray-600 dark:text-gray-400 leading-tight">
                  💡 <span className="font-semibold">Tips:</span> Smarta förslag baseras på konversationshistorik och kunddata
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
