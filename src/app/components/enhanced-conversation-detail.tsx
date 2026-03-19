import { MoreHorizontal, Calendar, User, FileText, ShoppingBag, DollarSign, TrendingUp, Mail, Phone, MessageSquare, AlertCircle, Clock, CheckCircle, AlertTriangle, Send, Sparkles, FileDown, Maximize2, Star, Flame, StickyNote, Eye, Tag, Lock, Users, Trash2, ChevronDown, ChevronUp, RefreshCw, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ResponseStudioModal } from "./response-studio-modal";
import { NotesDialog, NoteData, getAllNotesFromStorage, getNotesByCustomer } from "./notes-dialog";
import { NotesViewerPanel } from "./notes-viewer-panel";
import { ScheduleFollowupDialog, FollowupData } from "./schedule-followup-dialog";

type TabType = "konversation" | "kundhistorik" | "historik" | "anteckningar";

export function EnhancedConversationDetail() {
  const [activeTab, setActiveTab] = useState<TabType>("konversation");
  const [draftMessage, setDraftMessage] = useState("");
  const [showResponseStudio, setShowResponseStudio] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showNotesViewer, setShowNotesViewer] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [customerNotes, setCustomerNotes] = useState<NoteData[]>([]);

  const currentCustomerName = "Johan Svensson";

  // Load notes when component mounts or when switching to notes tab
  useEffect(() => {
    if (activeTab === "anteckningar") {
      loadCustomerNotes();
    }
  }, [activeTab]);

  const loadCustomerNotes = () => {
    const notes = getNotesByCustomer(currentCustomerName);
    // Sort by timestamp (newest first)
    notes.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA;
    });
    setCustomerNotes(notes);
  };

  const tabs = [
    { id: "konversation" as TabType, label: "Konversation" },
    { id: "kundhistorik" as TabType, label: "Kundhistorik" },
    { id: "historik" as TabType, label: "Historik" },
    { id: "anteckningar" as TabType, label: "Anteckningar", badge: customerNotes.length || undefined },
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
    setDraftMessage("Hej Johan! Självklart! Vi har lediga tider på torsdag 14:00 eller fredag 10:30. Vilken passar bäst?");
    toast.success("Smart svar infogat!");
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

  const handleOpenNotesDialog = () => {
    console.log("🔵 ANTECKNINGAR KNAPP KLICKAD!");
    setShowNotesDialog(true);
  };

  const handleSaveNote = (noteData: NoteData) => {
    console.log("Note saved:", noteData);
    setShowNotesDialog(false);
    // Reload notes after saving
    loadCustomerNotes();
    toast.success("Anteckning sparad!");
  };

  const handleOpenScheduleDialog = () => {
    setShowScheduleDialog(true);
  };

  const handleScheduleFollowup = (followupData: FollowupData) => {
    console.log("Followup scheduled:", followupData);
    // Here we would save the followup to state/database
    setShowScheduleDialog(false);
    toast.success("Uppföljning schemalagd!");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <h2 className="text-[14px] font-bold text-gray-900">Bokning av tid</h2>
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
              {tab.badge !== undefined && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "konversation" && <ConversationContent handleMessageOptions={handleMessageOptions} handleOpenScheduleDialog={handleOpenScheduleDialog} />}
        {activeTab === "kundhistorik" && <CustomerHistoryContent />}
        {activeTab === "historik" && <ActivityHistoryContent />}
        {activeTab === "anteckningar" && <NotesTabContent customerName={currentCustomerName} notes={customerNotes} onRefresh={loadCustomerNotes} onCreateNew={handleOpenNotesDialog} />}
      </div>

      {/* Quick Actions Bar */}
      {activeTab === "konversation" && (
        <div className="border-t border-gray-200 bg-gray-50/50 px-3 py-2">
          {/* Inline Draft Area med Integrerade Actions */}
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                placeholder="Skriv ett snabbt svar..."
                className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={2}
              />
              {/* Quick AI button inside textarea */}
              <button
                onClick={handleAIReply}
                className="absolute right-2 bottom-2 p-1 rounded-md hover:bg-blue-50 transition-colors"
                title="Smart förslag"
              >
                <Sparkles className="h-4 w-4 text-blue-500" />
              </button>
            </div>
            
            {/* Action Buttons - KOMPAKT VERTIKAL STACK */}
            <div className="flex flex-col gap-1">
              {/* Primary: Skicka */}
              <button
                onClick={handleSendQuick}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm whitespace-nowrap"
              >
                <Send className="h-3.5 w-3.5" />
                Skicka
              </button>
              
              {/* Secondary Actions Row */}
              <div className="flex gap-1">
                <button
                  onClick={handleQuickBook}
                  className="flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-pink-100 text-pink-700 text-[10px] font-semibold hover:bg-pink-200 transition-all"
                  title="Boka tid"
                >
                  <Calendar className="h-3 w-3" />
                </button>
                <button
                  onClick={handleOpenNotesDialog}
                  className="flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-[10px] font-semibold hover:bg-blue-200 transition-all"
                  title="Anteckningar"
                >
                  <StickyNote className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setShowNotesViewer(true)}
                  className="flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-[10px] font-semibold hover:bg-purple-200 transition-all"
                  title="Visa alla anteckningar"
                >
                  <Eye className="h-3 w-3" />
                </button>
                <button
                  onClick={handleTemplate}
                  className="flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-gray-200 text-gray-700 text-[10px] font-semibold hover:bg-gray-300 transition-all"
                  title="Mallar"
                >
                  <FileDown className="h-3 w-3" />
                </button>
                <button
                  onClick={handleExpandToStudio}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 text-white text-[11px] font-bold hover:from-pink-700 hover:to-pink-800 transition-all shadow-sm"
                  title="Öppna Svarstudio"
                >
                  Svarstudio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Studio Modal */}
      <ResponseStudioModal
        isOpen={showResponseStudio}
        onClose={() => setShowResponseStudio(false)}
        customerName="Johan Svensson"
        conversationContext="Kunden frågar om lediga tider för PRP-behandling nästa vecka"
        onSendResponse={(response) => {
          setDraftMessage(response);
          toast.success("Svar infogat i meddelandefältet");
        }}
      />

      {/* Notes Dialog */}
      <NotesDialog
        isOpen={showNotesDialog}
        onClose={() => setShowNotesDialog(false)}
        customerName="Johan Svensson"
        conversationContext="Kunden frågar om lediga tider för PRP-behandling nästa vecka"
        onSave={handleSaveNote}
      />

      {/* Notes Viewer Panel */}
      <NotesViewerPanel
        isOpen={showNotesViewer}
        onClose={() => setShowNotesViewer(false)}
        filterByCustomer="Johan Svensson"
      />

      {/* Schedule Followup Dialog */}
      <ScheduleFollowupDialog
        isOpen={showScheduleDialog}
        onClose={() => setShowScheduleDialog(false)}
        customerName="Johan Svensson"
        onSchedule={handleScheduleFollowup}
      />
    </div>
  );
}

