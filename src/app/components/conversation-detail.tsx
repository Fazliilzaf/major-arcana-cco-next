import { MoreHorizontal, Calendar, User, FileText, ShoppingBag, DollarSign, TrendingUp, Mail, Phone, MessageSquare, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "./empty-states";
import { LoadingSpinner } from "./loading-states";
import { showSafeDeleteToast } from "./safe-delete-toast";

type TabType = "konversation" | "kundhistorik" | "historik";

export function ConversationDetail() {
  const [activeTab, setActiveTab] = useState<TabType>("konversation");
  const [isLoading, setIsLoading] = useState(false);
  const [hasConversation, setHasConversation] = useState(true);

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

  const handleDeleteMessage = (messageId: string, senderName: string) => {
    showSafeDeleteToast({
      itemName: `Meddelande från ${senderName}`,
      onUndo: () => {
        toast.success(`Återställde meddelande från ${senderName}`);
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <h2 className="text-[16px] font-semibold text-gray-900">Laddar...</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="large" text="Laddar konversation..." />
        </div>
      </div>
    );
  }

  // Empty state - Ingen konversation vald
  if (!hasConversation) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <h2 className="text-[16px] font-semibold text-gray-900">Konversation</h2>
        </div>
        <div className="flex-1">
          <EmptyState
            variant="conversation"
            title="Ingen konversation vald"
            description="Välj ett meddelande från inkorgen för att se konversationen"
          />
        </div>
      </div>
    );
  }

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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "konversation" && <ConversationContent handleMessageOptions={handleMessageOptions} />}
        {activeTab === "kundhistorik" && <CustomerHistoryContent />}
        {activeTab === "historik" && <ActivityHistoryContent />}
      </div>
    </div>
  );
}

function ConversationContent({ handleMessageOptions }: { handleMessageOptions: () => void }) {
  const handleDeleteMessage = (senderName: string) => {
    showSafeDeleteToast({
      itemName: `Meddelande från ${senderName}`,
      onUndo: () => {
        toast.success(`Återställde meddelande från ${senderName}`);
      },
    });
  };

  return (
    <div className="p-6">
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
                className="h-11 w-11 rounded-full border border-gray-100 object-cover shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-gray-900">Johan Lagerström</h3>
                    <span className="text-[13px] text-gray-500">· 2026-04-22 · 11:08</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleDeleteMessage("Johan Lagerström")}
                      className="rounded-lg p-1.5 hover:bg-red-50 transition-colors group"
                      title="Radera meddelande"
                    >
                      <Trash2 className="h-[16px] w-[16px] text-gray-400 group-hover:text-red-600" />
                    </button>
                    <button 
                      onClick={handleMessageOptions}
                      className="rounded-lg p-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <MoreHorizontal className="h-[18px] w-[18px] text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* SLA and Metadata */}
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-900">
                    SLA Th
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-800 text-[9px] font-bold text-white">
                      •
                    </span>
                    Hög
                  </span>
                </div>
                
                <div className="mt-2 text-[12px] text-gray-600">
                  Intent: Bokning • Väntar på oss • Sant obesvarat • Kund sedan 2023
                </div>

                <div className="mt-3 rounded-xl bg-gray-50/80 border border-gray-100 p-4">
                  <p className="text-[14px] leading-relaxed text-gray-700">Hej,</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-gray-700">
                    Jag vill boka in en PrP-behandling. Jag är tillgänglig på fredag, gärna kl <span className="font-semibold">09:00</span>, alternativt måndag kl <span className="font-semibold">15:30</span>. Hör gärna av er med nästa lediga tid!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message 2 - Staff */}
        <div className="relative mb-6 flex gap-3">
          {/* Timeline Dot */}
          <div className="relative z-10 flex-shrink-0">
            <div className="h-2 w-2 rounded-full bg-rose-300 ring-4 ring-white" style={{ marginTop: '20px' }} />
          </div>

          <div className="flex-1">
            <div className="mb-2 flex items-start gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                alt="Egzona Krasniqi"
                className="h-11 w-11 rounded-full border border-gray-100 object-cover shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-gray-900">Egzona Krasniqi</h3>
                    <span className="text-[13px] text-gray-500">· 2026-04-22 · 11:32</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleDeleteMessage("Egzona Krasniqi")}
                      className="rounded-lg p-1.5 hover:bg-red-50 transition-colors group"
                      title="Radera meddelande"
                    >
                      <Trash2 className="h-[16px] w-[16px] text-gray-400 group-hover:text-red-600" />
                    </button>
                    <button 
                      onClick={handleMessageOptions}
                      className="rounded-lg p-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <MoreHorizontal className="h-[18px] w-[18px] text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-gray-50/80 border border-gray-100 p-4">
                  <p className="text-[14px] leading-relaxed text-gray-700">Hej Johan,</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-gray-700">
                    Du kan träffa oss fredag kl <span className="font-semibold">09:00</span> eller måndag kl <span className="font-semibold">15:30</span>. Bekräfta gärna så uppdaterar jag vår kalender.
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-gray-700">Vänliga hälsningar,</p>
                  <p className="text-[14px] leading-relaxed text-gray-700">Egzona · Hair TP Clinic</p>
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
          <div className="relative bg-white px-4 text-[13px] font-medium text-gray-600">
            Senaste meddelande
          </div>
        </div>

        {/* Message 3 - Latest Customer Reply */}
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
                className="h-11 w-11 rounded-full border border-gray-100 object-cover shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-semibold text-gray-900">Johan Lagerström</h3>
                  <span className="text-[13px] text-gray-500">· Idag 10:58</span>
                </div>

                <div className="mt-3 rounded-xl bg-gray-50/80 border border-gray-100 p-4">
                  <p className="text-[14px] leading-relaxed text-gray-700">
                    Fredag kl <span className="font-semibold">09:00</span> passar perfekt. Jag ser fram emot det! 🙏
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
        <div className="flex items-center gap-2 text-[13px] text-gray-700">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Tidigare bokningar (3)</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-gray-700">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Senaste behandling: 2025-01-14</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-gray-700">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Kund sedan: 2023</span>
        </div>
        <button 
          onClick={() => toast.info("Mer information")}
          className="ml-auto rounded-lg p-1 hover:bg-gray-100 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

