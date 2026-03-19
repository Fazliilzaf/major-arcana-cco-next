import { Maximize2, Minimize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/language-context';

export function useFocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Keyboard shortcut: F or Escape
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        // Don't trigger if typing in input/textarea
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        
        e.preventDefault();
        setIsFocusMode(prev => !prev);
      }
      
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFocusMode]);

  return { isFocusMode, setIsFocusMode };
}

export function FocusModeToggle({ 
  isFocusMode, 
  onToggle 
}: { 
  isFocusMode: boolean;
  onToggle: () => void;
}) {
  const { t } = useLanguage();
  
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-xs font-semibold"
      title={`${isFocusMode ? t('focus.exitFocus') : t('focus.mode')} (${t('shortcuts.focusSearch')} F)`}
    >
      {isFocusMode ? (
        <>
          <Minimize2 className="h-3.5 w-3.5" />
          <span>{t('focus.exitFocus')}</span>
          <kbd className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Esc</kbd>
        </>
      ) : (
        <>
          <Maximize2 className="h-3.5 w-3.5" />
          <span>{t('focus.mode')}</span>
          <kbd className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">F</kbd>
        </>
      )}
    </button>
  );
}

// Focus mode indicator banner
export function FocusModeBanner() {
  const { t } = useLanguage();
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="text-sm font-semibold">{t('focus.active')}</span>
        <span className="text-xs opacity-90">{t('focus.hiddenSidebars')}</span>
      </div>
      <div className="flex items-center gap-2 text-xs opacity-90">
        <kbd className="px-2 py-1 bg-white/20 rounded font-mono">F</kbd>
        <span>{t('focus.pressToExit')}</span>
        <kbd className="px-2 py-1 bg-white/20 rounded font-mono">Esc</kbd>
        <span>{t('focus.toExit')}</span>
      </div>
    </div>
  );
}