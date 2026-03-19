import { Outlet } from "react-router";
import { Header } from "../components/header";
import { NavigationTabs } from "../components/navigation-tabs";
import { Toaster } from "../components/ui/sonner";
import { OfflineBanner } from "../components/offline-banner";
import { CommandPalette } from "../components/command-palette";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function MainLayout() {
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette: ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }

      // Help: ?
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        // Could show shortcuts modal here
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gray-50/30 dark:bg-gray-950 transition-colors">
      <OfflineBanner />
      <Header />
      <NavigationTabs />
      <Outlet />
      <Toaster />
      
      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <CommandPalette 
              isOpen={showCommandPalette} 
              onClose={() => setShowCommandPalette(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}