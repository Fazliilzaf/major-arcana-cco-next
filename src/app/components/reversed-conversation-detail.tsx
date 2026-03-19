import { MoreHorizontal, Calendar, User, FileText, ShoppingBag, DollarSign, TrendingUp, Mail, Phone, MessageSquare, AlertCircle, Clock, CheckCircle, AlertTriangle, Send, Sparkles, FileDown, Maximize2, Star, Flame, ChevronDown, ChevronUp, RotateCw, Wand2, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ResponseStudioModal } from "./response-studio-modal";
import { ConversationContextCard, generateMockContext } from "./conversation-context-card";
import { CompactBookingCard, generateMockBookingContext } from "./compact-booking-card";
import { ResponseStudioDrawer } from "./response-studio-drawer";
import { generateAIReply, getMockCustomerHistory } from "../utils/ai-reply-generator";

type TabType = "konversation" | "kundhistorik" | "historik";

export function ReversedConversationDetail() {
  const [activeTab, setActiveTab] = useState<TabType>("konversation");
  const [draftMessage, setDraftMessage] = useState("");
  const [showResponseStudio, setShowResponseStudio] = useState(false);
  const [showOlderMessages, setShowOlderMessages] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  // AUTO-GENERATE AI REPLY on component mount!
  useEffect(() => {
    const context = generateMockContext("booking");
    const customerHistory = getMockCustomerHistory();
    
    const aiReply = generateAIReply({
      context,
      customerHistory,
      latestMessage: {
        from: "customer",
        text: "Fredag kl 09:00 passar perfekt. Jag ser fram emot det! 🙏",
        timestamp: "Idag 10:58"
      },
      conversationMessages: [],
      tone: "friendly",
      language: "sv"
    });
    
    setDraftMessage(aiReply);
    setIsAIGenerated(true);
  }, []); // Run once on mount

  const tabs = [
    { id: "konversation" as TabType, label: "Konversation" },
    { id: "kundhistorik" as TabType, label: "Kundhistorik" },
    { id: "historik" as TabType, label: "Historik" },
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    toast.success(`Visar: ${tabs.find(t => t.id === tabId)?.label}`);
  };

  const handleMoreOptions = () => {
    toast.info("Konversationsalternativ");
  };

  const handleMessageOptions = () => {
    toast.info("Meddelandealternativ");
  };

  const handleQuickBook = () => {
    toast.success("Bokningsvy öppnas...");
  };

  const handleAIReply = () => {
    const context = generateMockContext("booking");
    const customerHistory = getMockCustomerHistory();
    
    const aiReply = generateAIReply({
      context,
      customerHistory,
      latestMessage: {
        from: "customer",
        text: "Fredag kl 09:00 passar perfekt. Jag ser fram emot det! 🙏",
        timestamp: "Idag 10:58"
      },
      conversationMessages: [],
      tone: "friendly",
      language: "sv"
    });
    
    setDraftMessage(aiReply);
    setIsAIGenerated(true);
    toast.success("AI-svar regenererat!");
  };

  const handleRegenerateAI = () => {
    handleAIReply();
  };

  const handleTemplate = () => {
    toast.info("Välj mall...");
  };

  const handleSendQuick = () => {
    if (!draftMessage.trim()) {
      toast.error("Skriv ett meddelande först");
      return;
    }
    toast.success("Meddelande skickat! ✉️");
    setDraftMessage("");
  };

  const handleExpandToStudio = () => {
    setShowResponseStudio(true);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <h2 className="text-[16px] font-semibold text-gray-900">Bokning av tid</h2>
        <button 
          onClick={handleMoreOptions}
          className="rounded-lg p-1 hover:bg-gray-50 transition-colors"
        >
          <MoreHorizontal className="h-[16px] w-[16px] text-gray-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100 px-5">
        <div className="flex gap-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative pb-2.5 pt-3 text-[13px] font-medium transition-all ${
                activeTab === tab.id
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "konversation" && (
          <ReversedConversationContent 
            handleMessageOptions={handleMessageOptions}
            showOlderMessages={showOlderMessages}
            setShowOlderMessages={setShowOlderMessages}
          />
        )}
        {activeTab === "kundhistorik" && <CustomerHistoryContent />}
        {activeTab === "historik" && <ActivityHistoryContent />}
      </div>

      {/* CLEAN BOTTOM BAR - SVARSSTUDIO + QUICK ACTIONS */}
      {activeTab === "konversation" && (
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Quick Action Icons - Left Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.info("AI-förslag genereras...")}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-all"
                title="AI-förslag"
              >
                <Sparkles className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => toast.info("Schemalägg uppföljning...")}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-pink-300 transition-all shadow-sm"
                title="Schemalägg"
              >
                <Calendar className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => toast.success("Sparat som utkast")}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-pink-300 transition-all shadow-sm"
                title="Spara utkast"
              >
                <Bookmark className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => toast.info("Fler alternativ...")}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-md hover:shadow-lg transition-all"
                title="Mer"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Main Svarsstudio Button - Right Side */}
            <button
              onClick={handleExpandToStudio}
              className="ml-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[15px] font-bold hover:from-pink-700 hover:to-rose-700 transition-all shadow-md hover:shadow-lg"
            >
              <Send className="h-5 w-5" />
              Skicka
            </button>
          </div>
        </div>
      )}

      {/* Svarstudio Modal */}
      <ResponseStudioDrawer 
        isOpen={showResponseStudio}
        onClose={() => setShowResponseStudio(false)}
        initialMessage={draftMessage}
      />
    </div>
  );
}

