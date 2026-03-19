import { Search, Command, User, MessageSquare, Zap, BarChart3, Settings, Archive, Clock, X, ArrowRight, Star, Mail, Calendar, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/language-context";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  type: "customer" | "conversation" | "command" | "navigation" | "action" | "help";
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
  category?: string;
}

export function UnifiedSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Mock data - i produktion från API
  const allResults: SearchResult[] = [
    // Customers
    {
      id: "c1",
      type: "customer",
      title: "Johan Lagerström",
      subtitle: "johan@example.com · Lead · 85% conversion",
      icon: User,
      action: () => toast.success("Öppnar Johan Lagerström"),
      category: "Customers",
    },
    {
      id: "c2",
      type: "customer",
      title: "Maria Andersson",
      subtitle: "maria@example.com · VIP · 12,750 kr LTV",
      icon: Star,
      action: () => toast.success("Öppnar Maria Andersson"),
      category: "Customers",
    },
    
    // Conversations
    {
      id: "conv1",
      type: "conversation",
      title: "Bokning av tid",
      subtitle: "Johan Lagerström · 19:22 · Unread",
      icon: MessageSquare,
      action: () => toast.success("Öppnar konversation"),
      category: "Conversations",
    },
    {
      id: "conv2",
      type: "conversation",
      title: "Fråga om priser",
      subtitle: "Maria Andersson · 14:30 · Sprint",
      icon: MessageSquare,
      action: () => toast.success("Öppnar konversation"),
      category: "Conversations",
    },
    
    // Commands
    {
      id: "cmd1",
      type: "command",
      title: "Aktivera Snabbläge",
      subtitle: "Focus on max 3 threads",
      icon: Zap,
      action: () => toast.success("Snabbläge aktiverat!"),
      category: "Commands",
    },
    {
      id: "cmd2",
      type: "command",
      title: "Toggle Focus Mode",
      subtitle: "Hide sidebars for distraction-free work",
      icon: Sparkles,
      action: () => toast.success("Focus Mode toggled"),
      category: "Commands",
    },
    
    // Navigation
    {
      id: "nav1",
      type: "navigation",
      title: "Gå till Analytics",
      subtitle: "View statistics and reports",
      icon: BarChart3,
      action: () => toast.success("Navigerar till Analytics"),
      category: "Navigation",
    },
    {
      id: "nav2",
      type: "navigation",
      title: "Gå till Workflows",
      subtitle: "Build automation workflows",
      icon: Settings,
      action: () => toast.success("Navigerar till Workflows"),
      category: "Navigation",
    },
    {
      id: "nav3",
      type: "navigation",
      title: "Gå till Arkiv",
      subtitle: "Browse archived conversations",
      icon: Archive,
      action: () => toast.success("Navigerar till Arkiv"),
      category: "Navigation",
    },
    
    // Actions
    {
      id: "act1",
      type: "action",
      title: "Arkivera vald konversation",
      subtitle: "Move to archive",
      icon: Archive,
      action: () => toast.success("Arkiverad!"),
      category: "Actions",
    },
    {
      id: "act2",
      type: "action",
      title: "Snooze till imorgon",
      subtitle: "Remind me tomorrow at 9:00",
      icon: Clock,
      action: () => toast.success("Snoozad till imorgon 09:00"),
      category: "Actions",
    },
    {
      id: "act3",
      type: "action",
      title: "Markera som VIP",
      subtitle: "Flag customer as VIP",
      icon: Star,
      action: () => toast.success("Markerad som VIP!"),
      category: "Actions",
    },
    
    // Help
    {
      id: "help1",
      type: "help",
      title: "Hur använder jag SLA-hantering?",
      subtitle: "Learn about SLA timers and warnings",
      icon: Command,
      action: () => toast.info("Öppnar hjälp för SLA"),
      category: "Help",
    },
  ];

  // Fuzzy search
  const filteredResults = query.trim() === "" 
    ? allResults 
    : allResults.filter(result => {
        const searchText = `${result.title} ${result.subtitle || ""}`.toLowerCase();
        const queryLower = query.toLowerCase();
        return searchText.includes(queryLower);
      });

  const categories = ["all", ...Array.from(new Set(allResults.map(r => r.category || "")))];
  
  const displayResults = activeCategory === "all" 
    ? filteredResults 
    : filteredResults.filter(r => r.category === activeCategory);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % displayResults.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + displayResults.length) % displayResults.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (displayResults[selectedIndex]) {
          displayResults[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, displayResults, selectedIndex, onClose]);

  // Auto-focus input
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setActiveCategory("all");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 animate-in slide-in-from-top-4 duration-200">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers, conversations, commands..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
            />
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600">⌘K</kbd>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {displayResults.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No results found for "{query}"</p>
                <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
              </div>
            ) : (
              displayResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => {
                    result.action();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 transition-all ${
                    index === selectedIndex
                      ? "bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-l-pink-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    result.type === "customer" ? "bg-blue-100" :
                    result.type === "conversation" ? "bg-purple-100" :
                    result.type === "command" ? "bg-green-100" :
                    result.type === "navigation" ? "bg-orange-100" :
                    result.type === "action" ? "bg-pink-100" :
                    "bg-gray-100"
                  }`}>
                    <result.icon className={`h-5 w-5 ${
                      result.type === "customer" ? "text-blue-600" :
                      result.type === "conversation" ? "text-purple-600" :
                      result.type === "command" ? "text-green-600" :
                      result.type === "navigation" ? "text-orange-600" :
                      result.type === "action" ? "text-pink-600" :
                      "text-gray-600"
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-gray-900">{result.title}</div>
                    {result.subtitle && (
                      <div className="text-xs text-gray-600">{result.subtitle}</div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300 font-mono">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300 font-mono">Enter</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300 font-mono">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
            <div className="text-gray-500">
              {displayResults.length} results
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for opening search with ⌘K
export function useUnifiedSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}
