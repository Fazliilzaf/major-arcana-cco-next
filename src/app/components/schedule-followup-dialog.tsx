import { useState } from "react";
import { X, Calendar, Clock, Bell, Tag, MessageSquare, User, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";

interface ScheduleFollowupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
  onSchedule?: (followup: FollowupData) => void;
}

export interface FollowupData {
  date: string;
  time: string;
  category: string;
  reminder: string;
  notes: string;
  doctor?: string;
}

// Mock customer intelligence data
const getCustomerIntelligence = (customerName: string) => {
  return {
    preferredDays: ["Fredag"],
    preferredTimeRange: "09:00-12:00",
    preferredDoctor: "Dr. Eriksson",
    averageResponseTime: "2.5h",
    treatmentSeries: "PRP 2/3",
  };
};

// AI-driven date suggestion
const getAISuggestedDate = () => {
  const today = new Date();
  const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilFriday);
  return nextFriday.toISOString().split('T')[0];
};

export function ScheduleFollowupDialog({
  isOpen,
  onClose,
  customerName = "Anna Karlsson",
  onSchedule,
}: ScheduleFollowupDialogProps) {
  const intelligence = getCustomerIntelligence(customerName);
  
  // AI-suggested defaults
  const [date, setDate] = useState(getAISuggestedDate());
  const [time, setTime] = useState("10:30");
  const [category, setCategory] = useState("ombokning");
  const [reminder, setReminder] = useState("120");
  const [doctor, setDoctor] = useState(intelligence.preferredDoctor);
  const [notes, setNotes] = useState(`${intelligence.treatmentSeries} - Ombokning. Kunden bekräftar vanligtvis inom ${intelligence.averageResponseTime}.`);

  if (!isOpen) return null;

  const handleSchedule = () => {
    if (!date || !time) {
      toast.error("Vänligen välj datum och tid");
      return;
    }

    const followupData: FollowupData = {
      date,
      time,
      category,
      reminder,
      notes,
      doctor,
    };

    onSchedule?.(followupData);
    toast.success(`Uppföljning schemalagd för ${customerName} - ${date} kl ${time}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
        {/* Header - 30% komprimerad */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
            <h3 className="text-[11px] font-bold text-gray-900 dark:text-gray-100">
              Schemalägg uppföljning
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content - 30% komprimerad */}
        <div className="px-3 py-2.5 space-y-2">
          
          {/* AI Recommendations Panel - NO ICON VERSION */}
          <div className="rounded-lg border border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-2">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-[9px] font-bold text-purple-900 dark:text-purple-100 uppercase tracking-wide">
                AI Rekommendationer
              </h4>
              <span className="text-[7px] text-purple-600 dark:text-purple-400 font-semibold px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 rounded">
                Baserat på kundhistorik
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white/60 dark:bg-gray-900/40 rounded p-1.5 border border-purple-100 dark:border-purple-800">
                <div className="text-[7px] text-purple-600 dark:text-purple-400 font-bold uppercase mb-0.5">Föredragen dag</div>
                <div className="text-[10px] font-bold text-purple-900 dark:text-purple-100">{intelligence.preferredDays.join(", ")}</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-900/40 rounded p-1.5 border border-purple-100 dark:border-purple-800">
                <div className="text-[7px] text-purple-600 dark:text-purple-400 font-bold uppercase mb-0.5">Tidsfönster</div>
                <div className="text-[10px] font-bold text-purple-900 dark:text-purple-100">{intelligence.preferredTimeRange}</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-900/40 rounded p-1.5 border border-purple-100 dark:border-purple-800">
                <div className="text-[7px] text-purple-600 dark:text-purple-400 font-bold uppercase mb-0.5">Föredragen läkare</div>
                <div className="text-[10px] font-bold text-purple-900 dark:text-purple-100">{intelligence.preferredDoctor}</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-900/40 rounded p-1.5 border border-purple-100 dark:border-purple-800">
                <div className="text-[7px] text-purple-600 dark:text-purple-400 font-bold uppercase mb-0.5">Svarstid (avg)</div>
                <div className="text-[10px] font-bold text-purple-900 dark:text-purple-100">{intelligence.averageResponseTime}</div>
              </div>
            </div>
          </div>
          
          {/* Kund */}
          <div>
            <label className="text-[8px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block mb-0.5">
              Kund
            </label>
            <div className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              {customerName}
            </div>
          </div>

          {/* Datum & Tid - WITH AI INDICATORS */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block mb-0.5">
                <Calendar className="h-2.5 w-2.5 inline mr-0.5" />
                Datum
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2 py-1.5 text-[11px] border-2 border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-[7px] text-purple-600 dark:text-purple-400 mt-0.5 font-semibold">Nästa Fredag</p>
            </div>
            <div>
              <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block mb-0.5">
                <Clock className="h-2.5 w-2.5 inline mr-0.5" />
                Tid
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-2 py-1.5 text-[11px] border-2 border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-[7px] text-purple-600 dark:text-purple-400 mt-0.5 font-semibold">Baserat på preferenser</p>
            </div>
          </div>

          {/* Läkare - WITH AI */}
          <div>
            <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block mb-0.5">
              <User className="h-2.5 w-2.5 inline mr-0.5" />
              Läkare
            </label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full px-2 py-1.5 text-[11px] border-2 border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Dr. Eriksson">Dr. Eriksson</option>
              <option value="Dr. Andersson">Dr. Andersson</option>
              <option value="Dr. Lindström">Dr. Lindström</option>
              <option value="Dr. Svensson">Dr. Svensson</option>
            </select>
            <p className="text-[7px] text-purple-600 dark:text-purple-400 mt-0.5 font-semibold">Kundpreferens</p>
          </div>

          {/* Kategori - WITH AI */}
          <div>
            <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block mb-0.5">
              <Tag className="h-2.5 w-2.5 inline mr-0.5" />
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2 py-1.5 text-[11px] border-2 border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="uppfoljning">Uppföljning</option>
              <option value="ombokning">Ombokning</option>
              <option value="konsultation">Konsultation</option>
              <option value="behandling">Behandling</option>
              <option value="betalning">Betalning</option>
            </select>
            <p className="text-[7px] text-purple-600 dark:text-purple-400 mt-0.5 font-semibold">Från kontext</p>
          </div>

          {/* Påminnelse - WITH AI */}
          <div>
            <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block mb-0.5">
              <Bell className="h-2.5 w-2.5 inline mr-0.5" />
              Påminn mig innan
            </label>
            <select
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full px-2 py-1.5 text-[11px] border-2 border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="5">5 minuter innan</option>
              <option value="15">15 minuter innan</option>
              <option value="30">30 minuter innan</option>
              <option value="60">1 timme innan</option>
              <option value="120">2 timmar innan</option>
              <option value="1440">1 dag innan</option>
            </select>
            <p className="text-[7px] text-purple-600 dark:text-purple-400 mt-0.5 font-semibold">Baserat på kundbeteende</p>
          </div>

          {/* Anteckningar - WITH AI */}
          <div>
            <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block mb-0.5">
              <MessageSquare className="h-2.5 w-2.5 inline mr-0.5" />
              Anteckningar
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="T.ex. 'Ring för att bekräfta ombokning av fredagstiden'"
              rows={2}
              className="w-full px-2 py-1.5 text-[11px] border-2 border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <p className="text-[7px] text-purple-600 dark:text-purple-400 mt-0.5 font-semibold">Auto-genererat från behandlingsserie</p>
          </div>
        </div>

        {/* Footer - 30% komprimerad */}
        <div className="flex items-center justify-end gap-1.5 px-3 py-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-[10px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={handleSchedule}
            className="px-3 py-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded shadow-sm hover:shadow transition-all"
          >
            Schemalägg uppföljning
          </button>
        </div>
      </div>
    </div>
  );
}