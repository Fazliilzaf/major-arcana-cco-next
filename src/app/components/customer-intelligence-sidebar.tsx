import { Star, TrendingUp, Calendar, DollarSign, Shield, Activity, UserCheck, Bell, FileText, Stethoscope, Globe, Mic, MessageSquare, Sparkles, Copy, ChevronDown, Users, Eye, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "./loading-states";
import { EmptyState } from "./empty-states";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  avatar: string;
  unread?: boolean;
  sla?: string;
  slaStatus?: "safe" | "warning" | "breach";
  slaMinutesLeft?: number;
  priority: "sprint" | "critical" | "high" | "normal" | "low";
  icon?: string;
  snoozed?: string;
  warmth?: "cold" | "warm" | "hot";
  lifecycle?: "new" | "active" | "returning" | "dormant";
  intent?: string;
  confidence?: number;
  recommendedAction?: string;
  tags?: string[];
  sentiment?: 'happy' | 'frustrated' | 'neutral' | 'excited' | 'worried';
  isVIP?: boolean;
  revenuePotential?: 'low' | 'medium' | 'high' | 'premium';
  journeyStage?: 'lead' | 'consultation' | 'customer' | 'returning' | 'vip';
  isDuplicate?: boolean;
  duplicateCount?: number;
  timeSinceLastVisit?: string;
  interactionCount?: number;
  conversionProbability?: number;
  referralSource?: 'google' | 'instagram' | 'facebook' | 'referral' | 'direct' | 'tiktok';
  isRead?: boolean;
  isStagnant?: boolean;
  stagnantDays?: number;
  competitorMentioned?: string;
  suggestedReply?: string;
  suggestedSlots?: string[];
  detectedLanguage?: 'sv' | 'en' | 'no' | 'da' | 'de' | 'es' | 'fr';
  upsellOpportunity?: string;
  lifetimeValue?: number;
  needsFollowup?: boolean;
  avgResponseTime?: string;
  bestTimeToReply?: string;
  assignedTo?: string;
  internalNotes?: string[];
  handoffStatus?: 'unassigned' | 'in-progress' | 'waiting' | 'completed';
  churnRisk?: 'low' | 'medium' | 'high';
  treatmentHistory?: string[];
  medicalFlags?: string[];
  consentStatus?: { gdpr: boolean; photos: boolean; marketing: boolean };
  insurance?: string;
  isTyping?: boolean;
  reactions?: string[];
  hasVoiceNote?: boolean;
  slaPrediction?: 'safe' | 'at-risk' | 'will-breach';
}

interface CustomerIntelligenceSidebarProps {
  message: Message | null;
}

type TabType = 'oversikt' | 'ai' | 'medical' | 'team';

