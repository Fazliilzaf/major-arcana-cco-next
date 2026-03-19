import { X, Zap, Navigation, MessageSquare, Settings, Command } from "lucide-react";
import { useEffect } from "react";

interface Shortcut {
  key: string;
  description: string;
  category: string;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts: Shortcut[] = [
    // Global
    { key: "⌘K", description: "Öppna Unified Search", category: "Globalt" },
    { key: "?", description: "Visa tangentbordsgenvägar", category: "Globalt" },
    { key: "Esc", description: "Stäng modal/dialog", category: "Globalt" },
    { key: "F", description: "Växla Fokusläge", category: "Globalt" },
    
    // Navigation
    { key: "G then I", description: "Gå till Inkorg", category: "Navigering" },
    { key: "G then W", description: "Gå till Arbetsflöden", category: "Navigering" },
    { key: "G then A", description: "Gå till Analys", category: "Navigering" },
    { key: "G then S", description: "Gå till Inställningar", category: "Navigering" },
    
    // Inbox
    { key: "J / ↓", description: "Nästa meddelande", category: "Inkorg" },
    { key: "K / ↑", description: "Föregående meddelande", category: "Inkorg" },
    { key: "E", description: "Arkivera meddelande", category: "Inkorg" },
    { key: "R", description: "Svara på meddelande", category: "Inkorg" },
    { key: "X", description: "Välj meddelande (multi-select)", category: "Inkorg" },
    { key: "⌘Enter", description: "Skicka svar", category: "Inkorg" },
    { key: "S", description: "Snooze meddelande", category: "Inkorg" },
    { key: "⌘S", description: "Växla Snabbläge", category: "Inkorg" },
    
    // Conversation
    { key: "C", description: "Kopiera föreslagit svar", category: "Konversation" },
    { key: "⌘1/2/3/4", description: "Byt kundpanel-flikar", category: "Konversation" },
    
    // Workflow Builder
    { key: "N", description: "Ny nod", category: "Arbetsflöde" },
    { key: "D", description: "Duplicera nod", category: "Arbetsflöde" },
    { key: "⌫", description: "Ta bort nod", category: "Arbetsflöde" },
    { key: "⌘Z", description: "Ångra", category: "Arbetsflöde" },
    { key: "⌘⇧Z", description: "Gör om", category: "Arbetsflöde" },
    { key: "⌘S", description: "Spara arbetsflöde", category: "Arbetsflöde" },
  ];

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-50 animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden max-h-[80vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Command className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Tangentbordsgenvägar</h2>
                  <p className="text-xs text-gray-600">Bemästra CCO med dessa genvägar</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-2 gap-6">
              {categories.map(category => {
                const categoryShortcuts = shortcuts.filter(s => s.category === category);
                const IconComponent = 
                  category === "Globalt" ? Command :
                  category === "Navigering" ? Navigation :
                  category === "Inkorg" ? MessageSquare :
                  category === "Konversation" ? MessageSquare :
                  category === "Arbetsflöde" ? Settings :
                  Zap;

                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <IconComponent className="w-5 h-5 text-pink-600" />
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        {category}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {categoryShortcuts.map((shortcut, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700 flex-1">{shortcut.description}</span>
                          <kbd className="px-2 py-1 bg-white border-2 border-gray-300 rounded text-xs font-mono font-bold text-gray-900 whitespace-nowrap">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              Tryck <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded font-mono mx-1">?</kbd> 
              när som helst för att visa genvägar · 
              <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded font-mono mx-1">Esc</kbd> 
              för att stänga
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for global keyboard shortcuts
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      // ? - Show shortcuts modal (handled by component)
      // Most other shortcuts are handled in specific components
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}