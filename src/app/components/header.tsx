import { useState, useEffect } from "react";
import { Zap, Bell, Globe, Search, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useLanguage } from "../context/language-context";
import { toast } from "sonner";
import { useUnifiedSearch, UnifiedSearch } from "./unified-search";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sprintMode, setSprintMode] = useState(true);
  const [sprintCount, setSprintCount] = useState(3);
  const { language, setLanguage, t } = useLanguage();
  const unifiedSearch = useUnifiedSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Söker efter: ${searchQuery}`);
    } else {
      unifiedSearch.open();
    }
  };

  const handleLanguageChange = () => {
    const newLang = language === "sv" ? "en" : "sv";
    setLanguage(newLang);
    toast.success(newLang === "sv" ? "Språk: Svenska" : "Language: English");
  };

  const handleNotifications = () => {
    toast.info("Notifikationer öppnas...");
  };

  const handleProfile = () => {
    toast.info("Profil öppnas...");
  };

  const toggleSprintMode = () => {
    setSprintMode(!sprintMode);
    toast.success(sprintMode ? t("header.sprintModeOff") : t("header.sprintModeOn"));
  };

  return (
    <header className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-1.5 transition-colors">
      <div className="flex items-center gap-3">
        {/* CCO Logo - Längst till vänster */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {/* CCO Logo - KOMPAKT: Text-baserad */}
            <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              CCO
            </div>
          </div>
          
          {/* Search Bar - KOMPAKT: 280px bred */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder={t("header.search") + " (⌘K)"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[280px] rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 py-1 pl-8 pr-3 text-[11px] text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-300 dark:focus:border-gray-600 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-colors"
            />
          </form>
        </div>

        {/* Right Side Actions - ULTRA KOMPAKT */}
        <div className="ml-auto flex items-center gap-1.5">
          {/* Snabbläge Indicator - MINI */}
          <button
            onClick={toggleSprintMode}
            className={`group relative overflow-hidden rounded-full px-2 py-0.5 text-[9px] font-bold transition-all ${
              sprintMode 
                ? "bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-sm" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span className="relative z-10 flex items-center gap-1">
              <Zap className="h-2.5 w-2.5" />
              Sprint {sprintMode && sprintCount}
            </span>
          </button>

          {/* Action buttons - MINI: p-1, h-3 */}
          <div className="flex items-center gap-0.5">
            {/* Theme Toggle - Dark Mode */}
            <ThemeToggle />
            
            <button 
              onClick={handleLanguageChange}
              className="rounded-md p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              title="Byt språk"
              aria-label="Byt språk"
            >
              <Globe className="h-3 w-3" />
            </button>
          </div>

          {/* Notifications - MINI */}
          <button 
            onClick={handleNotifications}
            className="relative rounded-md p-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Notifikationer"
          >
            <Bell className="h-3 w-3 text-gray-600 dark:text-gray-400" />
            <span className="absolute right-0 top-0 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-red-500">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            </span>
          </button>

          {/* Profile - MINI: 24px */}
          <button 
            onClick={handleProfile}
            className="h-6 w-6 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 hover:ring-2 hover:ring-pink-500/20 transition-all"
            title="Profil"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="Profil"
              className="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Unified Search (⌘K) */}
      <UnifiedSearch isOpen={unifiedSearch.isOpen} onClose={unifiedSearch.close} />
    </header>
  );
}