export function CustomerIntelligenceSidebar({ message }: CustomerIntelligenceSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('oversikt');
  const [isLoading, setIsLoading] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 border-l border-gray-200">
        <LoadingSpinner size="large" text="Laddar kunddata..." />
      </div>
    );
  }

  // Empty state - Inget meddelande valt
  if (!message) {
    return (
      <div className="flex h-full flex-col bg-white border-l border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h3 className="text-sm font-bold text-gray-700">Kundinfo</h3>
        </div>
        <div className="flex-1">
          <EmptyState
            variant="customer"
            title="Ingen kund vald"
            description="Välj ett meddelande för att se kundinformation"
          />
        </div>
      </div>
    );
  }

  // Helper functions
  const getRevenueBadge = () => {
    if (!message.revenuePotential) return null;
    const revenueMap: Record<string, { label: string; class: string }> = {
      'low': { label: '€', class: 'bg-gray-100 text-gray-600' },
      'medium': { label: '€€', class: 'bg-blue-100 text-blue-700' },
      'high': { label: '€€€', class: 'bg-purple-100 text-purple-700' },
      'premium': { label: '€€€€', class: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800' },
    };
    return revenueMap[message.revenuePotential];
  };

  const getJourneyBadge = () => {
    if (!message.journeyStage) return null;
    const journeyMap: Record<string, { label: string; icon: string; class: string }> = {
      'lead': { label: 'Lead', icon: '🎯', class: 'bg-blue-50 text-blue-700 border-blue-200' },
      'consultation': { label: 'Konsultation', icon: '📋', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      'customer': { label: 'Kund', icon: '✓', class: 'bg-green-50 text-green-700 border-green-200' },
      'returning': { label: 'Återkommande', icon: '🔄', class: 'bg-purple-50 text-purple-700 border-purple-200' },
      'vip': { label: 'VIP', icon: '👑', class: 'bg-amber-50 text-amber-700 border-amber-200' },
    };
    return journeyMap[message.journeyStage];
  };

  const revenueBadge = getRevenueBadge();
  const journeyBadge = getJourneyBadge();

  return (
    <div className="flex h-full flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={message.avatar}
              alt={message.sender}
              className="h-12 w-12 rounded-full border-2 border-white shadow-sm object-cover"
            />
            {message.isVIP && (
              <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white shadow-sm">
                <Star className="h-3.5 w-3.5 text-white fill-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">{message.sender}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {journeyBadge && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${journeyBadge.class}`}>
                  {journeyBadge.icon} {journeyBadge.label}
                </span>
              )}
              {revenueBadge && (
                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${revenueBadge.class}`}>
                  {revenueBadge.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          <button
            onClick={() => setActiveTab('oversikt')}
            className={`flex-1 px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'oversikt'
                ? 'bg-white text-pink-700 border-b-2 border-pink-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Översikt
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'ai'
                ? 'bg-white text-pink-700 border-b-2 border-pink-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🤖 Smart
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`flex-1 px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'medical'
                ? 'bg-white text-pink-700 border-b-2 border-pink-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏥 Medical
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'team'
                ? 'bg-white text-pink-700 border-b-2 border-pink-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👥 Team
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'oversikt' && (
          <div className="p-4 space-y-4">
            {/* Key Metrics */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Nyckeldata</h4>
              
              {/* Lifetime Value */}
              {message.lifetimeValue !== undefined && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-gray-700">Lifetime Value</span>
                  </div>
                  <span className="text-sm font-bold text-purple-700">
                    {message.lifetimeValue.toLocaleString('sv-SE')} kr
                  </span>
                </div>
              )}

              {/* Conversion Probability */}
              {message.conversionProbability !== undefined && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-700">Conversion</span>
                  </div>
                  <span className="text-sm font-bold text-green-700">{message.conversionProbability}%</span>
                </div>
              )}

              {/* Referral Source */}
              {message.referralSource && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">Källa</span>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 capitalize">
                    {message.referralSource === 'instagram' ? '📸 Instagram' :
                     message.referralSource === 'google' ? '🔍 Google' :
                     message.referralSource === 'facebook' ? '👥 Facebook' :
                     message.referralSource === 'referral' ? '🤝 Rekommendation' :
                     message.referralSource === 'tiktok' ? '🎵 TikTok' :
                     '🔗 Direkt'}
                  </span>
                </div>
              )}

              {/* Interaction Count */}
              {message.interactionCount !== undefined && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50 border border-indigo-100">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-medium text-gray-700">Interaktioner</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-700">{message.interactionCount}x</span>
                </div>
              )}

              {/* Time Since Last Visit */}
              {message.timeSinceLastVisit && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-600" />
                    <span className="text-xs font-medium text-gray-700">Senaste besök</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{message.timeSinceLastVisit}</span>
                </div>
              )}

              {/* Response Time */}
              {message.avgResponseTime && message.avgResponseTime !== 'N/A' && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-gray-700">Avg. svarstid</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">{message.avgResponseTime}</span>
                </div>
              )}
            </div>

            {/* Alerts & Warnings */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Varningar</h4>
              
              {/* Churn Risk */}
              {message.churnRisk && message.churnRisk !== 'low' && (
                <div className={`p-2.5 rounded-lg border ${
                  message.churnRisk === 'high' 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className={`h-4 w-4 mt-0.5 ${
                      message.churnRisk === 'high' ? 'text-red-600' : 'text-orange-600'
                    }`} />
                    <div>
                      <div className={`text-xs font-semibold ${
                        message.churnRisk === 'high' ? 'text-red-800' : 'text-orange-800'
                      }`}>
                        {message.churnRisk === 'high' ? 'Hög' : 'Medel'} Churn Risk
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5">
                        Kunden riskerar att lämna
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Competitor Mentioned */}
              {message.competitorMentioned && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-red-600" />
                    <div>
                      <div className="text-xs font-semibold text-red-800">Nämner konkurrent</div>
                      <div className="text-[10px] text-red-600 mt-0.5">{message.competitorMentioned}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Duplicate Detection */}
              {message.isDuplicate && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <Copy className="h-4 w-4 mt-0.5 text-amber-600" />
                    <div>
                      <div className="text-xs font-semibold text-amber-800">Duplicate Email</div>
                      <div className="text-[10px] text-amber-600 mt-0.5">
                        {message.duplicateCount} mail från samma person
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stagnation */}
              {message.isStagnant && (
                <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-orange-600" />
                    <div>
                      <div className="text-xs font-semibold text-orange-800">Konversation stagnerande</div>
                      <div className="text-[10px] text-orange-600 mt-0.5">
                        {message.stagnantDays} dagar inaktiv
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {message.churnRisk === 'low' && !message.competitorMentioned && !message.isDuplicate && !message.isStagnant && (
                <div className="text-center py-4">
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-xs text-gray-500">Inga varningar</div>
                </div>
              )}
            </div>

            {/* Status Indicators */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Status</h4>
              
              <div className="flex items-center gap-2 flex-wrap">
                {message.isRead && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
                    <Eye className="h-3 w-3" />
                    Har läst ditt svar
                  </span>
                )}
                {message.isTyping && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-[10px] font-medium border border-green-200 animate-pulse">
                    <MessageSquare className="h-3 w-3" />
                    Skriver...
                  </span>
                )}
                {message.hasVoiceNote && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-medium border border-purple-200">
                    <Mic className="h-3 w-3" />
                    Röstmemo
                  </span>
                )}
                {message.needsFollowup && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-[10px] font-semibold border border-orange-200">
                    <Bell className="h-3 w-3" />
                    Följ upp
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="p-4 space-y-4">
            {/* AI Suggested Reply */}
            {message.suggestedReply && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Föreslagen Svar</h4>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900 leading-relaxed">{message.suggestedReply}</p>
                  </div>
                  <button
                    onClick={() => toast.success('Svar kopierat till Svarstudio!')}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Kopiera till Svarstudio
                  </button>
                </div>
              </div>
            )}

            {/* Smart Scheduling */}
            {message.suggestedSlots && message.suggestedSlots.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Smart Scheduling</h4>
                <div className="space-y-1.5">
                  {message.suggestedSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => toast.success(`Tid vald: ${slot}`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-800">{slot}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Boka →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upsell Opportunity */}
            {message.upsellOpportunity && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Upsell Möjlighet</h4>
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-900 font-medium leading-relaxed">{message.upsellOpportunity}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Best Time to Reply */}
            {message.bestTimeToReply && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Optimal Svarstid</h4>
                <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-800">{message.bestTimeToReply}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Language Detection */}
            {message.detectedLanguage && message.detectedLanguage !== 'sv' && (
              <div className="p-2.5 rounded-lg bg-cyan-50 border border-cyan-200">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-600" />
                  <div>
                    <div className="text-xs font-semibold text-cyan-800">Språk: {message.detectedLanguage.toUpperCase()}</div>
                    <div className="text-[10px] text-cyan-600">Internationell patient</div>
                  </div>
                </div>
              </div>
            )}

            {!message.suggestedReply && !message.suggestedSlots?.length && !message.upsellOpportunity && (
              <div className="text-center py-8">
                <Sparkles className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Inga smarta insikter än</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="p-4 space-y-4">
            {/* Medical Flags */}
            {message.medicalFlags && message.medicalFlags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-red-700 uppercase tracking-wide flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  Viktiga Medicinska Noteringar
                </h4>
                <div className="space-y-1.5">
                  {message.medicalFlags.map((flag, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-red-50 border-2 border-red-300">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-red-600" />
                        <span className="text-xs font-bold text-red-800">{flag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Treatment History */}
            {message.treatmentHistory && message.treatmentHistory.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Behandlingshistorik</h4>
                <div className="space-y-1">
                  {message.treatmentHistory.map((treatment, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-violet-50 border border-violet-100">
                      <FileText className="h-3.5 w-3.5 text-violet-600" />
                      <span className="text-xs text-violet-800">{treatment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consent Status */}
            {message.consentStatus && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Samtycken</h4>
                <div className="space-y-1.5">
                  <div className={`flex items-center justify-between p-2 rounded-lg border ${
                    message.consentStatus.gdpr 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Shield className={`h-3.5 w-3.5 ${message.consentStatus.gdpr ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="text-xs font-medium text-gray-700">GDPR</span>
                    </div>
                    <span className="text-xs font-bold">{message.consentStatus.gdpr ? '✅' : '❌'}</span>
                  </div>
                  <div className={`flex items-center justify-between p-2 rounded-lg border ${
                    message.consentStatus.photos 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📸</span>
                      <span className="text-xs font-medium text-gray-700">Foto-samtycke</span>
                    </div>
                    <span className="text-xs font-bold">{message.consentStatus.photos ? '✅' : '❌'}</span>
                  </div>
                  <div className={`flex items-center justify-between p-2 rounded-lg border ${
                    message.consentStatus.marketing 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📧</span>
                      <span className="text-xs font-medium text-gray-700">Marknadsföring</span>
                    </div>
                    <span className="text-xs font-bold">{message.consentStatus.marketing ? '✅' : '❌'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Insurance */}
            {message.insurance && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Försäkring</h4>
                <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💼</span>
                    <span className="text-xs font-semibold text-sky-800">{message.insurance}</span>
                  </div>
                </div>
              </div>
            )}

            {(!message.medicalFlags || message.medicalFlags.length === 0) && 
             (!message.treatmentHistory || message.treatmentHistory.length === 0) && (
              <div className="text-center py-8">
                <Stethoscope className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Ingen medicinsk data</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="p-4 space-y-4">
            {/* Assigned To */}
            {message.assignedTo && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Tilldelad</h4>
                <div className="p-3 rounded-lg bg-teal-50 border border-teal-200">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-teal-600" />
                    <span className="text-sm font-bold text-teal-800">{message.assignedTo}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Handoff Status */}
            {message.handoffStatus && message.handoffStatus !== 'unassigned' && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Status</h4>
                <div className={`p-3 rounded-lg border ${
                  message.handoffStatus === 'completed' ? 'bg-green-50 border-green-200' :
                  message.handoffStatus === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                  'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Activity className={`h-5 w-5 ${
                      message.handoffStatus === 'completed' ? 'text-green-600' :
                      message.handoffStatus === 'in-progress' ? 'text-blue-600' :
                      'text-amber-600'
                    }`} />
                    <span className={`text-sm font-bold ${
                      message.handoffStatus === 'completed' ? 'text-green-800' :
                      message.handoffStatus === 'in-progress' ? 'text-blue-800' :
                      'text-amber-800'
                    }`}>
                      {message.handoffStatus === 'in-progress' ? 'Pågår' :
                       message.handoffStatus === 'waiting' ? 'Väntar på svar' :
                       'Klart ✓'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Internal Notes */}
            {message.internalNotes && message.internalNotes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Interna Noteringar</h4>
                <div className="space-y-1.5">
                  {message.internalNotes.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-600 text-sm mt-0.5">📌</span>
                        <p className="text-xs text-yellow-900 leading-relaxed">{note}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => toast.success('Öppnar noter-editor...')}
                  className="w-full px-3 py-1.5 rounded-md bg-yellow-100 text-yellow-800 text-xs font-semibold hover:bg-yellow-200 transition-colors"
                >
                  + Lägg till notering
                </button>
              </div>
            )}

            {/* Team Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Team Reaktioner</h4>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-pink-50 border border-pink-200">
                  {message.reactions.map((reaction, idx) => (
                    <span key={idx} className="text-xl">{reaction}</span>
                  ))}
                </div>
              </div>
            )}

            {!message.assignedTo && (!message.internalNotes || message.internalNotes.length === 0) && (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-3">Ej tilldelad</p>
                <button
                  onClick={() => toast.success('Tilldela till teammedlem...')}
                  className="px-4 py-2 rounded-md bg-teal-100 text-teal-800 text-xs font-semibold hover:bg-teal-200 transition-colors"
                >
                  Tilldela ärende
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
