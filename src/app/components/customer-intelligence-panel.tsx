import { Star, TrendingUp, Clock, AlertTriangle, Target, Activity, Brain, Heart, MessageSquare, Calendar, Pill, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function CustomerIntelligencePanel() {
  const [activeTab, setActiveTab] = useState<"oversikt" | "ai" | "medicin" | "team">("oversikt");
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header - KOMPAKT */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-3 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[9px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            KUNDINTELLIGENS
          </h3>
          <button
            onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isHeaderExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
        </div>

        {/* Customer Header - ULTRA KOMPAKT */}
        {isHeaderExpanded && (
          <div className="space-y-1.5">
            {/* Kund info - HORISONTELL LAYOUT */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center text-[11px] font-bold text-pink-700 dark:text-pink-300 flex-shrink-0">
                AK
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 truncate">Anna Karlsson</h4>
                <div className="flex items-center gap-1 text-[8px] flex-wrap">
                  <span className="text-red-600 dark:text-red-400 font-bold">Agera nu</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-600 dark:text-gray-400">82% engagemang</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-600 dark:text-gray-400">Sara</span>
                </div>
              </div>
            </div>

            {/* Quick stats grid - TÄTARE */}
            <div className="grid grid-cols-2 gap-1.5 text-[8px]">
              {/* LIVSCYKEL */}
              <div>
                <div className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Livscykel
                </div>
                <div className="text-gray-900 dark:text-gray-100">
                  Återbesök väntar
                </div>
              </div>

              {/* VÄNTAR PÅ */}
              <div>
                <div className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Väntar på
                </div>
                <div className="text-gray-900 dark:text-gray-100">
                  Redo att boka nu
                </div>
              </div>

              {/* ÄGARE */}
              <div>
                <div className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Ägare
                </div>
                <div className="text-gray-900 dark:text-gray-100">
                  Sara
                </div>
              </div>

              {/* UPPFÖLJNING */}
              <div>
                <div className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Uppföljning
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  Idag 15:15
                </div>
              </div>

              {/* BOKNINGSLÄGE */}
              <div>
                <div className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Status
                </div>
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  Kan erbjudas
                </div>
              </div>

              {/* RISK */}
              <div>
                <div className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Risk
                </div>
                <div className="text-orange-600 dark:text-orange-400 font-semibold">
                  Bevaka
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ⚡ VARFÖR I FOKUS - AI INSIGHT */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-3 py-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <h4 className="text-[10px] font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <span className="text-[14px]">⚡</span>
          VARFÖR I FOKUS
        </h4>
        <p className="text-[10px] text-amber-900 dark:text-amber-200 leading-relaxed">
          SLA är bruten och kunden behöver besked senast idag 15:15. Kunden måste få två konkreta 
          ombokningsalternativ nu för att rädda morgondagens behandling och bibehålla förtroendet.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 flex">
        {[
          { id: "oversikt" as const, label: "Översikt" },
          { id: "ai" as const, label: "AI" },
          { id: "medicin" as const, label: "Medicin" },
          { id: "team" as const, label: "Team" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-1.5 text-[9px] font-bold transition-all ${
              activeTab === tab.id
                ? "text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {activeTab === "oversikt" && (
          <>
            {/* Trender & Patterns */}
            <div className="rounded-lg border border-purple-200 dark:border-purple-700 p-2 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                <h5 className="text-[9px] font-bold text-purple-900 dark:text-purple-100 uppercase tracking-wide">
                  Trender & Patterns
                </h5>
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-start gap-1.5">
                  <span className="text-purple-700 dark:text-purple-300">📈</span>
                  <span className="text-purple-800 dark:text-purple-200">Bokningsfrekvens har ökat med 30% senaste kvartalet</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-purple-700 dark:text-purple-300">⏰</span>
                  <span className="text-purple-800 dark:text-purple-200">Föredrar morgontider (09:00-12:00) på fredagar</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-purple-700 dark:text-purple-300">👨‍⚕️</span>
                  <span className="text-purple-800 dark:text-purple-200">Konsekvent väljer Dr. Eriksson (+8 bokningar)</span>
                </div>
              </div>
            </div>

            {/* Kommunikationshistorik */}
            <div className="rounded-lg border border-blue-200 dark:border-blue-700 p-2 bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <h5 className="text-[9px] font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wide">
                  Kommunikationshistorik
                </h5>
              </div>
              <div className="space-y-2">
                <div className="rounded bg-white dark:bg-gray-800 p-1.5 text-[10px]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Senaste interaktion</span>
                    <span className="text-gray-500 dark:text-gray-400">2 tim sedan</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-[9px]">
                    "Fredag kl 09:00 passar perfekt! Tack för flexibiliteten."
                  </p>
                </div>
                <div className="rounded bg-white dark:bg-gray-800 p-1.5 text-[10px]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Föregående</span>
                    <span className="text-gray-500 dark:text-gray-400">5 dagar sedan</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-[9px]">
                    Frågade om PRP-behandling och priser
                  </p>
                </div>
                <div className="text-[9px] text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Svarstid genomsnitt:</span> 2.4 timmar
                  <br />
                  <span className="font-semibold">Prefererad kanal:</span> E-post (78%)
                </div>
              </div>
            </div>

            {/* AI-genererade insikter */}
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-700 p-2 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <div className="flex items-center gap-1.5 mb-2">
                <Brain className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <h5 className="text-[9px] font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-wide">
                  AI-insikter
                </h5>
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="rounded bg-white dark:bg-gray-800 p-1.5">
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-0.5">Next Best Action</p>
                  <p className="text-emerald-800 dark:text-emerald-200 text-[9px]">
                    Skicka bokningsförslag för PRP fredag 09:00. Sannolikhet för accept: 92%
                  </p>
                </div>
                <div className="rounded bg-white dark:bg-gray-800 p-1.5">
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-0.5">Upsell-möjlighet</p>
                  <p className="text-emerald-800 dark:text-emerald-200 text-[9px]">
                    Kunden har visat intresse för PRP + Microneedling-paket (spara 15%)
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "ai" && (
          <>
            {/* AI Tab Content */}
            <div className="rounded-lg border border-indigo-200 dark:border-indigo-700 p-2 bg-indigo-50/50 dark:bg-indigo-950/20">
              <div className="flex items-center gap-1.5 mb-2">
                <Brain className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                <h5 className="text-[9px] font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-wide">
                  AI-analys & Prediktioner
                </h5>
              </div>
              <div className="space-y-2 text-[10px]">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Sentiment-utveckling</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '87%' }}></div>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">87%</span>
                  </div>
                  <p className="text-[9px] text-gray-600 dark:text-gray-400 mt-0.5">Positiv trend ↗️</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Churn Risk Score</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-bold">Låg</span>
                  </div>
                  <p className="text-[9px] text-gray-600 dark:text-gray-400 mt-0.5">Fortsatt hög engagemang</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Rekommenderad ton</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 text-[9px] font-medium">
                      Varm
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[9px] font-medium">
                      Professionell
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-[9px] font-medium">
                      Lösningsfokuserad
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "medicin" && (
          <>
            {/* Medicinsk Information */}
            <div className="rounded-lg border border-red-200 dark:border-red-700 p-2 bg-red-50/50 dark:bg-red-950/20">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                <h5 className="text-[9px] font-bold text-red-900 dark:text-red-100 uppercase tracking-wide">
                  Allergier & Kontraindikationer
                </h5>
              </div>
              <p className="text-[10px] text-red-800 dark:text-red-200">
                ✅ Inga kända allergier registrerade
              </p>
            </div>

            <div className="rounded-lg border border-teal-200 dark:border-teal-700 p-2 bg-teal-50/50 dark:bg-teal-950/20">
              <div className="flex items-center gap-1.5 mb-2">
                <Pill className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                <h5 className="text-[9px] font-bold text-teal-900 dark:text-teal-100 uppercase tracking-wide">
                  Tidigare behandlingar
                </h5>
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-start justify-between rounded bg-white dark:bg-gray-800 p-1.5">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">DHI Hårtransplantation</p>
                    <p className="text-[9px] text-gray-600 dark:text-gray-400">2000 grafts</p>
                  </div>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400">6 mån sedan</span>
                </div>
                <div className="flex items-start justify-between rounded bg-white dark:bg-gray-800 p-1.5">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">PRP-behandling</p>
                    <p className="text-[9px] text-gray-600 dark:text-gray-400">Serie 1 av 3</p>
                  </div>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400">3 mån sedan</span>
                </div>
                <div className="flex items-start justify-between rounded bg-white dark:bg-gray-800 p-1.5">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Konsultation</p>
                    <p className="text-[9px] text-gray-600 dark:text-gray-400">Initial bedömning</p>
                  </div>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400">12 mån sedan</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 dark:border-amber-700 p-2 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-1.5 mb-2">
                <Heart className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                <h5 className="text-[9px] font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wide">
                  Behandlingsplan
                </h5>
              </div>
              <p className="text-[10px] text-amber-800 dark:text-amber-200 leading-relaxed">
                Kunden är mitt i PRP-serie (1/3 genomförd). Rekommenderad uppföljning: PRP behandling 2 & 3 med 4-6 veckors mellanrum.
              </p>
            </div>
          </>
        )}

        {activeTab === "team" && (
          <>
            {/* Team Notes */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                <h5 className="text-[9px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  Team-anteckningar
                </h5>
              </div>
              <div className="space-y-2 text-[10px]">
                <div className="rounded bg-white dark:bg-gray-800 p-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Sara</span>
                    <span className="text-[9px] text-gray-500 dark:text-gray-400">Igår 14:30</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-[9px]">
                    Kunden är mycket nöjd med DHI-resultatet. Vill fortsätta med PRP för optimal växt.
                  </p>
                </div>
                <div className="rounded bg-white dark:bg-gray-800 p-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Dr. Eriksson</span>
                    <span className="text-[9px] text-gray-500 dark:text-gray-400">3 dagar sedan</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-[9px]">
                    Behandlingen gick utmärkt. Grafterna läker väl. Nästa PRP om 3-4 veckor.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 dark:border-blue-700 p-2 bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <h5 className="text-[9px] font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wide">
                  Delegerad till
                </h5>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center text-[9px] font-bold text-pink-700 dark:text-pink-300">
                  SL
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">Sara Lindberg</p>
                  <p className="text-[9px] text-gray-600 dark:text-gray-400">Kundansvarig</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}