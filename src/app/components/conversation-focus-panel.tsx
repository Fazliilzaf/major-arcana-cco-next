import { useState } from "react";
import { Clock, User, Calendar, FileText, Sparkles, ChevronDown, ChevronUp, MapPin, Phone, Mail, Tag, DollarSign, TrendingUp, ShoppingBag, Package, MoreHorizontal, AlertTriangle, CheckCircle, Send, Star, Flame, MessageSquare, Bookmark } from "lucide-react";
import { ResponseStudioUltra } from "./response-studio-ultra";
import { toast } from "sonner";
import { CompactBookingCard, generateMockBookingContext } from "./compact-booking-card";

interface ConversationFocusPanelProps {
  selectedMessage?: string | null;
  onSnoozeMessage?: (messageId: string) => void;
}

export function ConversationFocusPanel({ selectedMessage, onSnoozeMessage }: ConversationFocusPanelProps = {}) {
  const [activeTab, setActiveTab] = useState<"konversation" | "kundhistorik" | "historik">("konversation");
  const [showResponseStudio, setShowResponseStudio] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [showOlderMessages, setShowOlderMessages] = useState(false);

  const handleOpenStudio = () => {
    setShowResponseStudio(true);
  };

  const handleMoreOptions = () => {
    toast.info("Konversationsalternativ");
  };

  const handleMessageOptions = () => {
    toast.info("Meddelandealternativ");
  };

  const handleAIReply = () => {
    setDraftMessage("Hej Anna! Självklart! Vi har lediga tider på torsdag 14:00 eller fredag 10:30. Vilken passar bäst?");
    toast.success("AI-svar infogat!");
  };

  const handleSendQuick = () => {
    if (!draftMessage.trim()) {
      toast.error("Skriv ett meddelande först");
      return;
    }
    toast.success("Meddelande skickat! ✉️");
    setDraftMessage("");
  };

  // Calculate SLA with business hours
  const slaMinutesLeft = 45; // 45 minutes left
  const slaTotal = 240; // 4 hours total SLA
  const slaProgress = (slaMinutesLeft / slaTotal) * 100;
  const slaStatus = slaProgress < 25 ? 'breach' : slaProgress < 50 ? 'warning' : 'safe';

  // Stagnation detection (48h no activity)
  const hoursStagnant = 48;
  const isStagnant = hoursStagnant >= 48;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header - KOMPAKT */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-2">
        <h2 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">Akut ombokning idag</h2>
        <button 
          onClick={handleMoreOptions}
          className="rounded-lg p-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Tabs - KOMPAKT */}
      <div className="border-b border-gray-200 dark:border-gray-800 flex">
        {[
          { id: "konversation" as const, label: "Konversation" },
          { id: "kundhistorik" as const, label: "Kundhistorik" },
          { id: "historik" as const, label: "Historik" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-[9px] font-bold transition-all ${
              activeTab === tab.id
                ? "text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages - Scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 space-y-2.5">
        {activeTab === "konversation" && (
          <>
            {/* COMPACT BOOKING CARD - AI SUMMARY! */}
            <CompactBookingCard context={generateMockBookingContext()} />

            {/* KOMPAKT - SLA & Stagnation Badges */}
            <div className="mb-2 flex items-center gap-1 flex-wrap">
              {/* SLA Badge - KOMPAKT */}
              <div className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 border text-[9px] font-bold ${
                slaStatus === 'breach' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-700 text-red-900 dark:text-red-100' :
                slaStatus === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-700 text-amber-900 dark:text-amber-100' :
                'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100'
              }`}>
                <Clock className="h-2.5 w-2.5" />
                SLA {slaMinutesLeft}m
              </div>

              {/* Stagnation Badge - KOMPAKT */}
              {isStagnant && (
                <div className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-700 text-[9px] font-bold text-orange-800 dark:text-orange-200">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {hoursStagnant}h inaktiv
                  <button
                    onClick={() => toast.success("Schemalagt uppföljning")}
                    className="ml-0.5 rounded bg-orange-100 dark:bg-orange-900 px-1 py-0.5 text-[9px] font-medium hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                  >
                    Följ upp
                  </button>
                </div>
              )}
            </div>

            {/* REVERSED Timeline Container - SENASTE FÖRST! */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[22px] top-4 bottom-4 w-[2px] bg-rose-200 dark:bg-rose-700" />

              {/* Message 3 - Customer (LATEST/NEWEST MESSAGE) - FEATURED! */}
              <div className="relative mb-4 flex gap-2.5">
                <div className="relative z-10 flex-shrink-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500 dark:bg-rose-400 ring-4 ring-white dark:ring-gray-900 animate-pulse" style={{ marginTop: '14px' }} />
                </div>

                <div className="flex-1">
                  <div className="mb-1.5 flex items-start gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                      alt="Anna Karlsson"
                      className="h-8 w-8 rounded-full border border-gray-100 dark:border-gray-700 object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Anna Karlsson</h3>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">· Idag 11:42</span>
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 text-[9px] font-semibold text-rose-700 dark:text-rose-300">
                            <Star className="h-2.5 w-2.5" />
                            Senaste
                          </span>
                        </div>
                        <button 
                          onClick={handleMessageOptions}
                          className="rounded-lg p-0.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5 text-gray-400" />
                        </button>
                      </div>

                      <div className="mt-2 rounded-lg bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-700 px-2.5 py-2">
                        <p className="text-[12px] leading-relaxed text-gray-800 dark:text-gray-200">
                          Hej! Jag måste tyvärr ställa in min tid imorgon. Kan jag få en ny tid så snart som möjligt? 
                          Helst någon eftermiddag denna vecka.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show/Hide Older Messages Button */}
              <div className="relative mb-6">
                <button
                  onClick={() => setShowOlderMessages(!showOlderMessages)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-750 dark:hover:to-gray-700 transition-all group"
                >
                  {showOlderMessages ? (
                    <>
                      <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                      <span className="text-[12px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                        Dölj 2 äldre meddelanden
                      </span>
                      <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                      <span className="text-[12px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                        Visa 2 äldre meddelanden
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                    </>
                  )}
                </button>
              </div>

              {/* Older Messages - Collapsed by default */}
              {showOlderMessages && (
                <>
                  {/* Message 2 - Staff */}
                  <div className="relative mb-6 flex gap-3 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="relative z-10 flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-rose-300 dark:bg-rose-600 ring-4 ring-white dark:ring-gray-900" style={{ marginTop: '20px' }} />
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-start gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop"
                          alt="Sara Lindberg"
                          className="h-10 w-10 rounded-full border border-gray-100 dark:border-gray-700 object-cover shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">Sara Lindberg</h3>
                              <span className="text-[11px] text-gray-500 dark:text-gray-400">· 2026-04-20 · 14:30</span>
                            </div>
                            <button 
                              onClick={handleMessageOptions}
                              className="rounded-lg p-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <MoreHorizontal className="h-[16px] w-[16px] text-gray-400" />
                            </button>
                          </div>

                          <div className="mt-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 p-3.5">
                            <p className="text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">Hej Anna,</p>
                            <p className="mt-2 text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">
                              Din tid för PRP-behandling är bekräftad för imorgon kl 10:00 med Dr. Eriksson. Vi ser fram emot att träffa dig!
                            </p>
                            <p className="mt-2 text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">Vänliga hälsningar,</p>
                            <p className="text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">Sara · Hair TP Clinic</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message 1 - Customer (OLDEST) */}
                  <div className="relative mb-6 flex gap-3 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="relative z-10 flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-rose-300 dark:bg-rose-600 ring-4 ring-white dark:ring-gray-900" style={{ marginTop: '20px' }} />
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-start gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                          alt="Anna Karlsson"
                          className="h-10 w-10 rounded-full border border-gray-100 dark:border-gray-700 object-cover shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">Anna Karlsson</h3>
                              <span className="text-[11px] text-gray-500 dark:text-gray-400">· 2026-04-18 · 09:15</span>
                            </div>
                            <button 
                              onClick={handleMessageOptions}
                              className="rounded-lg p-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <MoreHorizontal className="h-[16px] w-[16px] text-gray-400" />
                            </button>
                          </div>

                          <div className="mt-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 p-3.5">
                            <p className="text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">Hej,</p>
                            <p className="mt-2 text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">
                              Jag vill boka in en PRP-behandling. Jag är tillgänglig på fredag, gärna kl <span className="font-semibold">09:00</span>, alternativt måndag kl <span className="font-semibold">15:30</span>. Hör gärna av er med nästa lediga tid!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* KOMPAKT Footer Info - Precis ovanför knappar */}
            <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-1.5 bg-gray-50/30 dark:bg-gray-800/30">
              <div className="flex items-center gap-3 text-[10px] text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FileText className="h-2.5 w-2.5" />
                  3 tid
                </span>
                <span className="text-gray-300 dark:text-gray-700">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  2025-01-14
                </span>
                <span className="text-gray-300 dark:text-gray-700">·</span>
                <span className="flex items-center gap-1">
                  <User className="h-2.5 w-2.5" />
                  Sedan 2023
                </span>
              </div>
            </div>
          </>
        )}

        {activeTab === "kundhistorik" && (
          <div className="space-y-3">
            {/* Customer Profile Card with Image */}
            <div className="mb-4 flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                  alt="Anna Karlsson"
                  className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-800 object-cover shadow-md ring-2 ring-pink-100 dark:ring-pink-900"
                />
                {/* VIP Badge */}
                <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white dark:border-gray-800 shadow-sm">
                  <Star className="h-2.5 w-2.5 text-white fill-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 truncate">Anna Karlsson</h3>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-1 truncate">
                  <Mail className="h-2.5 w-2.5 flex-shrink-0" />
                  anna.karlsson@email.com
                </p>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Phone className="h-2.5 w-2.5 flex-shrink-0" />
                  070-123 45 67
                </p>
              </div>
            </div>

            {/* Customer Stats - 3 Column Cards */}
            <div className="mb-4 grid grid-cols-3 gap-2">
              <div className="group rounded-lg border border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50 dark:from-blue-950 dark:via-blue-900/50 dark:to-blue-950 p-2.5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-blue-500/10">
                    <ShoppingBag className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-[9px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Köp</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">4</p>
                <p className="text-[9px] text-gray-600 dark:text-gray-400 font-medium">Behandlingar</p>
              </div>

              <div className="group rounded-lg border border-emerald-200 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-50 dark:from-emerald-950 dark:via-emerald-900/50 dark:to-emerald-50 p-2.5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-emerald-500/10">
                    <DollarSign className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">LTV</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">89K</p>
                <p className="text-[9px] text-gray-600 dark:text-gray-400 font-medium">Livstidsvärde</p>
              </div>

              <div className="group rounded-lg border border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-50 dark:from-purple-950 dark:via-purple-900/50 dark:to-purple-50 p-2.5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 rounded-md bg-purple-500/10">
                    <Star className="h-3 w-3 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
                  </div>
                  <span className="text-[9px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Status</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">VIP</p>
                <p className="text-[9px] text-gray-600 dark:text-gray-400 font-medium">Återkommande</p>
              </div>
            </div>

            {/* Customer Details with Temperature & Relation */}
            <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 p-3 shadow-sm">
              <h4 className="mb-2.5 text-[12px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                Kundinformation
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-1 rounded-md bg-blue-50 dark:bg-blue-950">
                    <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Kund sedan</p>
                    <p className="text-[11px] font-medium text-gray-900 dark:text-gray-100">Mars 2023 <span className="text-gray-500 dark:text-gray-400">(3 år)</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-1 rounded-md bg-purple-50 dark:bg-purple-950">
                    <TrendingUp className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Relation</p>
                    <p className="text-[11px] font-medium text-gray-900 dark:text-gray-100">Återkommande · <span className="text-purple-600 dark:text-purple-400">Lojal</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950">
                    <Flame className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Temperatur</p>
                    <p className="text-[11px] font-medium text-gray-900 dark:text-gray-100">Varm · <span className="text-amber-600 dark:text-amber-400">Aktiv</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kontaktinformation */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50/50 dark:bg-gray-800/50">
              <h4 className="text-[10px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-2">
                Kontaktinformation
              </h4>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                  <span>anna.karlsson@email.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                  <span>070-123 45 67</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                  <span>Stockholm, Sverige</span>
                </div>
              </div>
            </div>

            {/* Kundvärde */}
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-700 p-3 bg-emerald-50/50 dark:bg-emerald-950/20">
              <h4 className="text-[10px] font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-wide mb-2">
                Kundvärde
              </h4>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <DollarSign className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    Total LTV
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">89 500 kr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    Genomsnittligt ordervärde
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">22 375 kr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <ShoppingBag className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    Antal behandlingar
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">4 st</span>
                </div>
              </div>
            </div>

            {/* Preferenser */}
            <div className="rounded-lg border border-purple-200 dark:border-purple-700 p-3 bg-purple-50/50 dark:bg-purple-950/20">
              <h4 className="text-[10px] font-bold text-purple-900 dark:text-purple-100 uppercase tracking-wide mb-2">
                Preferenser
              </h4>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">Föredrar fredagar 09:00-12:00</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">Vill alltid ha Dr. Eriksson</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">Prefererad kanal: E-post</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "historik" && (
          <div className="space-y-2">
            {/* Aktivitetshistorik Header */}
            <h3 className="mb-3 text-[14px] font-semibold text-gray-900 dark:text-gray-100">Aktivitetshistorik</h3>
            <p className="mb-5 text-[11px] text-gray-600 dark:text-gray-400">
              Fullständig logg över all kommunikation och aktivitet
            </p>

            {/* Timeline */}
            <div className="relative space-y-5">
              {/* Timeline Line */}
              <div className="absolute left-[16px] top-4 bottom-4 w-[2px] bg-gray-200 dark:bg-gray-700" />

              {[
                {
                  type: "email",
                  icon: Mail,
                  color: "text-blue-600 dark:text-blue-400",
                  bg: "bg-blue-50 dark:bg-blue-950",
                  title: "E-post mottaget",
                  description: "Anna frågade om ombokning",
                  time: "2026-04-22 11:42",
                  detail: "Hej! Jag måste tyvärr ställa in min tid imorgon..."
                },
                {
                  type: "email",
                  icon: Mail,
                  color: "text-green-600 dark:text-green-400",
                  bg: "bg-green-50 dark:bg-green-950",
                  title: "E-post skickat",
                  description: "Sara bekräftade bokning",
                  time: "2026-04-20 14:30",
                  detail: "Hej Anna! Din tid för PRP-behandling är bekräftad..."
                },
                {
                  type: "booking",
                  icon: Calendar,
                  color: "text-purple-600 dark:text-purple-400",
                  bg: "bg-purple-50 dark:bg-purple-950",
                  title: "Behandling genomförd",
                  description: "PRP-behandling Serie 1/3",
                  time: "2025-12-15 10:00",
                  detail: "Betalning: 4 500 kr · Status: Genomförd"
                },
                {
                  type: "booking",
                  icon: Calendar,
                  color: "text-purple-600 dark:text-purple-400",
                  bg: "bg-purple-50 dark:bg-purple-950",
                  title: "Behandling genomförd",
                  description: "DHI Hårtransplantation",
                  time: "2025-08-20 09:00",
                  detail: "Betalning: 75 000 kr · Status: Genomförd"
                },
                {
                  type: "call",
                  icon: Phone,
                  color: "text-orange-600 dark:text-orange-400",
                  bg: "bg-orange-50 dark:bg-orange-950",
                  title: "Samtal",
                  description: "Konsultation inför behandling",
                  time: "2025-02-10 14:30",
                  detail: "Längd: 25 min · Initierad av: Klinik"
                },
                {
                  type: "sms",
                  icon: MessageSquare,
                  color: "text-teal-600 dark:text-teal-400",
                  bg: "bg-teal-50 dark:bg-teal-950",
                  title: "SMS skickat",
                  description: "Påminnelse om behandling",
                  time: "2025-08-19 09:00",
                  detail: "Automatisk påminnelse 24h innan behandling"
                },
              ].map((activity, index) => (
                <div key={index} className="relative flex gap-3.5">
                  {/* Timeline Dot */}
                  <div className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${activity.bg} border-2 border-white dark:border-gray-900`}>
                    <activity.icon className={`h-3.5 w-3.5 ${activity.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-5">
                    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3.5 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{activity.title}</h4>
                          <p className="text-[12px] text-gray-600 dark:text-gray-400">{activity.description}</p>
                        </div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">{activity.time}</span>
                      </div>
                      {activity.detail && (
                        <p className="mt-2 text-[12px] text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2.5">
                          {activity.detail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Intern operativ notis */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-2 bg-yellow-50/50 dark:bg-yellow-950/20">
        <h4 className="text-[9px] font-bold text-yellow-900 dark:text-yellow-100 uppercase tracking-wide mb-1">
          📝 Intern operativ notis
        </h4>
        <p className="text-[10px] text-yellow-800 dark:text-yellow-200 leading-tight">
          Kunden kan endast efter 15:00 och vill helst lösa detta innan arbetsdagen är slut.
        </p>
      </div>

      {/* Quick Action Buttons - ENDAST 3 knappar */}
      {activeTab === "konversation" && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Schemalägg */}
            <button
              onClick={() => toast.info("Schemalägg uppföljning...")}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-pink-600 dark:text-pink-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-pink-300 dark:hover:border-pink-500 transition-all shadow-sm"
              title="Schemalägg"
            >
              <Calendar className="h-5 w-5" />
            </button>
            
            {/* Anteckningar/Dokument */}
            <button
              onClick={() => toast.success("Sparat som anteckning")}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
              title="Anteckningar"
            >
              <FileText className="h-5 w-5" />
            </button>
            
            {/* Svarstudio - STOR ROSA KNAPP */}
            <button
              onClick={handleOpenStudio}
              className="ml-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[15px] font-bold hover:from-pink-700 hover:to-rose-700 transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
              Svarstudio
            </button>
          </div>
        </div>
      )}

      {/* Response Studio Drawer */}
      <ResponseStudioUltra
        isOpen={showResponseStudio}
        onClose={() => setShowResponseStudio(false)}
        selectedMessage={selectedMessage || "1"}
        onSnoozeMessage={onSnoozeMessage}
      />
    </div>
  );
}