function ReversedConversationContent({ 
  handleMessageOptions,
  showOlderMessages,
  setShowOlderMessages 
}: { 
  handleMessageOptions: () => void;
  showOlderMessages: boolean;
  setShowOlderMessages: (show: boolean) => void;
}) {
  // Calculate SLA with business hours
  const slaMinutesLeft = 45; // 45 minutes left
  const slaTotal = 240; // 4 hours total SLA
  const slaProgress = (slaMinutesLeft / slaTotal) * 100;
  const slaStatus = slaProgress < 25 ? 'breach' : slaProgress < 50 ? 'warning' : 'safe';
  
  const slaColors = {
    safe: { bg: 'bg-green-100', bar: 'bg-green-500', text: 'text-green-900' },
    warning: { bg: 'bg-amber-100', bar: 'bg-amber-500', text: 'text-amber-900' },
    breach: { bg: 'bg-red-100', bar: 'bg-red-500', text: 'text-red-900' },
  };

  // Stagnation detection (48h no activity)
  const hoursStagnant = 48;
  const isStagnant = hoursStagnant >= 48;

  return (
    <div className="p-2.5">
      {/* COMPACT BOOKING CARD - NEW DESIGN! */}
      <CompactBookingCard context={generateMockBookingContext()} />

      {/* KOMPAKT - SLA & Stagnation Badges */}
      <div className="mb-2 flex items-center gap-1 flex-wrap">
        {/* SLA Badge - KOMPAKT */}
        <div className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 border text-[9px] font-bold ${
          slaStatus === 'breach' ? 'bg-red-50 border-red-200 text-red-900' :
          slaStatus === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
          'bg-green-50 border-green-200 text-green-900'
        }`}>
          <Clock className="h-2.5 w-2.5" />
          SLA {slaMinutesLeft}m
        </div>

        {/* Stagnation Badge - KOMPAKT */}
        {isStagnant && (
          <div className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-orange-50 border border-orange-200 text-[9px] font-bold text-orange-800">
            <AlertTriangle className="h-2.5 w-2.5" />
            {hoursStagnant}h inaktiv
            <button
              onClick={() => toast.success("Schemalagt uppföljning")}
              className="ml-0.5 rounded bg-orange-100 px-1 py-0.5 text-[9px] font-medium hover:bg-orange-200 transition-colors"
            >
              Följ upp
            </button>
          </div>
        )}
      </div>

      {/* REVERSED Timeline Container - SENASTE FÖRST! */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[22px] top-4 bottom-4 w-[2px] bg-rose-200" />

        {/* Message 3 - Customer (LATEST/NEWEST MESSAGE) - FEATURED! */}
        <div className="relative mb-4 flex gap-2.5">
          <div className="relative z-10 flex-shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-4 ring-white animate-pulse" style={{ marginTop: '14px' }} />
          </div>

          <div className="flex-1">
            <div className="mb-1.5 flex items-start gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                alt="Johan Lagerström"
                className="h-8 w-8 rounded-full border border-gray-100 object-cover shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[12px] font-semibold text-gray-900">Johan Lagerström</h3>
                    <span className="text-[10px] text-gray-500">· Idag 10:58</span>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-semibold text-rose-700">
                      <Star className="h-2.5 w-2.5" />
                      Senaste
                    </span>
                  </div>
                  <button 
                    onClick={handleMessageOptions}
                    className="rounded-lg p-0.5 hover:bg-gray-50 transition-colors"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </div>

                <div className="mt-2 rounded-lg bg-blue-50/80 border border-blue-100 px-2.5 py-2">
                  <p className="text-[12px] leading-relaxed text-gray-800">
                    Fredag kl 09:00 passar perfekt. Jag ser fram emot det! 🙏
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all group"
          >
            {showOlderMessages ? (
              <>
                <ChevronUp className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                <span className="text-[12px] font-semibold text-gray-600 group-hover:text-gray-800">
                  Dölj 2 äldre meddelanden
                </span>
                <ChevronUp className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                <span className="text-[12px] font-semibold text-gray-600 group-hover:text-gray-800">
                  Visa 2 äldre meddelanden
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
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
                <div className="h-2 w-2 rounded-full bg-rose-300 ring-4 ring-white" style={{ marginTop: '20px' }} />
              </div>

              <div className="flex-1">
                <div className="mb-2 flex items-start gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="Egzona Krasniqi"
                    className="h-10 w-10 rounded-full border border-gray-100 object-cover shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-semibold text-gray-900">Egzona Krasniqi</h3>
                        <span className="text-[11px] text-gray-500">· 2026-04-22 · 11:32</span>
                      </div>
                      <button 
                        onClick={handleMessageOptions}
                        className="rounded-lg p-1 hover:bg-gray-50 transition-colors"
                      >
                        <MoreHorizontal className="h-[16px] w-[16px] text-gray-400" />
                      </button>
                    </div>

                    <div className="mt-3 rounded-xl bg-gray-50/80 border border-gray-100 p-3.5">
                      <p className="text-[13px] leading-relaxed text-gray-700">Hej Johan,</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-gray-700">
                        Du kan träffa oss fredag kl <span className="font-semibold">09:00</span> eller måndag kl <span className="font-semibold">15:30</span>. Bekräfta gärna så uppdaterar jag vår kalender.
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-gray-700">Vänliga hälsningar,</p>
                      <p className="text-[13px] leading-relaxed text-gray-700">Egzona · Hair TP Clinic</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message 1 - Customer (OLDEST) */}
            <div className="relative mb-6 flex gap-3 opacity-60 hover:opacity-100 transition-opacity">
              <div className="relative z-10 flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-rose-300 ring-4 ring-white" style={{ marginTop: '20px' }} />
              </div>

              <div className="flex-1">
                <div className="mb-2 flex items-start gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                    alt="Johan Lagerström"
                    className="h-10 w-10 rounded-full border border-gray-100 object-cover shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-semibold text-gray-900">Johan Lagerström</h3>
                        <span className="text-[11px] text-gray-500">· 2026-04-22 · 11:08</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                          Första meddelandet
                        </span>
                      </div>
                      <button 
                        onClick={handleMessageOptions}
                        className="rounded-lg p-1 hover:bg-gray-50 transition-colors"
                      >
                        <MoreHorizontal className="h-[16px] w-[16px] text-gray-400" />
                      </button>
                    </div>
                    
                    {/* SLA and Metadata */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-900">
                        SLA Th
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-800 text-[8px] font-bold text-white">
                          •
                        </span>
                        Hög
                      </span>
                    </div>
                    
                    <div className="mt-2 text-[11px] text-gray-600">
                      Intent: Bokning • Väntar på oss • Sant obesvarat • Kund sedan 2023
                    </div>

                    <div className="mt-3 rounded-xl bg-gray-50/80 border border-gray-100 p-3.5">
                      <p className="text-[13px] leading-relaxed text-gray-700">Hej,</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-gray-700">
                        Jag vill boka in en PrP-behandling. Jag är tillgänglig på fredag, gärna kl <span className="font-semibold">09:00</span>, alternativt måndag kl <span className="font-semibold">15:30</span>. Hör gärna av er med nästa lediga tid!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
        <div className="flex items-center gap-2 text-[12px] text-gray-700">
          <FileText className="h-3.5 w-3.5 text-gray-500" />
          <span className="font-medium">Tidigare bokningar (3)</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-700">
          <Calendar className="h-3.5 w-3.5 text-gray-500" />
          <span className="font-medium">Senaste behandling: 2025-01-14</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-700">
          <User className="h-3.5 w-3.5 text-gray-500" />
          <span className="font-medium">Kund sedan: 2023</span>
        </div>
        <button 
          onClick={() => toast.info("Mer information")}
          className="ml-auto rounded-lg p-1 hover:bg-gray-100 transition-colors"
        >
          <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

// Reuse existing components from enhanced-conversation-detail.tsx
function CustomerHistoryContent() {
  return (
    <div className="p-4">
      {/* Customer Profile - KOMPAKT */}
      <div className="mb-4 flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-sm">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
            alt="Johan Lagerström"
            className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-md ring-2 ring-pink-100"
          />
          {/* VIP Badge - mindre */}
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white shadow-sm">
            <Star className="h-2.5 w-2.5 text-white fill-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold text-gray-900 truncate">Johan Lagerström</h3>
          <p className="text-[11px] text-gray-600 flex items-center gap-1 truncate">
            <Mail className="h-2.5 w-2.5 flex-shrink-0" />
            johan.lagerstrom@email.com
          </p>
          <p className="text-[11px] text-gray-600 flex items-center gap-1">
            <Phone className="h-2.5 w-2.5 flex-shrink-0" />
            +46 70 123 45 67
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 text-center py-8">Kundhistorik kommer här...</p>
    </div>
  );
}

function ActivityHistoryContent() {
  return (
    <div className="p-4">
      <p className="text-sm text-gray-600 text-center py-8">Aktivitetshistorik kommer här...</p>
    </div>
  );
}