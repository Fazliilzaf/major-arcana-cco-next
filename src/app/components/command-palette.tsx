import { useState, useEffect, useMemo } from 'react';
import { Search, Mail, Calendar, Users, Tag, Clock, FileText, Settings, Zap, Star, Archive, Send, X, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon: any;
  category: 'navigation' | 'actions' | 'filters' | 'templates' | 'settings';
  keywords: string[];
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMessage?: (id: string) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectMessage }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const commands: CommandItem[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-inbox',
      label: 'Gå till Inkorg',
      shortcut: '⌘1',
      icon: Mail,
      category: 'navigation',
      keywords: ['inbox', 'inkorg', 'home', 'messages', 'meddelanden'],
      action: () => { navigate('/'); onClose(); }
    },
    {
      id: 'nav-later',
      label: 'Gå till Senare',
      shortcut: '⌘2',
      icon: Clock,
      category: 'navigation',
      keywords: ['later', 'senare', 'snoozed', 'scheduled'],
      action: () => { navigate('/later'); onClose(); }
    },
    {
      id: 'nav-sent',
      label: 'Gå till Skickade',
      shortcut: '⌘3',
      icon: Send,
      category: 'navigation',
      keywords: ['sent', 'skickade', 'outbox'],
      action: () => { navigate('/sent'); onClose(); }
    },
    {
      id: 'nav-customers',
      label: 'Gå till Kunder',
      shortcut: '⌘4',
      icon: Users,
      category: 'navigation',
      keywords: ['customers', 'kunder', 'contacts', 'people'],
      action: () => { navigate('/customers'); onClose(); }
    },

    // Quick Actions
    {
      id: 'action-reply',
      label: 'Svara på meddelande',
      shortcut: 'R',
      icon: Mail,
      category: 'actions',
      keywords: ['reply', 'svara', 'respond', 'answer'],
      action: () => { toast.success('Öppnar svar...'); onClose(); }
    },
    {
      id: 'action-assign',
      label: 'Tilldela konversation',
      shortcut: 'A',
      icon: Users,
      category: 'actions',
      keywords: ['assign', 'tilldela', 'delegate', 'transfer'],
      action: () => { toast.info('Tilldela till...'); onClose(); }
    },
    {
      id: 'action-snooze',
      label: 'Snooze konversation',
      shortcut: 'S',
      icon: Clock,
      category: 'actions',
      keywords: ['snooze', 'later', 'remind', 'senare'],
      action: () => { toast.info('Snooze till...'); onClose(); }
    },
    {
      id: 'action-done',
      label: 'Markera som klar',
      shortcut: 'D',
      icon: Archive,
      category: 'actions',
      keywords: ['done', 'klar', 'complete', 'archive', 'close'],
      action: () => { toast.success('✓ Markerad som klar'); onClose(); }
    },
    {
      id: 'action-tag',
      label: 'Lägg till tagg',
      shortcut: 'T',
      icon: Tag,
      category: 'actions',
      keywords: ['tag', 'tagg', 'label', 'categorize'],
      action: () => { toast.info('Lägg till tagg...'); onClose(); }
    },
    {
      id: 'action-vip',
      label: 'Växla VIP-status',
      shortcut: 'V',
      icon: Star,
      category: 'actions',
      keywords: ['vip', 'important', 'priority', 'star'],
      action: () => { toast.success('⭐ VIP-status växlad'); onClose(); }
    },

    // Filters
    {
      id: 'filter-unread',
      label: 'Visa endast olästa',
      icon: Mail,
      category: 'filters',
      keywords: ['unread', 'olästa', 'new', 'filter'],
      action: () => { toast.info('Filtrerar: Endast olästa'); onClose(); }
    },
    {
      id: 'filter-vip',
      label: 'Visa VIP-kunder',
      icon: Star,
      category: 'filters',
      keywords: ['vip', 'important', 'premium'],
      action: () => { toast.info('Filtrerar: VIP-kunder'); onClose(); }
    },
    {
      id: 'filter-high-value',
      label: 'Högvärdiga leads (LTV > 50k)',
      icon: Zap,
      category: 'filters',
      keywords: ['high value', 'ltv', 'revenue', 'leads', 'högvärdig'],
      action: () => { toast.info('Filtrerar: Högvärdiga leads'); onClose(); }
    },

    // Templates
    {
      id: 'template-booking',
      label: 'Mall: Bokningsbekräftelse',
      icon: FileText,
      category: 'templates',
      keywords: ['template', 'mall', 'booking', 'confirmation', 'bokningsbekräftelse'],
      action: () => { toast.success('📋 Mall infogad'); onClose(); }
    },
    {
      id: 'template-pricing',
      label: 'Mall: Prissättning',
      icon: FileText,
      category: 'templates',
      keywords: ['template', 'mall', 'pricing', 'price', 'prissättning'],
      action: () => { toast.success('📋 Mall infogad'); onClose(); }
    },

    // Settings
    {
      id: 'settings-shortcuts',
      label: 'Visa tangentbordsgenvägar',
      shortcut: '?',
      icon: Settings,
      category: 'settings',
      keywords: ['shortcuts', 'genvägar', 'hotkeys', 'help'],
      action: () => { toast.info('Visar genvägar...'); onClose(); }
    },
  ], [navigate, onClose]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    
    const query = search.toLowerCase();
    return commands.filter(cmd => 
      cmd.label.toLowerCase().includes(query) ||
      cmd.keywords.some(kw => kw.includes(query)) ||
      cmd.category.toLowerCase().includes(query)
    );
  }, [search, commands]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      navigation: [],
      actions: [],
      filters: [],
      templates: [],
      settings: []
    };

    filteredCommands.forEach(cmd => {
      groups[cmd.category].push(cmd);
    });

    return groups;
  }, [filteredCommands]);

  const categoryLabels: Record<string, string> = {
    navigation: 'Navigation',
    actions: 'Snabbåtgärder',
    filters: 'Filter',
    templates: 'Mallar',
    settings: 'Inställningar'
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Arrow key navigation could be added here
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-4 duration-300">
        {/* Search Input - KOMPAKT */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök kommandon, meddelanden, mallar..."
            className="flex-1 text-[10px] bg-transparent outline-none placeholder:text-gray-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-0.5 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>

        {/* Results - KOMPAKT */}
        <div className="max-h-[50vh] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-[10px] text-gray-500">Inga resultat hittades</p>
              <p className="text-[8px] text-gray-400 mt-0.5">Försök med andra sökord</p>
            </div>
          ) : (
            <div className="py-1.5">
              {Object.entries(groupedCommands).map(([category, items]) => {
                if (items.length === 0) return null;

                return (
                  <div key={category} className="mb-2 last:mb-0">
                    <div className="px-3 py-1">
                      <h3 className="text-[8px] font-bold text-gray-500 uppercase tracking-wide">
                        {categoryLabels[category]}
                      </h3>
                    </div>
                    <div>
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={item.action}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all group"
                        >
                          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <item.icon className="h-3 w-3 text-gray-600 group-hover:text-pink-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-[10px] font-medium text-gray-900">{item.label}</p>
                          </div>
                          {item.shortcut && (
                            <div className="flex items-center gap-1">
                              <kbd className="px-1.5 py-0.5 text-[8px] font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded shadow-sm">
                                {item.shortcut}
                              </kbd>
                            </div>
                          )}
                          <ChevronRight className="h-3 w-3 text-gray-300 group-hover:text-pink-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - KOMPAKT */}
        <div className="border-t border-gray-200 px-3 py-1.5 bg-gray-50 flex items-center justify-between">
          <p className="text-[8px] text-gray-500">
            Tryck <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-[7px]">ESC</kbd> för att stänga
          </p>
          <p className="text-[8px] text-gray-400">
            {filteredCommands.length} resultat
          </p>
        </div>
      </div>
    </div>
  );
}
