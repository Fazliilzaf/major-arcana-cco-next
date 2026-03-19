import { Star, TrendingUp, Calendar, DollarSign, Activity, Target, History, Lightbulb, FileText, Sparkles, Clock, AlertTriangle, CheckCircle, Users, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/language-context';

interface Message {
  sender: string;
  subject: string;
  avatar: string;
  isVIP?: boolean;
  sentiment?: 'happy' | 'frustrated' | 'neutral' | 'excited' | 'worried';
  revenuePotential?: 'low' | 'medium' | 'high' | 'premium';
  journeyStage?: 'lead' | 'consultation' | 'customer' | 'returning' | 'vip';
  lifetimeValue?: number;
  conversionProbability?: number;
  churnRisk?: 'low' | 'medium' | 'high';
  treatmentHistory?: string[];
  suggestedReply?: string;
  upsellOpportunity?: string;
  recommendedAction?: string;
  assignedTo?: string;
  internalNotes?: string[];
  medicalFlags?: string[];
  consentStatus?: { gdpr: boolean; photos: boolean; marketing: boolean };
  timeSinceLastVisit?: string;
  interactionCount?: number;
}

interface CustomerPanelTabsProps {
  message: Message | null;
}

type TabType = 'overview' | 'journey' | 'insights' | 'details';

export function CustomerPanelTabs({ message }: CustomerPanelTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { t } = useLanguage();

  if (!message) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">{t('customer.selectConversation')}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: t('customer.overview'), icon: Target },
    { id: 'journey' as const, label: t('customer.journey'), icon: History },
    { id: 'insights' as const, label: t('customer.insights'), icon: Lightbulb },
    { id: 'details' as const, label: t('customer.details'), icon: FileText },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header with tabs */}
      <div className="border-b border-gray-200">
        {/* Customer Header - KOMPAKT */}
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={message.avatar}
                alt={message.sender}
                className="h-8 w-8 rounded-full object-cover"
              />
              {message.isVIP && (
                <div className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 border-white">
                  <Star className="h-2 w-2 text-white fill-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[11px] font-bold text-gray-900 truncate">{message.sender}</h3>
              <p className="text-[9px] text-gray-600 capitalize">{message.journeyStage || 'Customer'}</p>
            </div>
          </div>
        </div>

        {/* Tabs - KOMPAKTA */}
        <div className="flex items-center px-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2 py-1.5 text-[10px] font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && <OverviewTab message={message} />}
        {activeTab === 'journey' && <JourneyTab message={message} />}
        {activeTab === 'insights' && <InsightsTab message={message} />}
        {activeTab === 'details' && <DetailsTab message={message} />}
      </div>
    </div>
  );
}

// Overview Tab - Top 3 viktigaste insights + Quick actions
function OverviewTab({ message }: { message: Message }) {
  return (
    <div className="p-3 space-y-3">
      {/* Quick Stats - KOMPAKT 2x2 GRID */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={DollarSign}
          label="Lifetime Value"
          value={`${message.lifetimeValue?.toLocaleString() || 0} kr`}
          color="green"
        />
        <StatCard
          icon={Activity}
          label="Engagement"
          value={`${message.conversionProbability || 0}%`}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Potential"
          value={message.revenuePotential || 'medium'}
          color="purple"
          capitalize
        />
        <StatCard
          icon={AlertTriangle}
          label="Churn Risk"
          value={message.churnRisk || 'low'}
          color={message.churnRisk === 'high' ? 'red' : message.churnRisk === 'medium' ? 'amber' : 'green'}
          capitalize
        />
      </div>

      {/* Top Insights - KOMPAKT */}
      <div>
        <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
          🔥 Top Insights
        </h4>
        <div className="space-y-1.5">
          {message.churnRisk === 'high' && (
            <InsightCard
              type="warning"
              title="High Churn Risk"
              description="Customer hasn't engaged in 30 days. Consider outreach."
            />
          )}
          {message.upsellOpportunity && (
            <InsightCard
              type="opportunity"
              title="Upsell Opportunity"
              description={message.upsellOpportunity}
            />
          )}
          {message.conversionProbability && message.conversionProbability > 80 && (
            <InsightCard
              type="success"
              title="High Conversion Probability"
              description={`${message.conversionProbability}% likely to convert. Great timing for offer!`}
            />
          )}
        </div>
      </div>

      {/* Quick Actions - KOMPAKT */}
      <div>
        <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
          ⚡ Quick Actions
        </h4>
        <div className="space-y-1.5">
          <QuickActionButton icon={Mail} label="Send Follow-up" />
          <QuickActionButton icon={Calendar} label="Schedule Call" />
          <QuickActionButton icon={Star} label="Mark as VIP" />
        </div>
      </div>
    </div>
  );
}

// Journey Tab - Timeline + History - KOMPAKT
function JourneyTab({ message }: { message: Message }) {
  const timeline = [
    { date: '2024-03-16', event: 'Conversation started', type: 'message', icon: Mail },
    { date: '2024-03-10', event: 'Booking completed', type: 'success', icon: CheckCircle },
    { date: '2024-03-05', event: 'Initial consultation', type: 'milestone', icon: Calendar },
    { date: '2024-02-28', event: 'First contact', type: 'start', icon: Users },
  ];

  return (
    <div className="p-3 space-y-3">
      {/* Customer Journey Stage - KOMPAKT */}
      <div>
        <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
          Customer Journey
        </h4>
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-md border border-purple-200">
          <span className="text-[10px] font-semibold text-purple-900 capitalize">
            {message.journeyStage || 'Customer'}
          </span>
          <span className="text-[9px] text-purple-700">Stage 3/5</span>
        </div>
      </div>

      {/* Timeline - KOMPAKT */}
      <div>
        <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
          Activity Timeline
        </h4>
        <div className="space-y-2">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.type === 'success' ? 'bg-green-100' :
                  item.type === 'milestone' ? 'bg-blue-100' :
                  item.type === 'start' ? 'bg-purple-100' :
                  'bg-gray-100'
                }`}>
                  <item.icon className={`h-2.5 w-2.5 ${
                    item.type === 'success' ? 'text-green-600' :
                    item.type === 'milestone' ? 'text-blue-600' :
                    item.type === 'start' ? 'text-purple-600' :
                    'text-gray-600'
                  }`} />
                </div>
                {i < timeline.length - 1 && (
                  <div className="w-0.5 h-4 bg-gray-200 my-0.5" />
                )}
              </div>
              <div className="flex-1 pb-2">
                <p className="text-[10px] font-semibold text-gray-900">{item.event}</p>
                <p className="text-[9px] text-gray-600">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment History - KOMPAKT */}
      {message.treatmentHistory && message.treatmentHistory.length > 0 && (
        <div>
          <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
            Treatment History
          </h4>
          <div className="space-y-1">
            {message.treatmentHistory.map((treatment, i) => (
              <div key={i} className="px-2 py-1 bg-gray-50 rounded-md text-[9px] text-gray-700">
                {treatment}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Insights Tab - AI recommendations - KOMPAKT
function InsightsTab({ message }: { message: Message }) {
  return (
    <div className="p-3 space-y-3">
      {/* AI Recommended Action - KOMPAKT */}
      {message.recommendedAction && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-md p-2">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[10px] font-bold text-purple-900 mb-0.5">AI Recommended Action</h4>
              <p className="text-[9px] text-purple-800">{message.recommendedAction}</p>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Reply - KOMPAKT */}
      {message.suggestedReply && (
        <div>
          <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
            💬 Suggested Reply
          </h4>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
            <p className="text-[9px] text-gray-900 mb-2">{message.suggestedReply}</p>
            <button className="w-full px-2 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-md text-[9px] font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
              Use This Reply
            </button>
          </div>
        </div>
      )}

      {/* Upsell Opportunity - KOMPAKT */}
      {message.upsellOpportunity && (
        <div>
          <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
            💰 Upsell Opportunity
          </h4>
          <div className="bg-green-50 border border-green-200 rounded-md p-2">
            <p className="text-[9px] text-gray-900">{message.upsellOpportunity}</p>
          </div>
        </div>
      )}

      {/* Behavioral Insights - KOMPAKT */}
      <div>
        <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
          🧠 Behavioral Insights
        </h4>
        <div className="space-y-1">
          <InsightRow label="Avg Response Time" value="< 2 hours" />
          <InsightRow label="Preferred Channel" value="Email" />
          <InsightRow label="Best Time to Reply" value="18:00 - 20:00" />
          <InsightRow label="Engagement Score" value={`${message.conversionProbability || 0}%`} />
        </div>
      </div>
    </div>
  );
}

// Details Tab - Full data - KOMPAKT
function DetailsTab({ message }: { message: Message }) {
  return (
    <div className="p-3 space-y-3">
      {/* Contact Information - KOMPAKT */}
      <div>
        <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
          Contact Information
        </h4>
        <div className="space-y-1">
          <DetailRow icon={Mail} label="Email" value="customer@example.com" />
          <DetailRow icon={Phone} label="Phone" value="+46 70 123 45 67" />
          <DetailRow icon={MapPin} label="Location" value="Stockholm, Sweden" />
        </div>
      </div>

      {/* Medical Flags - KOMPAKT */}
      {message.medicalFlags && message.medicalFlags.length > 0 && (
        <div>
          <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
            ⚕️ Medical Flags
          </h4>
          <div className="space-y-1">
            {message.medicalFlags.map((flag, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-200 rounded-md">
                <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0" />
                <span className="text-[9px] text-red-900 truncate">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consent Status - KOMPAKT */}
      {message.consentStatus && (
        <div>
          <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
            Consent Status
          </h4>
          <div className="space-y-1">
            <ConsentRow label="GDPR" value={message.consentStatus.gdpr} />
            <ConsentRow label="Photo Usage" value={message.consentStatus.photos} />
            <ConsentRow label="Marketing" value={message.consentStatus.marketing} />
          </div>
        </div>
      )}

      {/* Internal Notes - KOMPAKT */}
      {message.internalNotes && message.internalNotes.length > 0 && (
        <div>
          <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
            📝 Internal Notes
          </h4>
          <div className="space-y-1">
            {message.internalNotes.map((note, i) => (
              <div key={i} className="px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-md text-[9px] text-gray-900">
                {note}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignment - KOMPAKT */}
      <div>
        <h4 className="text-[9px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
          Team Assignment
        </h4>
        <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-md">
          <Users className="h-3 w-3 text-gray-600" />
          <span className="text-[9px] font-semibold text-gray-900">{message.assignedTo || 'Unassigned'}</span>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ icon: Icon, label, value, color, capitalize }: any) {
  const colors: Record<string, string> = {
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-rose-500',
    amber: 'from-amber-500 to-orange-500',
  };

  return (
    <div className="bg-gray-50 rounded-md p-2">
      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-1`}>
        <Icon className="h-3 w-3 text-white" />
      </div>
      <div className="text-[9px] text-gray-600 mb-0.5">{label}</div>
      <div className={`text-[11px] font-bold text-gray-900 ${capitalize ? 'capitalize' : ''}`}>{value}</div>
    </div>
  );
}

