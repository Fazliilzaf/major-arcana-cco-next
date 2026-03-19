import { Star, TrendingUp, Calendar, DollarSign, Activity, UserCheck, FileText, Stethoscope, Sparkles, Copy, Users, AlertCircle, Clock, Plus, Edit3, X, Check, ChevronDown, ChevronUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus, Zap, Target, BarChart3, History, Eye, Send, MessageSquare, AtSign, Bell, ChevronRight, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UnifiedCustomerProfile } from "./unified-customer-profile";
import { ContactMergeModal } from "./contact-merge-modal";
import { EmailAliasWarning } from "./email-alias-warning";
import type { UnifiedCustomer } from "./customer-identity-manager";

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
  warmth?: "cold" | "warm" | "hot";
  lifecycle?: "new" | "active" | "returning" | "dormant";
  intent?: string;
  confidence?: number;
  recommendedAction?: string;
  sentiment?: 'happy' | 'frustrated' | 'neutral' | 'excited' | 'worried';
  isVIP?: boolean;
  revenuePotential?: 'low' | 'medium' | 'high' | 'premium';
  journeyStage?: 'lead' | 'consultation' | 'customer' | 'returning' | 'vip';
  suggestedReply?: string;
  suggestedSlots?: string[];
  upsellOpportunity?: string;
  lifetimeValue?: number;
  assignedTo?: string;
  internalNotes?: string[];
  handoffStatus?: 'unassigned' | 'in-progress' | 'waiting' | 'completed';
  churnRisk?: 'low' | 'medium' | 'high';
  treatmentHistory?: string[];
  medicalFlags?: string[];
  consentStatus?: { gdpr: boolean; photos: boolean; marketing: boolean };
  insurance?: string;
  conversionProbability?: number;
  // NEW: Customer Identity fields
  customerEmail?: string;
  unifiedCustomer?: UnifiedCustomer;
}

interface CustomerIntelligenceSidebarProps {
  message: Message | null;
}

type TabType = 'oversikt' | 'ai' | 'medical' | 'team' | 'identity';

