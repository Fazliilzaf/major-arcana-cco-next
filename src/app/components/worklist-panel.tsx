import { useState } from "react";
import { Zap, Filter, LayoutGrid, List, CheckSquare, ChevronDown, ChevronRight } from "lucide-react";
import { MinimalMessageItem } from "./minimal-message-item";

interface WorklistPanelProps {
  selectedMessage: string | null;
  onSelectMessage: (id: string) => void;
}

export function WorklistPanel({ selectedMessage, onSelectMessage }: WorklistPanelProps) {
  const [activeTab, setActiveTab] = useState<"beslut" | "ägare">("beslut");
  const [activeView, setActiveView] = useState("alla");
  const [activeFollowUp, setActiveFollowUp] = useState("alla-uppfoljningar");
  const [listMode, setListMode] = useState("normal");
  
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    savedViews: true,
    followUp: true,
    listMode: true,
    sprint: true,
    actNow: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock data
  const messages = [
    {
      id: "1",
      sender: "Anna Karlsson",
      subject: "Akut ombokning idag",
      preview: "Måste tyvärr ställa in imorgon...",
      time: "11:42",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      unread: true,
      sla: "1h",
      slaStatus: "breach" as const,
      priority: "sprint" as const,
      warmth: "hot" as const,
      intent: "Omboka",
      sentiment: "worried" as const,
      isVIP: true,
      receivedAt: "contact@",
    },
    {
      id: "2",
      sender: "Erik Johansson",
      subject: "Bokningsfråga fillers",
      preview: "Hej, jag undrar över priser...",
      time: "10:15",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      unread: true,
      sla: "2h",
      slaStatus: "warning" as const,
      priority: "sprint" as const,
      warmth: "warm" as const,
      intent: "Bokning",
      sentiment: "excited" as const,
      isVIP: false,
      receivedAt: "bokning@",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="px-3 py-2 flex items-center justify-between">
          <h2 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            ARBETSLISTA <span className="text-pink-600">(7)</span>
          </h2>
        </div>

        {/* Tabs: Beslutsvy / Ägarvy */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("beslut")}
            className={`flex-1 px-3 py-1.5 text-[10px] font-bold transition-all ${
              activeTab === "beslut"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Beslutsvy
          </button>
          <button
            onClick={() => setActiveTab("ägare")}
            className={`flex-1 px-3 py-1.5 text-[10px] font-bold transition-all ${
              activeTab === "ägare"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Ägarvy
          </button>
        </div>
      </div>

      {/* SPARADE VYER - COLLAPSIBLE */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => toggleSection('savedViews')}
          className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <h3 className="text-[9px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            SPARADE VYER
          </h3>
          {expandedSections.savedViews ? (
            <ChevronDown className="h-3 w-3 text-gray-500" />
          ) : (
            <ChevronRight className="h-3 w-3 text-gray-500" />
          )}
        </button>
        
        {expandedSections.savedViews && (
          <div className="px-3 pb-2">
            <div className="flex flex-wrap gap-1">
              {[
                { id: "alla", label: "Alla", count: 7 },
                { id: "oagda", label: "Oågda", count: 1 },
                { id: "bokningsbara", label: "Bokningsbara", count: 2 },
                { id: "hog-risk", label: "Hög risk", count: 2 },
                { id: "vantar-svar", label: "Väntar svar", count: 2 },
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`px-2 py-0.5 rounded text-[9px] font-medium transition-all ${
                    activeView === view.id
                      ? "bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-700"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {view.label} {view.count}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOLLOW-UP - COLLAPSIBLE */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => toggleSection('followUp')}
          className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <h3 className="text-[9px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            UPPFÖLJNING
          </h3>
          {expandedSections.followUp ? (
            <ChevronDown className="h-3 w-3 text-gray-500" />
          ) : (
            <ChevronRight className="h-3 w-3 text-gray-500" />
          )}
        </button>
        
        {expandedSections.followUp && (
          <div className="px-3 pb-2">
            <div className="flex flex-wrap gap-1">
              {[
                { id: "alla-uppfoljningar", label: "Alla uppföljningar", count: 7 },
                { id: "forfallen", label: "Förfallen", count: 0 },
                { id: "idag", label: "Idag", count: 5 },
                { id: "imorgon", label: "Imorgon", count: 1 },
                { id: "vantar-svar-fu", label: "Väntar svar", count: 2 },
              ].map((fu) => (
                <button
                  key={fu.id}
                  onClick={() => setActiveFollowUp(fu.id)}
                  className={`px-2 py-0.5 rounded text-[9px] font-medium transition-all ${
                    activeFollowUp === fu.id
                      ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {fu.label} {fu.count}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LISTLÄGE - COLLAPSIBLE */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => toggleSection('listMode')}
          className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <h3 className="text-[9px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            LISTLÄGE
          </h3>
          {expandedSections.listMode ? (
            <ChevronDown className="h-3 w-3 text-gray-500" />
          ) : (
            <ChevronRight className="h-3 w-3 text-gray-500" />
          )}
        </button>
        
        {expandedSections.listMode && (
          <div className="px-3 pb-2">
            <div className="flex items-center gap-1">
              {[
                { id: "normal", label: "Normal" },
                { id: "kompakt", label: "Kompakt" },
                { id: "progressiv", label: "Progressiv" },
                { id: "oppen", label: "Öppen" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setListMode(mode.id)}
                  className={`px-2 py-0.5 rounded text-[9px] font-medium transition-all ${
                    listMode === mode.id
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <button className="mt-1.5 px-2 py-0.5 rounded text-[9px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1">
              <CheckSquare className="h-2.5 w-2.5" />
              Markera flera
            </button>
          </div>
        )}
      </div>

      {/* SPRINT BOX - COLLAPSIBLE */}
      {expandedSections.sprint && (
        <div className="mx-3 my-2 p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
          <button
            onClick={() => toggleSection('sprint')}
            className="w-full flex items-center justify-between mb-1"
          >
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-[10px] font-bold text-emerald-900 dark:text-emerald-100 uppercase">
                SPRINT - AGERA NU (2)
              </h3>
            </div>
            <ChevronDown className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          </button>
          <p className="text-[9px] text-emerald-700 dark:text-emerald-300 leading-tight">
            STARTA MED SLA-RISK, OÅGDA TRÅDAR OCH DAGENS OMBOKNINGAR
          </p>
        </div>
      )}

      {!expandedSections.sprint && (
        <button
          onClick={() => toggleSection('sprint')}
          className="mx-3 my-2 p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-[10px] font-bold text-emerald-900 dark:text-emerald-100 uppercase">
                SPRINT - AGERA NU (2)
              </h3>
            </div>
            <ChevronRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          </div>
        </button>
      )}

      {/* AGERA NU - Message List - COLLAPSIBLE */}
      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => toggleSection('actNow')}
          className="w-full px-3 py-1.5 bg-red-50 dark:bg-red-950/30 border-y border-red-200 dark:border-red-800 flex items-center justify-between hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
        >
          <h3 className="text-[9px] font-bold text-red-900 dark:text-red-100 uppercase tracking-wide">
            AGERA NU (2)
          </h3>
          {expandedSections.actNow ? (
            <ChevronDown className="h-3 w-3 text-red-600" />
          ) : (
            <ChevronRight className="h-3 w-3 text-red-600" />
          )}
        </button>

        {expandedSections.actNow && messages.map((message) => (
          <MinimalMessageItem
            key={message.id}
            message={message}
            isSelected={selectedMessage === message.id}
            onClick={() => onSelectMessage(message.id)}
            showReceivedAt={true}
          />
        ))}
      </div>
    </div>
  );
}