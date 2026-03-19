import { Download, X } from 'lucide-react';
import { useState } from 'react';
import { usePWA } from '../hooks/use-pwa';
import { motion, AnimatePresence } from 'motion/react';

export function InstallPrompt() {
  const { isInstallable, install } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) return null;

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setIsDismissed(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Installera HairTP Clinic
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Få snabbare åtkomst och arbeta offline genom att installera appen
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="px-3 py-1.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xs font-semibold rounded-md hover:from-pink-600 hover:to-rose-600 transition-all"
                >
                  Installera
                </button>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="px-3 py-1.5 text-gray-600 dark:text-gray-400 text-xs font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Inte nu
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Stäng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