export function CustomerIntelligenceSidebarOptimized({ message }: CustomerIntelligenceSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('oversikt');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  // 🚀 Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set(['activity', 'notifications']));
  
  // 🚀 Inline editing
  const [editingField, setEditingField] = useState<string | null>(null);
  
  // Activity tracking
  const [recentActivity] = useState([
    { user: 'Sara L.', action: 'såg konv.', time: '2 min' },
    { user: 'Egzona K.', action: 'notis', time: '15 min' },
  ]);

  const toggleSection = (section: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(section)) {
      newCollapsed.delete(section);
    } else {
      newCollapsed.add(section);
    }
    setCollapsedSections(newCollapsed);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toast.info('⌨️ Tilldelning');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowAddNote(true);
      }
      if ((e.ctrlKey || e.metaKey) && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const tabs: TabType[] = ['oversikt', 'ai', 'medical', 'team'];
        setActiveTab(tabs[parseInt(e.key) - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!message) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 border-l border-gray-200">
        <div className="text-center px-4">
          <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-medium">Välj ett meddelande</p>
          <p className="text-[10px] text-gray-400 mt-0.5">för att se kundinfo</p>
        </div>
      </div>
    );
  }

  const getJourneyBadge = () => {
    if (!message.journeyStage) return null;
    const journeyMap: Record<string, { label: string; icon: string; class: string }> = {
      'lead': { label: 'Lead', icon: '🎯', class: 'bg-blue-50 text-blue-700 border-blue-200' },
      'consultation': { label: 'Konsult', icon: '📋', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      'customer': { label: 'Kund', icon: '✓', class: 'bg-green-50 text-green-700 border-green-200' },
      'returning': { label: 'Återkom', icon: '🔄', class: 'bg-purple-50 text-purple-700 border-purple-200' },
      'vip': { label: 'VIP', icon: '👑', class: 'bg-amber-50 text-amber-700 border-amber-200' },
    };
    return journeyMap[message.journeyStage];
  };

  const journeyBadge = getJourneyBadge();

  const handleAddNote = () => {
    if (newNote.trim()) {
      const mentions = newNote.match(/@\w+/g);
      if (mentions) {
        toast.success(`Notis med mentions (${mentions.join(', ')})!`);
      } else {
        toast.success(`Notis tillagd!`);
      }
      setNewNote('');
      setShowAddNote(false);
    }
  };

  const handleInlineEdit = (field: string) => {
    setEditingField(field);
  };

  const saveInlineEdit = () => {
    toast.success(`${editingField} uppdaterad!`);
    setEditingField(null);
  };

  return (
    <div className="flex h-full flex-col bg-white border-l border-gray-200">
      {/* Header - KOMPAKT */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-shrink-0">
            <img
              src={message.avatar}
              alt={message.sender}
              className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover"
            />
            {message.isVIP && (
              <div className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white shadow-sm">
                <Star className="h-2.5 w-2.5 text-white fill-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">{message.sender}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {journeyBadge && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${journeyBadge.class}`}>
                  {journeyBadge.icon} {journeyBadge.label}
                </span>
              )}
              {message.revenuePotential && (
                <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700">
                  €€€
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {[
            { id: 'oversikt' as TabType, label: '📊 Översikt' },
            { id: 'ai' as TabType, label: '🤖 AI' },
            { id: 'medical' as TabType, label: '🏥 Medicin' },
            { id: 'team' as TabType, label: '👥 Team' },
            { id: 'identity' as TabType, label: '👥 Identitet' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 py-2 text-[10px] font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-pink-700 border-b-2 border-pink-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {activeTab === 'oversikt' && (
          <>
            {/* AI Prediction - KOMPAKT */}
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-2">
              <div className="flex items-start gap-1.5">
                <Zap className="h-3 w-3 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-blue-900 mb-0.5">🔮 Nästa steg</p>
                  <p className="text-[10px] text-blue-800 leading-snug">Betala faktura inom 2 dagar</p>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="flex-1 h-1 bg-blue-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '87%' }} />
                    </div>
                    <span className="text-[9px] font-bold text-blue-700">87%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics - HORISONTELL GRID */}
            <CollapsibleSection 
              title="Nyckeldata" 
              isCollapsed={collapsedSections.has('metrics')}
              onToggle={() => toggleSection('metrics')}
            >
              <div className="grid grid-cols-2 gap-1.5">
                <MetricCard
                  icon={DollarSign}
                  label="LTV"
                  value="52,000 kr"
                  trend={15}
                  color="purple"
                />
                <MetricCard
                  icon={TrendingUp}
                  label="Conversion"
                  value="85%"
                  trend={12}
                  color="green"
                />
              </div>
            </CollapsibleSection>

            {/* Alerts */}
            {message.churnRisk === 'high' && (
              <div className="flex items-start gap-1.5 rounded-lg bg-red-50 border border-red-200 p-2">
                <AlertCircle className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-red-900">⚡ Hög churn-risk</p>
                  <button
                    onClick={() => toast.success('Öppnar kalender...')}
                    className="mt-0.5 text-[9px] text-red-700 font-medium hover:underline"
                  >
                    Boka uppföljning →
                  </button>
                </div>
              </div>
            )}

            {/* Status - HORISONTELL GRID */}
            <CollapsibleSection 
              title="Status" 
              isCollapsed={collapsedSections.has('status')}
              onToggle={() => toggleSection('status')}
            >
              <div className="grid grid-cols-2 gap-1">
                <StatusPill label="Kundstatus" value={message.lifecycle || 'active'} />
                <StatusPill label="Kundengagemang" value={message.warmth || 'warm'} />
                <StatusPill label="Avsikt" value={message.intent || 'Bokning'} className="col-span-2" />
              </div>
            </CollapsibleSection>

            {/* Best Time to Contact */}
            <CollapsibleSection 
              title="Kontakttid" 
              isCollapsed={collapsedSections.has('contact')}
              onToggle={() => toggleSection('contact')}
            >
              <div className="rounded-lg bg-green-50 border border-green-200 p-2">
                <div className="flex items-start gap-1.5">
                  <Clock className="h-3 w-3 text-green-700 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-green-900">
                      Torsdag 10:00-12:00
                    </p>
                    <button
                      onClick={() => toast.success('📅 Skapar möte...')}
                      className="mt-0.5 text-[9px] text-green-700 hover:text-green-900 font-medium"
                    >
                      → Boka nu
                    </button>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </>
        )}

        {activeTab === 'ai' && (
          <>
            {/* Smart Templates - KOMPAKT */}
            <CollapsibleSection title="Mallar">
              <div className="space-y-1">
                <TemplateButton
                  icon="✨"
                  label="Bokningsbekräftelse"
                  count={142}
                  onClick={() => toast.success('Mall kopierad!')}
                />
                <TemplateButton
                  icon="📅"
                  label="Föreslå ny tid"
                  count={89}
                  onClick={() => toast.success('Mall kopierad!')}
                />
                <TemplateButton
                  icon="💰"
                  label="Prissättning"
                  count={67}
                  onClick={() => toast.success('Mall kopierad!')}
                />
                <button
                  className="w-full flex items-center justify-center gap-1 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-2 py-1 text-[9px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                  onClick={() => toast.info('Skapa mall...')}
                >
                  <Plus className="h-2.5 w-2.5" />
                  Skapa mall
                </button>
              </div>
            </CollapsibleSection>

            {/* Smart Scheduling - HORISONTELL - KOMPRIMERAD */}
            {message.suggestedSlots && message.suggestedSlots.length > 0 && (
              <CollapsibleSection title="Smart bokning">
                <div className="grid grid-cols-2 gap-1">
                  {message.suggestedSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        toast.success(`✅ Bokad: ${slot}`);
                        toast.info('📧 Bekräftelse skickad');
                      }}
                      className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-2 py-1 text-green-800 hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" />
                        <span className="text-[10px] font-medium">{slot}</span>
                      </div>
                      <span className="text-[9px] text-green-600 font-semibold">1-KLICK</span>
                    </button>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Upsell - KOMPRIMERAD */}
            {message.upsellOpportunity && (
              <CollapsibleSection title="Upsell">
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-2">
                  <div className="flex items-start gap-1.5 mb-1.5">
                    <span className="text-[10px]">💰</span>
                    <p className="text-[10px] text-amber-800 flex-1 leading-snug">{message.upsellOpportunity}</p>
                  </div>
                  <button
                    onClick={() => toast.success('Skickar förslag...')}
                    className="w-full rounded bg-orange-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-orange-700"
                  >
                    Skicka förslag →
                  </button>
                </div>
              </CollapsibleSection>
            )}

            {/* Auto-assign - KOMPRIMERAD */}
            <CollapsibleSection title="Tilldelning">
              <div className="rounded-lg bg-purple-50 border border-purple-200 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-full bg-purple-200 flex items-center justify-center text-[9px] font-bold text-purple-800">
                      EK
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-purple-900 leading-tight">Egzona Krasniqi · <span className="text-purple-700">92% match</span></p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success('Tilldelad!')}
                    className="rounded bg-purple-600 px-2 py-1 text-[9px] font-semibold text-white hover:bg-purple-700"
                  >
                    Tilldela
                  </button>
                </div>
              </div>
            </CollapsibleSection>
          </>
        )}

        {activeTab === 'medical' && (
          <>
            {/* Medical Flags */}
            {message.medicalFlags && message.medicalFlags.length > 0 && (
              <CollapsibleSection title="Medicinska flaggor">
                {message.medicalFlags.map((flag, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-2.5 py-2 text-[11px] text-red-800">
                    <div className="flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5" />
                      <span>{flag}</span>
                    </div>
                    <button
                      onClick={() => toast.info(`Redigera: ${flag}`)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </CollapsibleSection>
            )}

            {/* Treatment History */}
            {message.treatmentHistory && (
              <CollapsibleSection 
                title="Behandlingar" 
                isCollapsed={collapsedSections.has('treatment')}
                onToggle={() => toggleSection('treatment')}
              >
                <div className="space-y-1.5">
                  {message.treatmentHistory.map((treatment, i) => (
                    <div key={i} className="rounded-lg bg-gray-50 border border-gray-200 px-2.5 py-2 text-[11px] text-gray-700">
                      {treatment}
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Consent - HORISONTELL */}
            {message.consentStatus && (
              <CollapsibleSection 
                title="Samtycken"
                isCollapsed={collapsedSections.has('consent')}
                onToggle={() => toggleSection('consent')}
              >
                <div className="grid grid-cols-2 gap-1.5">
                  <ConsentChip label="GDPR" checked={message.consentStatus.gdpr} />
                  <ConsentChip label="Fotos" checked={message.consentStatus.photos} />
                  <ConsentChip label="Marknadsföring" checked={message.consentStatus.marketing} className="col-span-2" />
                </div>
              </CollapsibleSection>
            )}

            {/* Insurance */}
            {message.insurance && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-2 text-[11px] text-blue-800 font-medium">
                🛡️ {message.insurance}
              </div>
            )}
          </>
        )}

        {activeTab === 'team' && (
          <>
            {/* Activity Feed - COLLAPSIBLE */}
            <CollapsibleSection 
              title="Aktivitet" 
              isCollapsed={collapsedSections.has('activity')}
              onToggle={() => toggleSection('activity')}
            >
              <div className="space-y-1.5">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-gray-50 border border-gray-200 px-2.5 py-2">
                    <Eye className="h-3.5 w-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-900">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-[9px] text-gray-500">{activity.time}</p>
                    </div>
                    {i === 0 && (
                      <div className="h-2 w-2 rounded-full bg-green-500" title="Online" />
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Assigned To */}
            <CollapsibleSection title="Tilldelad">
              {message.assignedTo ? (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-2">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <span className="text-[11px] font-medium text-blue-900 flex-1">{message.assignedTo}</span>
                  <button
                    onClick={() => toast.info("Ta bort")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 border border-gray-200 px-2.5 py-2 text-[11px] text-gray-500 text-center">
                  Ingen tilldelning
                </div>
              )}
            </CollapsibleSection>

            {/* Internal Notes */}
            <CollapsibleSection title="Notiser (⌘N)">
              {message.internalNotes && message.internalNotes.length > 0 ? (
                <div className="space-y-1.5 mb-2">
                  {message.internalNotes.map((note, i) => (
                    <div key={i} className="rounded-lg bg-amber-50 border border-amber-200 p-2.5">
                      <p className="text-[11px] text-amber-900">{note}</p>
                      <p className="text-[9px] text-amber-700 mt-1">
                        {message.assignedTo || 'Okänd'} · Idag 14:32
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-gray-500 text-center py-3 mb-2">Inga notiser</p>
              )}

              {showAddNote ? (
                <div className="space-y-1.5">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ny notis... (@mention för att notifiera)"
                    className="w-full rounded-lg border border-gray-300 px-2.5 py-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    rows={3}
                    autoFocus
                  />
                  {newNote.includes('@') && (
                    <div className="text-[10px] text-blue-700 flex items-center gap-1">
                      <AtSign className="h-3 w-3" />
                      <span>Person notifieras vid sparande</span>
                    </div>
                  )}
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleAddNote}
                      className="flex-1 rounded-lg bg-pink-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-pink-700"
                    >
                      Spara
                    </button>
                    <button
                      onClick={() => {
                        setShowAddNote(false);
                        setNewNote('');
                      }}
                      className="rounded-lg px-3 py-1.5 text-[11px] text-gray-600 hover:bg-gray-100"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddNote(true)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-2 py-2 text-[10px] font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Lägg till notis
                </button>
              )}
            </CollapsibleSection>

            {/* Notifications - COLLAPSIBLE */}
            <CollapsibleSection 
              title="Notifikationer" 
              isCollapsed={collapsedSections.has('notifications')}
              onToggle={() => toggleSection('notifications')}
            >
              <div className="space-y-1.5">
                <NotificationToggle label="SLA-varningar" enabled={true} />
                <NotificationToggle label="Nya mentions" enabled={true} />
                <NotificationToggle label="Statusändringar" enabled={false} />
              </div>
            </CollapsibleSection>
          </>
        )}

        {activeTab === 'identity' && (
          <>
            {/* Unified Customer Profile */}
            {message.unifiedCustomer ? (
              <div className="space-y-2">
                <UnifiedCustomerProfile 
                  customer={message.unifiedCustomer}
                  onSetPrimaryEmail={(email) => {
                    toast.success(`⭐ ${email} är nu primär email-adress`);
                  }}
                  onAddEmail={(email) => {
                    toast.success(`✅ La till ${email}`);
                  }}
                  onRemoveEmail={(email) => {
                    toast.success(`🗑️ Tog bort ${email}`);
                  }}
                  onOpenMergeDialog={() => setShowMergeModal(true)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-gray-500 text-center py-3 mb-2">Ingen unified kundprofil tillgänglig</p>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                  <p className="text-[10px] text-blue-800 mb-2">
                    📧 <strong>Email:</strong> {message.customerEmail || message.sender}
                  </p>
                  <button
                    onClick={() => toast.info("Skapar unified profil...")}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-blue-700"
                  >
                    <Users className="h-3 w-3" />
                    Skapa kundprofil
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-3 py-1.5">
        <p className="text-[9px] text-gray-500 text-center">
          ⌘N: Notis · ⌘1-4: Tabs
        </p>
      </div>
    </div>
  );
}

// 🚀 NYA KOMPONENTER - KOMPAKTA & LUFTIGA

function CollapsibleSection({ 
  title, 
  children, 
  isCollapsed, 
  onToggle 
}: { 
  title: string; 
  children: React.ReactNode; 
  isCollapsed?: boolean;
  onToggle?: () => void;
}) {
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const collapsed = isCollapsed !== undefined ? isCollapsed : localCollapsed;
  const toggle = onToggle || (() => setLocalCollapsed(!localCollapsed));

  return (
    <div className="space-y-2">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between group"
      >
        <h4 className="text-[9px] font-bold text-gray-700 uppercase tracking-wide">{title}</h4>
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
        ) : (
          <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
        )}
      </button>
      {!collapsed && children}
    </div>
  );
}

function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  trend?: number; 
  color: string;
}) {
  const colorMap: Record<string, string> = {
    purple: 'from-purple-50 to-pink-50 border-purple-100',
    green: 'from-green-50 to-emerald-50 border-green-100',
    blue: 'from-blue-50 to-cyan-50 border-blue-100',
  };

  const TrendIcon = trend && trend > 0 ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend && trend > 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`rounded-lg bg-gradient-to-br border ${colorMap[color]} p-2.5`}>
      <div className="flex items-center gap-1 mb-1">
        <Icon className="h-3.5 w-3.5 text-gray-600" />
        <span className="text-[9px] font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold text-gray-900">{value}</span>
        {trend !== undefined && (
          <div className={`flex items-center ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            <span className="text-[10px] font-bold">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex items-center justify-between rounded-lg bg-gray-50 border border-gray-200 px-2 py-1.5 ${className}`}>
      <span className="text-[9px] text-gray-600">{label}</span>
      <span className="text-[10px] font-semibold text-gray-900 capitalize">{value}</span>
    </div>
  );
}

function TemplateButton({ icon, label, count, onClick }: { icon: string; label: string; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-2 py-1 text-[10px] font-medium text-blue-800 hover:from-blue-100 hover:to-indigo-100 transition-all group"
    >
      <span className="text-sm">{icon}</span>
      <p className="font-semibold truncate flex-1 text-left">{label}</p>
      <span className="text-[9px] text-blue-600 font-semibold">{count}×</span>
      <Send className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </button>
  );
}

function ConsentChip({ label, checked, className = '' }: { label: string; checked: boolean; className?: string }) {
  return (
    <div className={`flex items-center justify-between rounded-lg bg-gray-50 border border-gray-200 px-2 py-1.5 ${className}`}>
      <span className="text-[10px] text-gray-700">{label}</span>
      <span className={`text-[10px] font-bold ${checked ? 'text-green-700' : 'text-red-700'}`}>
        {checked ? '' : '✗'}
      </span>
    </div>
  );
}

function NotificationToggle({ label, enabled }: { label: string; enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  return (
    <button
      onClick={() => {
        setIsEnabled(!isEnabled);
        toast.success(`${label} ${!isEnabled ? 'på' : 'av'}!`);
      }}
      className="w-full flex items-center justify-between rounded-lg bg-gray-50 border border-gray-200 px-2.5 py-2 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-1.5">
        <Bell className={`h-3.5 w-3.5 ${isEnabled ? 'text-green-600' : 'text-gray-400'}`} />
        <span className="text-[11px] text-gray-700">{label}</span>
      </div>
      <div className={`h-4 w-7 rounded-full transition-colors ${isEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
        <div className={`h-3 w-3 mt-0.5 rounded-full bg-white shadow-sm transition-transform ${isEnabled ? 'ml-3.5' : 'ml-0.5'}`} />
      </div>
    </button>
  );
}