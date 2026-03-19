import { Clock, Calendar, Bell, Repeat, Zap, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SnoozeOption {
  id: string;
  label: string;
  description: string;
  icon: any;
  duration?: string;
  type: 'quick' | 'smart' | 'custom' | 'recurring';
}

interface SnoozeModalProps {
  conversationId: string;
  customerName: string;
  onClose: () => void;
  onSnooze: (option: SnoozeOption, customDate?: Date) => void;
}

const QUICK_OPTIONS: SnoozeOption[] = [
  {
    id: '2h',
    label: '2 timmar',
    description: 'Tillbaka i inkorgen kl 16:30',
    icon: Clock,
    duration: '2h',
    type: 'quick',
  },
  {
    id: 'tomorrow',
    label: 'Imorgon',
    description: 'Imorgon kl 09:00',
    icon: Calendar,
    duration: '1d',
    type: 'quick',
  },
  {
    id: 'next-week',
    label: 'Nästa vecka',
    description: 'Måndag kl 09:00',
    icon: Calendar,
    duration: '7d',
    type: 'quick',
  },
];

const SMART_OPTIONS: SnoozeOption[] = [
  {
    id: 'until-reply',
    label: 'Tills kund svarar',
    description: 'Avsnoozes automatiskt när de svarar',
    icon: Bell,
    type: 'smart',
  },
  {
    id: 'until-payment',
    label: 'Tills betalning mottas',
    description: 'Stripe webhook triggar avsnooze',
    icon: CheckCircle,
    type: 'smart',
  },
  {
    id: 'before-appointment',
    label: 'Tills 2 dagar före möte',
    description: 'Baserat på kalendersynk',
    icon: Calendar,
    type: 'smart',
  },
];

export function SnoozeModal({ conversationId, customerName, onClose, onSnooze }: SnoozeModalProps) {
  const [selectedTab, setSelectedTab] = useState<'quick' | 'smart' | 'custom' | 'recurring'>('quick');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('09:00');
  const [recurringPattern, setRecurringPattern] = useState('weekly');

  const handleSnooze = (option: SnoozeOption) => {
    if (option.type === 'custom') {
      if (!customDate) {
        toast.error('Välj ett datum');
        return;
      }
      const date = new Date(`${customDate}T${customTime}`);
      onSnooze(option, date);
      toast.success(`Snoozad till ${date.toLocaleString('sv-SE')}`);
    } else {
      onSnooze(option);
      toast.success(`Snoozad: ${option.label}`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300">
        {/* Header - KOMPAKT */}
        <div className="border-b border-gray-200 px-3 py-2.5">
          <h2 className="text-[12px] font-bold text-gray-900">Snooze Konversation</h2>
          <p className="text-[9px] text-gray-600 mt-0.5">
            {customerName} • Dölj tillfälligt från inkorg
          </p>
        </div>

        {/* Tabs - KOMPAKT */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-1">
          {[
            { id: 'quick' as const, label: 'Snabbt', icon: Zap },
            { id: 'smart' as const, label: 'Smart', icon: Bell },
            { id: 'custom' as const, label: 'Anpassat', icon: Calendar },
            { id: 'recurring' as const, label: 'Återkommande', icon: Repeat },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-1 px-2 py-2 text-[9px] font-semibold transition-all ${
                selectedTab === tab.id
                  ? 'text-pink-700 border-b-2 border-pink-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content - KOMPAKT */}
        <div className="p-3 max-h-80 overflow-y-auto">
          {selectedTab === 'quick' && (
            <div className="space-y-1.5">
              {QUICK_OPTIONS.map(option => (
                <SnoozeOptionButton
                  key={option.id}
                  option={option}
                  onClick={() => handleSnooze(option)}
                />
              ))}
            </div>
          )}

          {selectedTab === 'smart' && (
            <div>
              <div className="space-y-1.5">
                {SMART_OPTIONS.map(option => (
                  <SnoozeOptionButton
                    key={option.id}
                    option={option}
                    onClick={() => handleSnooze(option)}
                  />
                ))}
              </div>
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-[8px] text-blue-800">
                  💡 <strong>Smart snooze</strong> integreras med Stripe, Calendly och andra appar 
                  för att automatiskt avsnooze baserat på händelser
                </p>
              </div>
            </div>
          )}

          {selectedTab === 'custom' && (
            <div className="space-y-2">
              <div>
                <label className="block text-[9px] font-semibold text-gray-900 mb-1">Datum</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-[9px] focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-gray-900 mb-1">Tid</label>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-[9px] focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-[8px] text-amber-800">
                  ⚠️ Snooze kan inte bryta SLA-åtaganden. Om SLA löper ut före snooze-tiden, 
                  återgår konversationen till inkorgen.
                </p>
              </div>
              <button
                onClick={() => handleSnooze({ id: 'custom', label: 'Anpassat', description: '', icon: Calendar, type: 'custom' })}
                className="w-full px-2.5 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-md font-semibold hover:from-pink-700 hover:to-rose-700 transition-all text-[9px]"
              >
                Snooze Till {customDate} kl {customTime}
              </button>
            </div>
          )}

          {selectedTab === 'recurring' && (
            <div className="space-y-2">
              <div>
                <label className="block text-[9px] font-semibold text-gray-900 mb-1">Återkommande Mönster</label>
                <select
                  value={recurringPattern}
                  onChange={(e) => setRecurringPattern(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-[9px] focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="daily">Varje dag kl 09:00</option>
                  <option value="weekly">Varje måndag kl 09:00</option>
                  <option value="biweekly">Varannan måndag</option>
                  <option value="monthly">Första måndagen i månaden</option>
                </select>
              </div>
              <div className="p-2 bg-purple-50 border border-purple-200 rounded-md">
                <p className="text-[8px] text-purple-800">
                  🔄 <strong>Återkommande snooze</strong> kommer att fortsätta ta tillbaka denna konversation 
                  tills du manuellt stänger den
                </p>
              </div>
              <button
                onClick={() => {
                  toast.success(`Inställd att återkomma ${recurringPattern}`);
                  onClose();
                }}
                className="w-full px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md font-semibold hover:from-purple-700 hover:to-pink-700 transition-all text-[9px]"
              >
                Sätt Återkommande Snooze
              </button>
            </div>
          )}
        </div>

        {/* Footer - KOMPAKT */}
        <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-[9px] text-gray-600 font-semibold hover:text-gray-900 transition-colors"
          >
            Avbryt
          </button>
          <div className="text-[8px] text-gray-500">
            Genväg: <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[7px]">S</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

function SnoozeOptionButton({ 
  option, 
  onClick 
}: { 
  option: SnoozeOption;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-2 p-2.5 bg-white border-2 border-gray-200 rounded-md hover:border-pink-300 hover:shadow-md transition-all group"
    >
      <div className="w-7 h-7 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        <option.icon className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-[10px] font-bold text-gray-900">{option.label}</h3>
        <p className="text-[8px] text-gray-600 mt-0.5">{option.description}</p>
      </div>
    </button>
  );
}

// Follow-up Sequence Builder - KOMPAKT
export function FollowUpSequenceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-200 px-3 py-2.5">
          <h2 className="text-[12px] font-bold text-gray-900">Uppföljningssekvens</h2>
          <p className="text-[9px] text-gray-600 mt-0.5">Skicka automatiska påminnelser</p>
        </div>

        <div className="p-3 space-y-2">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-md p-2.5">
            <h3 className="text-[10px] font-bold text-blue-900 mb-1.5">Exempelsekvens:</h3>
            <div className="space-y-1 text-[8px] text-blue-800">
              <p>1️⃣ Dag 0: Initialt meddelande skickat</p>
              <p>2️⃣ Dag 3: Om inget svar → Skicka påminnelse</p>
              <p>3️⃣ Dag 7: Om inget svar → Skicka sista påminnelsen</p>
              <p>4️⃣ Dag 10: Om inget svar → Markera som vilande</p>
            </div>
          </div>

          <p className="text-[9px] text-gray-600 text-center py-3">
            Avancerad sekvensbyggare kommer snart! 🚀
          </p>
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-2.5 py-1.5 bg-pink-600 text-white rounded-md font-semibold hover:bg-pink-700 text-[9px]"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
}