function InsightCard({ type, title, description }: any) {
  const styles: Record<string, { bg: string; border: string; icon: string }> = {
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600' },
    opportunity: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600' },
    success: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' },
  };

  return (
    <div className={`${styles[type].bg} border ${styles[type].border} rounded-md p-2`}>
      <h5 className="text-[10px] font-bold text-gray-900 mb-0.5">{title}</h5>
      <p className="text-[9px] text-gray-700">{description}</p>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label }: any) {
  return (
    <button className="w-full flex items-center gap-1.5 px-2 py-1.5 bg-white border border-gray-200 rounded-md text-[10px] font-semibold text-gray-700 hover:border-pink-300 hover:bg-pink-50 transition-all">
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function InsightRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-md">
      <span className="text-[9px] text-gray-600">{label}</span>
      <span className="text-[10px] font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-md">
      <Icon className="h-3 w-3 text-gray-600 flex-shrink-0" />
      <span className="text-[9px] text-gray-600 min-w-0 truncate">{label}:</span>
      <span className="text-[10px] font-semibold text-gray-900 min-w-0 truncate ml-auto">{value}</span>
    </div>
  );
}

function ConsentRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-md">
      <span className="text-[9px] text-gray-600">{label}</span>
      {value ? (
        <CheckCircle className="h-3 w-3 text-green-600" />
      ) : (
        <span className="text-[9px] text-gray-400">Not given</span>
      )}
    </div>
  );
}