function CustomerHistoryContent() {
  return (
    <div className="p-6">
      {/* Customer Profile */}
      <div className="mb-6 flex items-start gap-4">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
          alt="Johan Lagerström"
          className="h-16 w-16 rounded-full border border-gray-100 object-cover shadow-sm"
        />
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold text-gray-900">Johan Lagerström</h3>
          <p className="text-[14px] text-gray-600">johan.lagerstrom@email.com</p>
          <p className="text-[14px] text-gray-600">+46 70 123 45 67</p>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50 to-blue-50/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <span className="text-[13px] font-medium text-gray-600">Totalt köp</span>
          </div>
          <p className="text-[24px] font-bold text-gray-900">12</p>
          <p className="text-[12px] text-gray-500">Behandlingar</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-green-50 to-green-50/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-[13px] font-medium text-gray-600">LTV</span>
          </div>
          <p className="text-[24px] font-bold text-gray-900">46 000 kr</p>
          <p className="text-[12px] text-gray-500">Livstidsvärde</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-purple-50 to-purple-50/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-[13px] font-medium text-gray-600">Status</span>
          </div>
          <p className="text-[24px] font-bold text-gray-900">VIP</p>
          <p className="text-[12px] text-gray-500">Återkommande</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50/50 p-5">
        <h4 className="mb-4 text-[15px] font-semibold text-gray-900">Kundinformation</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-[13px] font-medium text-gray-600">Kund sedan</p>
              <p className="text-[14px] text-gray-900">Mars 2023 (3 år)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-[13px] font-medium text-gray-600">Relation</p>
              <p className="text-[14px] text-gray-900">Återkommande kund · Mycket lojal</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-4 w-4 rounded-full bg-amber-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-[13px] font-medium text-gray-600">Temperatur</p>
              <p className="text-[14px] text-gray-900">Varm · Aktivt engagerad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div>
        <h4 className="mb-4 text-[15px] font-semibold text-gray-900">Tidigare bokningar</h4>
        <div className="space-y-3">
          {[
            { date: "2025-01-14", treatment: "PrP behandling", price: "4 500 kr", status: "Genomförd" },
            { date: "2024-11-02", treatment: "Konsultation", price: "500 kr", status: "Genomförd" },
            { date: "2024-08-18", treatment: "Hårtransplantation följd", price: "0 kr", status: "Genomförd" },
            { date: "2024-03-22", treatment: "PrP behandling", price: "4 500 kr", status: "Genomförd" },
          ].map((booking, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-[14px] font-medium text-gray-900">{booking.treatment}</p>
                  <p className="text-[13px] text-gray-500">{booking.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-semibold text-gray-900">{booking.price}</p>
                <p className="text-[12px] text-green-600">{booking.status}</p>
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
    <div className="p-6">
      <h3 className="mb-4 text-[18px] font-semibold text-gray-900">Aktivitetshistorik</h3>
      <p className="mb-6 text-[14px] text-gray-600">
        Fullständig logg över all kommunikation och aktivitet med Johan Lagerström
      </p>

      {/* Timeline */}
      <div className="relative space-y-6">
        {/* Timeline Line */}
        <div className="absolute left-[18px] top-4 bottom-4 w-[2px] bg-gray-200" />

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
          <div key={index} className="relative flex gap-4">
            {/* Timeline Dot */}
            <div className={`relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${activity.bg} border-2 border-white`}>
              <activity.icon className={`h-4 w-4 ${activity.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900">{activity.title}</h4>
                    <p className="text-[13px] text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-[12px] text-gray-500">{activity.time}</span>
                </div>
                {activity.detail && (
                  <p className="mt-2 text-[13px] text-gray-600 bg-gray-50 rounded-lg p-3">
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