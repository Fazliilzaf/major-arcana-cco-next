import { MoreHorizontal, Calendar, User, Mail, Phone, Send, FileDown, Star, Flame, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ResponseStudioUltra } from "./response-studio-ultra";
import { generateMockContext } from "./conversation-context-card";
import { generateAIReply, getMockCustomerHistory } from "../utils/ai-reply-generator";
import { SmartSLABadge } from "./smart-sla-badge";
import { CollapsibleCustomerInfo } from "./collapsible-customer-info";
import { AdaptiveFloatingPanel } from "./adaptive-floating-panel";

type TabType = "konversation" | "kundhistorik" | "historik";

export function ReversedConversationDetailCompact() {
  const [activeTab, setActiveTab] = useState<TabType>("konversation");
  const [draftMessage, setDraftMessage] = useState("");
  const [showResponseStudio, setShowResponseStudio] = useState(false);
  const [showOlderMessages, setShowOlderMessages] = useState(false);
  const [showFloatingPanel, setShowFloatingPanel] = useState(true); // Show adaptive panel for demo
  const [minutesLeft, setMinutesLeft] = useState(23); // SLA countdown

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
  }, []);

  // SLA countdown simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

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

  const handleRegenerateAI = () => {
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
    toast.success("AI-svar regenererat!");
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
      {/* Header - SAMMA STORLEK SOM INKORG */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[13px] font-semibold text-gray-900">Bokning av tid</h2>
          <SmartSLABadge minutesLeft={minutesLeft} totalMinutes={240} />
        </div>
        <button 
          onClick={handleMoreOptions}
          className="rounded-lg p-1 hover:bg-gray-50 transition-colors"
        >
          <MoreHorizontal className="h-[16px] w-[16px] text-gray-500" />
        </button>
      </div>

      {/* Tabs - SAMMA STORLEK SOM INKORG */}
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

      {/* Content - Scrollable - MORE SPACE FOR CONVERSATION! */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "konversation" && (
          <CompactConversationContent 
            handleMessageOptions={handleMessageOptions}
            showOlderMessages={showOlderMessages}
            setShowOlderMessages={setShowOlderMessages}
            onOpenResponseStudio={handleExpandToStudio}
          />
        )}
        {activeTab === "kundhistorik" && <CustomerHistoryContent />}
        {activeTab === "historik" && <ActivityHistoryContent />}
      </div>

      {/* CLEAN BOTTOM BAR - KOMPAKTA KNAPPAR */}
      {activeTab === "konversation" && (
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white px-3 py-2">
          <div className="flex items-center gap-1.5">
            {/* Quick Action Buttons - MYCKET MINDRE */}
            <button
              onClick={handleQuickBook}
              className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 text-[10px] font-medium hover:bg-gray-50 hover:border-pink-300 transition-all"
              title="Boka tid"
            >
              <Calendar className="h-3 w-3" />
              Boka
            </button>
            
            <button
              onClick={handleTemplate}
              className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 text-[10px] font-medium hover:bg-gray-50 hover:border-pink-300 transition-all"
              title="Mallar"
            >
              <FileDown className="h-3 w-3" />
              Mall
            </button>

            {/* Main Svarsstudio Button - MINDRE */}
            <button
              onClick={handleExpandToStudio}
              className="ml-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[11px] font-bold hover:from-pink-700 hover:to-rose-700 transition-all shadow-sm"
            >
              <Sparkles className="h-3 w-3" />
              Öppna Svarsstudio
            </button>
          </div>
        </div>
      )}

      {/* Svarstudio Modal */}
      <ResponseStudioUltra 
        isOpen={showResponseStudio}
        onClose={() => setShowResponseStudio(false)}
        initialDraft={draftMessage}
      />

      {/* Adaptive Floating Panel */}
      <AdaptiveFloatingPanel 
        isVisible={showFloatingPanel && minutesLeft <= 30}
        urgency={minutesLeft <= 10 ? "critical" : minutesLeft <= 20 ? "high" : "medium"}
        minutesLeft={minutesLeft}
        recommendation="bokningsförslag"
        onQuickSend={() => {
          toast.success("✅ AI-genererat svar skickat!");
          setShowFloatingPanel(false);
        }}
        onCustomize={() => {
          setShowResponseStudio(true);
          setShowFloatingPanel(false);
        }}
        onDismiss={() => setShowFloatingPanel(false)}
      />
    </div>
  );
}

function CompactConversationContent({ 
  handleMessageOptions,
  showOlderMessages,
  setShowOlderMessages,
  onOpenResponseStudio
}: { 
  handleMessageOptions: () => void;
  showOlderMessages: boolean;
  setShowOlderMessages: (show: boolean) => void;
  onOpenResponseStudio: () => void;
}) {
  return (
    <div className="p-5">
      {/* FOCUS: CONVERSATION - 100% of space! NO CLUTTER! */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[22px] top-6 bottom-6 w-[2px] bg-rose-200" />

        {/* LATEST MESSAGE - PROMINENT */}
        <div className="relative mb-6 flex gap-3">
          <div className="relative z-10 flex-shrink-0">
            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 ring-4 ring-white shadow-md" style={{ marginTop: '18px' }} />
          </div>

          <div className="flex-1">
            <div className="mb-2 flex items-start gap-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                alt="Johan Lagerström"
                className="h-10 w-10 rounded-full border-2 border-pink-200 object-cover shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-semibold text-gray-900">Johan Lagerström</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                    <Flame className="h-2.5 w-2.5" />
                    SENASTE
                  </span>
                  <span className="text-[11px] text-gray-500">· Idag 10:58</span>
                </div>

                <div className="mt-3 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 p-4 shadow-sm">
                  <p className="text-[13px] leading-relaxed text-gray-900 font-medium">
                    Fredag kl <span className="font-bold text-pink-600">09:00</span> passar perfekt. Jag ser fram emot det! 🙏
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Show/Hide Older Messages */}
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

        {/* Older Messages */}
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

      {/* COLLAPSIBLE Customer Info Footer */}
      <CollapsibleCustomerInfo 
        previousBookings={3}
        lastBooking="2025-01-14"
        customerSince="2023"
        isVIP={true}
      />
    </div>
  );
}

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