function ConversationContent({ handleMessageOptions, handleOpenScheduleDialog }: { handleMessageOptions: () => void, handleOpenScheduleDialog: () => void }) {
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
    <div className="p-5">
      {/* KOMPAKT - SLA & Stagnation Badges */}
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        {/* SLA Badge - KOMPAKT */}
        <div className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 border ${
          slaStatus === 'breach' ? 'bg-red-50 border-red-200' :
          slaStatus === 'warning' ? 'bg-amber-50 border-amber-200' :
          'bg-green-50 border-green-200'
        }`}>
          <Clock className={`h-3.5 w-3.5 ${slaColors[slaStatus].text}`} />
          <span className={`text-[11px] font-bold ${slaColors[slaStatus].text}`}>
            SLA {slaMinutesLeft}m
          </span>
        </div>

        {/* Stagnation Badge - KOMPAKT */}
        {isStagnant && (
          <div className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 bg-orange-50 border border-orange-200">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />
            <span className="text-[11px] font-bold text-orange-800">
              {hoursStagnant}h inaktiv
            </span>
            <button
              onClick={handleOpenScheduleDialog}
              className="ml-1 rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-800 hover:bg-orange-200 transition-colors"
            >
              Följ upp
            </button>
          </div>
        )}
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[22px] top-6 bottom-24 w-[2px] bg-rose-200" />

        {/* Message 1 - Customer */}
        <div className="relative mb-6 flex gap-3">
          {/* Timeline Dot */}
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

        {/* Message 2 - Staff */}
        <div className="relative mb-6 flex gap-3">
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

        {/* Senaste meddelande separator */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative bg-white px-4 text-[12px] font-medium text-gray-600">
            Senaste meddelande
          </div>
        </div>

        {/* Message 3 - Latest Customer Reply */}
        <div className="relative mb-6 flex gap-3">
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
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-semibold text-gray-900">Johan Lagerström</h3>
                  <span className="text-[11px] text-gray-500">· Idag 10:58</span>
                </div>

                <div className="mt-3 rounded-xl bg-gray-50/80 border border-gray-100 p-3.5">
                  <p className="text-[13px] leading-relaxed text-gray-700">
                    Fredag kl <span className="font-semibold">09:00</span> passar perfekt. Jag ser fram emot det! 🙏
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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

      {/* Customer Stats - KOMPAKT */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="group rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50 p-2.5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="p-1 rounded-md bg-blue-500/10">
              <ShoppingBag className="h-3 w-3 text-blue-600" />
            </div>
            <span className="text-[9px] font-semibold text-blue-700 uppercase tracking-wide">Köp</span>
          </div>
          <p className="text-[14px] font-bold text-gray-900">12</p>
          <p className="text-[9px] text-gray-600 font-medium">Behandlingar</p>
        </div>

        <div className="group rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-50 p-2.5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="p-1 rounded-md bg-emerald-500/10">
              <DollarSign className="h-3 w-3 text-emerald-600" />
            </div>
            <span className="text-[9px] font-semibold text-emerald-700 uppercase tracking-wide">LTV</span>
          </div>
          <p className="text-[14px] font-bold text-gray-900">46K</p>
          <p className="text-[9px] text-gray-600 font-medium">Livstidsvärde</p>
        </div>

        <div className="group rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-50 p-2.5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="p-1 rounded-md bg-purple-500/10">
              <Star className="h-3 w-3 text-purple-600 fill-purple-600" />
            </div>
            <span className="text-[9px] font-semibold text-purple-700 uppercase tracking-wide">Status</span>
          </div>
          <p className="text-[14px] font-bold text-gray-900">VIP</p>
          <p className="text-[9px] text-gray-600 font-medium">Återkommande</p>
        </div>
      </div>

      {/* Customer Details - KOMPAKT */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 p-3 shadow-sm">
        <h4 className="mb-2.5 text-[12px] font-bold text-gray-900 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-pink-600" />
          Kundinformation
        </h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-1.5 rounded-md hover:bg-gray-50 transition-colors">
            <div className="p-1 rounded-md bg-blue-50">
              <User className="h-3 w-3 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Kund sedan</p>
              <p className="text-[11px] font-medium text-gray-900">Mars 2023 <span className="text-gray-500">(3 år)</span></p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-1.5 rounded-md hover:bg-gray-50 transition-colors">
            <div className="p-1 rounded-md bg-purple-50">
              <TrendingUp className="h-3 w-3 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Relation</p>
              <p className="text-[11px] font-medium text-gray-900">Återkommande · <span className="text-purple-600">Lojal</span></p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-1.5 rounded-md hover:bg-gray-50 transition-colors">
            <div className="p-1 rounded-md bg-amber-50">
              <Flame className="h-3 w-3 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Temperatur</p>
              <p className="text-[11px] font-medium text-gray-900">Varm · <span className="text-amber-600">Aktiv</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase History - KOMPAKT */}
      <div>
        <h4 className="mb-2.5 text-[12px] font-bold text-gray-900 flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-pink-600" />
          Tidigare bokningar
        </h4>
        <div className="space-y-1.5">
          {[
            { date: "2025-01-14", treatment: "PrP behandling", price: "4 500 kr", status: "Genomförd", statusColor: "emerald" },
            { date: "2024-11-02", treatment: "Konsultation", price: "500 kr", status: "Genomförd", statusColor: "emerald" },
            { date: "2024-08-18", treatment: "Hårtransplantation följd", price: "0 kr", status: "Genomförd", statusColor: "emerald" },
            { date: "2024-03-22", treatment: "PrP behandling", price: "4 500 kr", status: "Genomförd", statusColor: "emerald" },
          ].map((booking, index) => (
            <div 
              key={index} 
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-2.5 hover:shadow-md hover:border-pink-200 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="p-1.5 rounded-md bg-gray-50 group-hover:bg-pink-50 transition-colors flex-shrink-0">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-gray-900 truncate">{booking.treatment}</p>
                  <p className="text-[9px] text-gray-500 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {booking.date}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-[11px] font-bold text-gray-900 mb-0.5">{booking.price}</p>
                <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-semibold bg-${booking.statusColor}-100 text-${booking.statusColor}-700 border border-${booking.statusColor}-200`}>
                  <CheckCircle className="h-2.5 w-2.5" />
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityHistoryContent() {
  return (
    <div className="p-5">
      <h3 className="mb-3 text-[16px] font-semibold text-gray-900">Aktivitetshistorik</h3>
      <p className="mb-5 text-[13px] text-gray-600">
        Fullständig logg över all kommunikation och aktivitet med Johan Lagerström
      </p>

      {/* Timeline */}
      <div className="relative space-y-5">
        {/* Timeline Line */}
        <div className="absolute left-[16px] top-4 bottom-4 w-[2px] bg-gray-200" />

        {[
          {
            type: "email",
            icon: Mail,
            color: "text-blue-600",
            bg: "bg-blue-50",
            title: "E-post mottaget",
            description: "Johan svarade på bokning av tid",
            time: "Idag 10:58",
            detail: 'Fredag kl 09:00 passar perfekt. Jag ser fram emot det! 🙏'
          },
          {
            type: "email",
            icon: Mail,
            color: "text-green-600",
            bg: "bg-green-50",
            title: "E-post skickat",
            description: "Egzona skickade bokningsalternativ",
            time: "2026-04-22 11:32",
            detail: "Du kan träffa oss fredag kl 09:00 eller måndag kl 15:30..."
          },
          {
            type: "email",
            icon: Mail,
            color: "text-blue-600",
            bg: "bg-blue-50",
            title: "E-post mottaget",
            description: "Johan frågade om tid för PrP-behandling",
            time: "2026-04-22 11:08",
            detail: "Jag vill boka in en PrP-behandling. Jag är tillgänglig på fredag..."
          },
          {
            type: "booking",
            icon: Calendar,
            color: "text-purple-600",
            bg: "bg-purple-50",
            title: "Behandling genomförd",
            description: "PrP behandling slutförd",
            time: "2025-01-14 10:00",
            detail: "Betalning: 4 500 kr · Status: Genomförd"
          },
          {
            type: "call",
            icon: Phone,
            color: "text-orange-600",
            bg: "bg-orange-50",
            title: "Samtal",
            description: "Uppföljningssamtal efter behandling",
            time: "2025-01-16 14:30",
            detail: "Längd: 12 min · Initierad av: Klinik"
          },
          {
            type: "sms",
            icon: MessageSquare,
            color: "text-teal-600",
            bg: "bg-teal-50",
            title: "SMS skickat",
            description: "Påminnelse om behandling",
            time: "2025-01-13 09:00",
            detail: "Automatisk påminnelse 24h innan behandling"
          },
        ].map((activity, index) => (
          <div key={index} className="relative flex gap-3.5">
            {/* Timeline Dot */}
            <div className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${activity.bg} border-2 border-white`}>
              <activity.icon className={`h-3.5 w-3.5 ${activity.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 pb-5">
              <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-[13px] font-semibold text-gray-900">{activity.title}</h4>
                    <p className="text-[12px] text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-[11px] text-gray-500">{activity.time}</span>
                </div>
                {activity.detail && (
                  <p className="mt-2 text-[12px] text-gray-600 bg-gray-50 rounded-lg p-2.5">
                    {activity.detail}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesTabContent({ customerName, notes, onRefresh, onCreateNew }: { customerName: string, notes: NoteData[], onRefresh: () => void, onCreateNew: () => void }) {
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  
  const toggleNoteExpansion = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      kundprofil: "Kundprofil",
      konversation: "Konversation",
      medicinsk: "Medicinsk",
      betalning: "Betalning",
      sla: "SLA/Eskalering",
      intern: "Intern",
      uppfoljning: "Uppföljning",
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      kundprofil: "👤",
      konversation: "💬",
      medicinsk: "🏥",
      betalning: "💰",
      sla: "🚨",
      intern: "🔒",
      uppfoljning: "📅",
    };
    return icons[category] || "📝";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-700 bg-red-100 border-red-300";
      case "medium": return "text-yellow-700 bg-yellow-100 border-yellow-300";
      case "low": return "text-green-700 bg-green-100 border-green-300";
      default: return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return "Okänt datum";
    const date = new Date(timestamp);
    return date.toLocaleString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Anteckningar för {customerName}</h3>
          <p className="text-[10px] text-gray-600 dark:text-gray-400">
            {notes.length} {notes.length === 1 ? "anteckning" : "anteckningar"} sparad
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-[10px] font-semibold hover:bg-gray-200 transition-all"
            title="Uppdatera"
          >
            <RefreshCw className="h-3 w-3" />
            Uppdatera
          </button>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm"
            title="Ny anteckning"
          >
            <Plus className="h-3 w-3" />
            Ny anteckning
          </button>
        </div>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-[11px] text-gray-600 mb-3">Inga anteckningar för {customerName} än</p>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm mx-auto"
          >
            <Plus className="h-3 w-3" />
            Skapa första anteckningen
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => {
            const isExpanded = expandedNotes.has(note.id || "");
            return (
              <div
                key={note.id}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden hover:border-purple-300 dark:hover:border-purple-600 transition-all"
              >
                {/* Note Header */}
                <div className="px-3 py-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-base leading-none">{getCategoryIcon(note.category)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-[10px] font-bold text-gray-900 dark:text-gray-100">
                            {getCategoryLabel(note.category)}
                          </h4>
                          <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold border ${getPriorityColor(note.priority)}`}>
                            {note.priority === "high" ? "🔴 HÖG" : note.priority === "medium" ? "🟡 MEDEL" : "🟢 LÅG"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="h-2.5 w-2.5 text-gray-500 dark:text-gray-400" />
                          <span className="text-[8px] text-gray-600 dark:text-gray-400">
                            {formatDate(note.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleNoteExpansion(note.id || "")}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                        title={isExpanded ? "Dölj" : "Visa mer"}
                      >
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Note Content */}
                <div className="px-3 py-2">
                  <p className={`text-[9px] text-gray-800 dark:text-gray-200 whitespace-pre-wrap ${!isExpanded && "line-clamp-2"}`}>
                    {note.content}
                  </p>

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-[8px] font-medium border border-purple-200 dark:border-purple-700"
                        >
                          <Tag className="h-2 w-2" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Auto-linked items (expanded view) */}
                  {isExpanded && note.autoLinkedTo && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-[8px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                        Kopplad till:
                      </p>
                      <div className="space-y-0.5">
                        {note.autoLinkedTo.customers && note.autoLinkedTo.customers.length > 0 && (
                          <div className="flex items-center gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                            <User className="h-2.5 w-2.5" />
                            <span>{note.autoLinkedTo.customers.join(", ")}</span>
                          </div>
                        )}
                        {note.autoLinkedTo.conversations && note.autoLinkedTo.conversations.length > 0 && (
                          <div className="flex items-center gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                            💬
                            <span>{note.autoLinkedTo.conversations.join(", ")}</span>
                          </div>
                        )}
                        {note.autoLinkedTo.treatments && note.autoLinkedTo.treatments.length > 0 && (
                          <div className="flex items-center gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                            🏥
                            <span>{note.autoLinkedTo.treatments.join(", ")}</span>
                          </div>
                        )}
                        {note.autoLinkedTo.bookings && note.autoLinkedTo.bookings.length > 0 && (
                          <div className="flex items-center gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                            📅
                            <span>{note.autoLinkedTo.bookings.join(", ")}</span>
                          </div>
                        )}
                        {note.autoLinkedTo.teamMembers && note.autoLinkedTo.teamMembers.length > 0 && (
                          <div className="flex items-center gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                            👥
                            <span>{note.autoLinkedTo.teamMembers.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}