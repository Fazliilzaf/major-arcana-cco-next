import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/theme-context';
import { motion } from 'motion/react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Ljust' },
    { value: 'dark' as const, icon: Moon, label: 'Mörkt' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.value;

        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
              isActive
                ? 'text-pink-600 dark:text-pink-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title={t.label}
            aria-label={t.label}
          >
            {isActive && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className="h-4 w-4 relative z-10" />
          </button>
        );
      })}
    </div>
  );
}
