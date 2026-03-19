import { CheckCircle2, Bookmark, Flame, Briefcase, Clock, Trash2, Edit3, Sparkles, Send, X, AlertCircle, CheckCircle, Heart, Target, Wand2, RefreshCw, Scissors, Star, Mail, Phone, Package, Bot, ClipboardList, Eye, SmilePlus } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { SignatureEditorModal, defaultSignatures } from "./signature-editor-modal";
import { AnimatedSignatureLogo } from "./animated-signature-logo";
import { useLanguage } from "../context/language-context";
import { useApiErrorHandler } from "../hooks/use-api-error-handler";
import { LoadingSpinner } from "./loading-states";
import { DoThisNowCard } from "./do-this-now-card";
import { BookingSLAStatusCard } from "./booking-sla-status-card";

interface Signature {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  instagram: string;
  facebook: string;
  greeting: string;
  logo: string;
}

interface ResponseStudioUltraProps {
  isOpen: boolean;
  onClose: () => void;
  initialDraft?: string;
}

// Vanliga emojis för snabb-insättning
const quickEmojis = [
  '😊', '🙏', '✨', '💫', '❤️', '💪', '👍', '🎉',
  '📅', '⏰', '💉', '🌟', '🔥', '💝', '🌸', '☀️'
];

export function ResponseStudioUltra({ isOpen, onClose, initialDraft = "" }: ResponseStudioUltraProps) {
  const [draftText, setDraftText] = useState(initialDraft || `Hej Johan,\n\nVad kul att fredag kl 09:00 passar – det ser jag fram emot!\n\nDin tid är nu bokad.\n\nDu får en påminnelse dagen innan på sms.\n\nHör av dig om du har några frågor.`);

  const [showSnoozeDialog, setShowSnoozeDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [showSignatureEditor, setShowSignatureEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [currentSignature, setCurrentSignature] = useState<Signature>(defaultSignatures.fazli);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>("fazli");
  const [isSending, setIsSending] = useState(false);
  
  // AI SETTINGS - NEW!
  const [aiMode, setAiMode] = useState<'conversation-only' | 'full-context'>('conversation-only');
  const [aiTone, setAiTone] = useState<'match-company' | 'professional' | 'friendly'>('match-company');
  
  const handleError = useApiErrorHandler();
  
  useEffect(() => {
    if (initialDraft) {
      setDraftText(initialDraft);
    }
  }, [initialDraft]);

  const { language } = useLanguage();

  // Word count and quality checks
  const wordCount = draftText.trim().split(/\s+/).length;
  const hasViolation = draftText.toLowerCase().includes("gratis") || draftText.toLowerCase().includes("garanti");
  const hasMissingTime = !draftText.match(/\d{2}:\d{2}/) && draftText.toLowerCase().includes("boka");
  const hasMissingPrice = !draftText.match(/\d+\s*kr/) && (draftText.toLowerCase().includes("pris") || draftText.toLowerCase().includes("behandling"));
  
  // Mock customer data
  const customerData = {
    name: "Johan Lagerström",
    email: "johan.lagerstrom@email.com",
    phone: "+46 70 123 45 67",
    vip: true,
    ltv: 46000,
    sentiment: "excited" as const,
    treatmentHistory: [
      { name: "PRP-behandling", date: "2024-11-15", price: 4500 },
      { name: "Konsultation", date: "2024-10-22", price: 0 },
    ],
    preferences: {
      preferredTime: "09:00-12:00",
      preferredDay: "Fredag",
      preferredStaff: "Dr. Eriksson"
    },
    conversationSummary: "Kunden vill boka PRP-behandling, har tidigare gjort konsultation och verkar mycket nöjd. Föredrar tider på morgonen.",
    intent: "Bokning",
    churnRisk: "low" as const,
    engagementScore: 87
  };

  if (!isOpen) return null;

  const handleSendReply = async () => {
    if (!draftText.trim()) {
      toast.error("Meddelandet kan inte vara tomt");
      return;
    }

    setIsSending(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("✅ Svar skickat till Johan Lagerström!");
      onClose();
    } catch (error) {
      handleError(error as Error, {
        title: "Kunde inte skicka svar",
        retry: handleSendReply,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = () => {
    toast.success("💾 Utkast sparat · Finns i 'Utkast'-filtret");
    onClose();
  };

  const handleSnooze = (time: string) => {
    toast.success(`⏰ Svara senare (${time}) · Finns i 'Senare'-fliken`);
    setShowSnoozeDialog(false);
    onClose();
  };

  const handleComplete = (outcome: string) => {
    toast.success(`✅ Markerad som klar: '${outcome}' · Tas bort från inkorg`);
    setShowCompleteDialog(false);
    onClose();
  };

  const handleDelete = () => {
    toast.success("🗑️ Flyttat till papperskorg (kan återställas inom 30 dagar)");
    onClose();
  };

  // Template functions - INGA EMOJIS, INGEN DUBBEL SIGNATUR
  const applyTemplate = (template: string) => {
    const templates = {
      confirmBooking: `Hej ${customerData.name.split(' ')[0]}!

Perfekt! Jag bekräftar din PRP-behandling för **Fredag 09:00**.

Pris: 8 500 kr

Jag har noterat:
- Föredrar morgontider
- Vill ha SMS-påminnelse

Som VIP-kund har vi reserverat extra tid för dig.

Du får en bekräftelse via email och SMS inom kort.

Ser fram emot att träffa dig!`,
      suggestTimes: `Hej ${customerData.name.split(' ')[0]}!

Tack för ditt intresse! Baserat på dina preferenser har jag följande lediga tider:

- Fredag 21/3 kl 09:00 (rekommenderad)
- Måndag 24/3 kl 10:30
- Onsdag 26/3 kl 14:00

Vilken tid passar dig bäst?`,
      sendPricing: `Hej ${customerData.name.split(' ')[0]}!

Här kommer prislistan för PRP-behandling:

PRP-behandling: 4 500 kr
PRP + Microneedling: 6 500 kr
PRP-paket (3 behandlingar): 12 000 kr (spara 1 500 kr)

Alla priser inkluderar konsultation.

Vill du boka in en tid?`,
      askMoreInfo: `Hej ${customerData.name.split(' ')[0]}!

Tack för ditt meddelande! För att hjälpa dig bäst behöver jag lite mer information:

- Vilken behandling är du intresserad av?
- Vilka dagar passar dig bäst?
- Föredrar du för- eller eftermiddag?

Jag återkommer med förslag så snart jag hör från dig!`,
      reminder: `Hej ${customerData.name.split(' ')[0]}!

Detta är en påminnelse om din kommande bokning:

Fredag 21 mars kl 09:00
PRP-behandling
Dr. Eriksson

Vi ses imorgon! Om något ändras, hör av dig snarast.`
    };
    
    setDraftText(templates[template as keyof typeof templates] || draftText);
    setSelectedTemplate(template);
    toast.success("📋 Mall tillagd!");
  };

  // AI Enhancement functions
  const handleAddBookingLink = () => {
    const bookingText = "\n\nBoka direkt här: https://hairtp.se/book/johan-l-x7f92";
    setDraftText(prev => prev + bookingText);
    toast.success("📅 Bokningslänk tillagd!");
  };

  const handleSuggestUpsell = () => {
    const upsellText = "\n\nPS: Många av våra kunder kombinerar PRP med microneedling för ännu bättre resultat (ordinarie 6 500 kr, kampanjpris 5 900 kr denna månad). Vill du veta mer?";
    setDraftText(prev => prev + upsellText);
    toast.success("🎁 Upsell-förslag tillagt!");
  };

  const handleMakeWarmer = () => {
    toast.success("🔥 Gör varmare...");
    setDraftText(`Hej ${customerData.name.split(' ')[0]}!

Så kul att fredag kl 09:00 passar perfekt – jag ser verkligen fram emot att träffa dig!

Din tid är nu bokad och jag har noterat allt.

Du får en vänlig påminnelse på sms dagen innan.

Hör gärna av dig om du har några frågor eller funderingar innan dess!`);
  };

  const handleMakeProfessional = () => {
    toast.success("💼 Gör proffsig...");
    setDraftText(`Hej ${customerData.name.split(' ')[0]},

Tack för ditt meddelande. Din bokningsförfrågan är nu bekräftad.

Tid: Fredag kl 09:00
Behandling: PRP
Behandlare: Dr. Eriksson

En påminnelse kommer att skickas via SMS 24 timmar innan utsatt tid.

Vid eventuella frågor är du välkommen att kontakta oss.`);
  };

  const handleShorten = () => {
    toast.success("✂️ Förkortar...");
    setDraftText(`Hej ${customerData.name.split(' ')[0]}!

Perfekt! Din tid fredag kl 09:00 är bokad.

Du får påminnelse på sms dagen innan.`);
  };

  const handleImproveGrammar = () => {
    toast.success("✨ Grammatik förbättrad!");
  };

  const handleRegenerate = () => {
    toast.success("🔄 Regenererar med AI...");
  };

  const insertEmoji = (emoji: string) => {
    setDraftText(prev => prev + emoji);
    setShowEmojiPicker(false);
    toast.success(`${emoji} tillagd!`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 bg-gradient-to-r from-pink-50 to-white">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-pink-600" />
            <h3 className="text-base font-bold text-gray-900">Svarstudio</h3>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                {customerData.intent}
              </span>
              {customerData.vip && (
                <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2.5 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-white" />
                  VIP
                </span>
              )}
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                {(customerData.ltv / 1000).toFixed(0)}K SEK
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowContextPanel(!showContextPanel)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              {showContextPanel ? 'Dölj' : 'Visa'} kontext
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex-1 overflow-hidden flex">
          {/* LEFT: Context Panel */}
          {showContextPanel && (
            <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-4 space-y-3">
                {/* Customer Summary */}
                <div className="rounded-lg bg-white border border-gray-200 p-3 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                        alt={customerData.name}
                        className="h-12 w-12 rounded-full border-2 border-pink-200 object-cover"
                      />
                      {customerData.vip && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white flex items-center justify-center">
                          <Star className="h-2.5 w-2.5 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{customerData.name}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        {customerData.sentiment === "excited" && (
                          <span className="text-[10px] text-green-600 font-medium">Glad & ivrig</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{customerData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span>{customerData.phone}</span>
                    </div>
                  </div>
                </div>

                {/* 🎯 GÖR DETTA NU - NEW! */}
                <DoThisNowCard 
                  action="📅 Bokningsförslag"
                  description="driver nästa steg"
                  urgentReason="SLA bruten - kunden behöver svar senast idag 15:15"
                  onQuickAction={() => toast.success("📅 Snabbbokning öppnas...")}
                  actionButtonText="📅 Boka fredag 09:00"
                />

                {/* 📋 BOKNINGS & SLA STATUS - NEW! */}
                <BookingSLAStatusCard 
                  agent="Sara Lindberg"
                  status="Redo för åtgärd"
                  slaMinutesLeft={45}
                  priority="high"
                />

                {/* 🎯 AI-REKOMMENDERADE ÅTGÄRDER - 3-KOLUMNS CARDS */}
                <div className="rounded-lg bg-white border border-gray-200 p-3 shadow-sm">
                  <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-pink-600" />
                    AI-REKOMMENDERADE ÅTGÄRDER
                  </h4>
                  
                  <div className="space-y-2">
                    {/* NU I */}
                    <div className="rounded-lg border border-gray-200 p-2 bg-gray-50/50">
                      <h5 className="text-[9px] font-bold text-gray-700 uppercase tracking-wide mb-1">
                        NU I
                      </h5>
                      <p className="text-[10px] font-bold text-gray-900 mb-0.5">
                        Nu i Agera nu
                      </p>
                      <p className="text-[9px] text-gray-600 leading-tight">
                        Redo att boka nu · Skicka tider omgående för att säkra relation
                      </p>
                    </div>

                    {/* NÄSTA STEG */}
                    <div className="rounded-lg border border-pink-200 p-2 bg-pink-50/50">
                      <h5 className="text-[9px] font-bold text-pink-700 uppercase tracking-wide mb-1">
                        NÄSTA STEG
                      </h5>
                      <p className="text-[10px] font-bold text-pink-900 mb-0.5">
                        Erbjud två ombokningsalternativ nu
                      </p>
                      <p className="text-[9px] text-pink-700 leading-tight">
                        Skicka två eftermiddagstider direkt via bokningsförslag
                      </p>
                    </div>

                    {/* VÄNTAR / BLOCKERAR */}
                    <div className="rounded-lg border border-gray-200 p-2 bg-gray-50/50">
                      <h5 className="text-[9px] font-bold text-gray-700 uppercase tracking-wide mb-1">
                        VÄNTAR / BLOCKERAR
                      </h5>
                      <p className="text-[10px] font-bold text-gray-900 mb-0.5">
                        Redo för åtgärd
                      </p>
                      <p className="text-[9px] text-gray-600 leading-tight">
                        Inget externt hinder just nu. Agera direkt.
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <h5 className="text-xs font-bold text-gray-900">AI-sammanfattning</h5>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-700">
                    {customerData.conversationSummary}
                  </p>
                </div>

                {/* Treatment History */}
                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <h5 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Package className="h-3.5 w-3.5 text-pink-600" />
                    Behandlingshistorik
                  </h5>
                  <div className="space-y-2">
                    {customerData.treatmentHistory.map((treatment, idx) => (
                      <div key={idx} className="flex items-start justify-between text-[11px] pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-gray-900">{treatment.name}</p>
                          <p className="text-gray-500">{treatment.date}</p>
                        </div>
                        <p className="font-bold text-pink-600">
                          {treatment.price > 0 ? `${treatment.price.toLocaleString()} kr` : 'Gratis'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <h5 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5 text-pink-600" />
                    Preferenser
                  </h5>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tid:</span>
                      <span className="font-semibold text-gray-900">{customerData.preferences.preferredTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Dag:</span>
                      <span className="font-semibold text-gray-900">{customerData.preferences.preferredDay}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Personal:</span>
                      <span className="font-semibold text-gray-900">{customerData.preferences.preferredStaff}</span>
                    </div>
                  </div>
                </div>

                {/* Risk & Engagement */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-green-50 border border-green-200 p-2.5 text-center">
                    <p className="text-[10px] text-gray-600 mb-1">Churn-risk</p>
                    <p className="text-sm font-bold text-green-700">Låg</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-2.5 text-center">
                    <p className="text-[10px] text-gray-600 mb-1">Engagement</p>
                    <p className="text-sm font-bold text-blue-700">{customerData.engagementScore}%</p>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <h5 className="text-xs font-bold text-gray-900">AI-rekommendationer</h5>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleAddBookingLink}
                      className="w-full text-left rounded-lg bg-white border border-purple-200 p-2 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-[11px] font-semibold text-gray-900">Lägg till bokningslänk</p>
                      <p className="text-[10px] text-gray-600">Gör det enkelt att boka direkt</p>
                    </button>
                    <button
                      onClick={handleSuggestUpsell}
                      className="w-full text-left rounded-lg bg-white border border-purple-200 p-2 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-[11px] font-semibold text-gray-900">Föreslå paketpris</p>
                      <p className="text-[10px] text-gray-600">Kunden är intresserad av PRP</p>
                    </button>
                    <button
                      onClick={handleMakeWarmer}
                      className="w-full text-left rounded-lg bg-white border border-purple-200 p-2 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-[11px] font-semibold text-gray-900">Använd varm ton</p>
                      <p className="text-[10px] text-gray-600">Matchar kundens stil</p>
                    </button>
                  </div>
                </div>
                
                {/* AI SETTINGS - NEW SECTION */}
                <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-300 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="h-4 w-4 text-indigo-600" />
                    <h5 className="text-xs font-bold text-gray-900">AI-inställningar</h5>
                  </div>
                  
                  {/* AI Mode */}
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Datakällor:</p>
                    <div className="space-y-1.5">
                      <label className="flex items-start gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          checked={aiMode === 'conversation-only'}
                          onChange={() => setAiMode('conversation-only')}
                          className="mt-0.5 h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold text-gray-900 group-hover:text-indigo-700">Endast konversation</p>
                          <p className="text-[9px] text-gray-600 leading-relaxed">AI använder bara mejlkonversationen. Tar inte info från noter, önskemål eller historik.</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          checked={aiMode === 'full-context'}
                          onChange={() => setAiMode('full-context')}
                          className="mt-0.5 h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold text-gray-900 group-hover:text-indigo-700">Full kontext</p>
                          <p className="text-[9px] text-gray-600 leading-relaxed">AI använder allt: önskemål, medicinska noter, behandlingshistorik och preferenser.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* AI Tone */}
                  <div className="pt-3 border-t border-indigo-200">
                    <p className="text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Tonalitet:</p>
                    <div className="space-y-1.5">
                      <label className="flex items-start gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          checked={aiTone === 'match-company'}
                          onChange={() => setAiTone('match-company')}
                          className="mt-0.5 h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold text-gray-900 group-hover:text-indigo-700">Matcha företaget</p>
                          <p className="text-[9px] text-gray-600 leading-relaxed">AI matchar företagets vanliga svarsstil. Ingen egen kreativitet.</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          checked={aiTone === 'professional'}
                          onChange={() => setAiTone('professional')}
                          className="mt-0.5 h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold text-gray-900 group-hover:text-indigo-700">Professionell</p>
                          <p className="text-[9px] text-gray-600 leading-relaxed">Formell och saklig ton.</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          checked={aiTone === 'friendly'}
                          onChange={() => setAiTone('friendly')}
                          className="mt-0.5 h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold text-gray-900 group-hover:text-indigo-700">Vänlig</p>
                          <p className="text-[9px] text-gray-600 leading-relaxed">Varm och personlig ton.</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Warning if Full Context */}
                  {aiMode === 'full-context' && (
                    <div className="mt-3 rounded-lg bg-amber-50 border border-amber-300 p-2">
                      <div className="flex items-start gap-1.5">
                        <AlertCircle className="h-3 w-3 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[9px] text-amber-800 leading-relaxed">
                          <strong>OBS:</strong> AI kan nu ta beslut baserat på noter och historik. Granska alltid svaret!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: Message Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {/* KUNDENS SENASTE MEDDELANDE */}
              <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-3">
                <div className="flex items-start gap-3 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                    alt={customerData.name}
                    className="h-8 w-8 rounded-full border-2 border-blue-300 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-gray-900">{customerData.name}</h5>
                      <span className="text-[10px] text-gray-500">· Idag 10:58</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">Senaste meddelande från kund:</p>
                  </div>
                </div>
                <div className="rounded-lg bg-white border border-blue-200 p-3">
                  <p className="text-[12px] leading-[1.6] text-gray-800">
                    Fredag kl 09:00 passar perfekt. Jag ser fram emot det!
                  </p>
                </div>
              </div>

              {/* Quick Templates */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h5 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <ClipboardList className="h-3.5 w-3.5 text-gray-600" />
                  Snabbmallar
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => applyTemplate('confirmBooking')}
                    className="text-left rounded-lg border border-gray-200 p-2 hover:border-pink-300 hover:bg-pink-50 transition-colors"
                  >
                    <p className="text-[11px] font-semibold text-gray-900">Bekräfta bokning</p>
                  </button>
                  <button
                    onClick={() => applyTemplate('suggestTimes')}
                    className="text-left rounded-lg border border-gray-200 p-2 hover:border-pink-300 hover:bg-pink-50 transition-colors"
                  >
                    <p className="text-[11px] font-semibold text-gray-900">Föreslå tider</p>
                  </button>
                  <button
                    onClick={() => applyTemplate('sendPricing')}
                    className="text-left rounded-lg border border-gray-200 p-2 hover:border-pink-300 hover:bg-pink-50 transition-colors"
                  >
                    <p className="text-[11px] font-semibold text-gray-900">Skicka prislista</p>
                  </button>
                  <button
                    onClick={() => applyTemplate('askMoreInfo')}
                    className="text-left rounded-lg border border-gray-200 p-2 hover:border-pink-300 hover:bg-pink-50 transition-colors"
                  >
                    <p className="text-[11px] font-semibold text-gray-900">Be om info</p>
                  </button>
                </div>
              </div>

              {/* RESPONSPÅR - NY! */}
              <div className="rounded-lg border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 p-3">
                <h5 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 text-pink-600" />
                  RESPONSPÅR
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Bokningsförslag", active: true },
                    { label: "Uppföljning", active: false },
                    { label: "Mellanbesked", active: false },
                    { label: "Medicinsk vänt", active: false },
                    { label: "Pris / trygghet", active: false },
                    { label: "Adminsvar", active: false },
                  ].map((spar) => (
                    <button
                      key={spar.label}
                      onClick={() => {
                        toast.success(`📋 Responspår: ${spar.label}`);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        spar.active
                          ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm"
                          : "bg-white border border-pink-200 text-gray-700 hover:bg-pink-50 hover:border-pink-300"
                      }`}
                    >
                      {spar.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TONFILTER - NY! */}
              <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-3">
                <h5 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Wand2 className="h-3.5 w-3.5 text-blue-600" />
                  TONFILTER
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Professionell", checked: true },
                    { label: "Varm", checked: true },
                    { label: "Lösningsfokuserad", checked: true },
                    { label: "Beslutsstödjande", checked: true },
                  ].map((ton) => (
                    <button
                      key={ton.label}
                      onClick={() => {
                        toast.success(`🎨 Tonfilter: ${ton.label}`);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        ton.checked
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white border border-blue-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                    >
                      {ton.checked && <CheckCircle className="h-3 w-3" />}
                      {ton.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FINUSTERA - NY! */}
              <div className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-3">
                <h5 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Scissors className="h-3.5 w-3.5 text-purple-600" />
                  FINUSTERA
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={handleShorten}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white border border-purple-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition-all"
                  >
                    Kortare
                  </button>
                  <button
                    onClick={handleMakeWarmer}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white border border-purple-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition-all"
                  >
                    Varmare
                  </button>
                  <button
                    onClick={handleMakeProfessional}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white border border-purple-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition-all"
                  >
                    Proffigare
                  </button>
                  <button
                    onClick={handleImproveGrammar}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white border border-purple-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition-all"
                  >
                    Skarpare
                  </button>
                </div>
              </div>

              {/* Message Editor */}
              <div className="rounded-lg border-2 border-pink-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-900">Till: {customerData.name}</label>
                  <div className="flex items-center gap-1">
                    <button onClick={handleMakeWarmer} className="p-1.5 rounded hover:bg-orange-50 transition-colors" title="Gör varmare">
                      <Flame className="h-4 w-4 text-orange-600" />
                    </button>
                    <button onClick={handleMakeProfessional} className="p-1.5 rounded hover:bg-blue-50 transition-colors" title="Gör proffsig">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </button>
                    <button onClick={handleShorten} className="p-1.5 rounded hover:bg-purple-50 transition-colors" title="Förkorta">
                      <Scissors className="h-4 w-4 text-purple-600" />
                    </button>
                    <button onClick={handleImproveGrammar} className="p-1.5 rounded hover:bg-green-50 transition-colors" title="Förbättra grammatik">
                      <Sparkles className="h-4 w-4 text-green-600" />
                    </button>
                    <button onClick={handleRegenerate} className="p-1.5 rounded hover:bg-pink-50 transition-colors" title="Regenerera">
                      <RefreshCw className="h-4 w-4 text-pink-600" />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                        className="p-1.5 rounded hover:bg-yellow-50 transition-colors" 
                        title="Lägg till emoji"
                      >
                        <SmilePlus className="h-4 w-4 text-yellow-600" />
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border-2 border-gray-200 shadow-xl p-3 z-50 w-64">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-gray-900">Lägg till emoji</p>
                            <button onClick={() => setShowEmojiPicker(false)} className="text-gray-400 hover:text-gray-600">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-8 gap-2">
                            {quickEmojis.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => insertEmoji(emoji)}
                                className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  className="w-full min-h-[320px] text-sm text-gray-800 focus:outline-none resize-none"
                  style={{ lineHeight: '1.4' }}
                  placeholder="Skriv ditt meddelande här..."
                />
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">{wordCount} ord</span>
                    <span className="text-[10px] text-gray-400">·</span>
                    <span className="text-[10px] text-gray-400">**Fredag 09:00** = dynamisk bokningstid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasViolation && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
                        Policy risk
                      </span>
                    )}
                    {!hasViolation && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                        Policy OK
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quality Checks */}
              {(hasMissingTime || hasMissingPrice) && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-amber-900 mb-1">Kvalitetskontroll</p>
                      <ul className="space-y-1 text-[11px] text-amber-800">
                        {hasMissingTime && <li>• Ingen tid angiven (rekommenderas för bokningar)</li>}
                        {hasMissingPrice && <li>• Inget pris nämnt (bra att inkludera)</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* SIGNATUR VÄLJARE - NY! */}
              <div className="rounded-lg border-2 border-gray-200 bg-white p-3">
                <h5 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Edit3 className="h-3.5 w-3.5 text-gray-600" />
                  SIGNATUR
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Sara", id: "sara", active: selectedSignatureId === "sara" },
                    { label: "Egzona", id: "egzona", active: selectedSignatureId === "egzona" },
                    { label: "Fazli", id: "fazli", active: selectedSignatureId === "fazli" },
                    { label: "Redigera", id: "edit", active: false },
                  ].map((sig) => (
                    <button
                      key={sig.id}
                      onClick={() => {
                        if (sig.id === "edit") {
                          setShowSignatureEditor(true);
                        } else {
                          setSelectedSignatureId(sig.id);
                          setCurrentSignature(defaultSignatures[sig.id as keyof typeof defaultSignatures]);
                          toast.success(`✍️ Signatur: ${sig.label}`);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        sig.active
                          ? "bg-gray-900 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {sig.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature */}
              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Edit3 className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700">E-postsignatur</span>
                      <span className="text-[10px] text-gray-500">({currentSignature.name})</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowSignatureEditor(true);
                      }}
                      className="rounded bg-blue-50 border border-blue-200 px-2.5 py-1 text-[10px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Redigera
                    </button>
                  </div>
                </summary>
                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-[11px]" style={{ lineHeight: '1.6' }}>
                  <p className="mb-2 text-gray-700">{currentSignature.greeting}</p>
                  <div className="flex gap-2">
                    <AnimatedSignatureLogo 
                      src={currentSignature.logo} 
                      alt="Logo" 
                      className="h-16 w-16 flex-shrink-0"
                    />
                    <div className="w-[1.5px] bg-gray-300 rounded-full"></div>
                    <div className="flex-1 text-[10px]">
                      <p className="font-semibold text-gray-400">{currentSignature.name}</p>
                      <p className="font-bold text-gray-900 text-[11px]">{currentSignature.title}</p>
                      <p className="text-gray-800">{currentSignature.phone}</p>
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 px-5 py-4 bg-gray-50 space-y-3">
              {/* Primary Action */}
              <Button
                onClick={handleSendReply}
                disabled={isSending}
                className="w-full gap-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 py-3 text-sm font-bold text-white shadow-sm hover:from-pink-700 hover:to-rose-700 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <LoadingSpinner size="small" />
                    Skickar...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Skicka svar
                  </>
                )}
              </Button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-5 gap-2">
                <Button
                  onClick={() => setShowPreview(true)}
                  variant="outline"
                  className="gap-1.5 rounded-lg border-indigo-200 bg-indigo-50 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 h-auto"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Förhandsvisning
                </Button>
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  className="gap-1.5 rounded-lg border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 h-auto"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  Utkast
                </Button>
                <Button
                  onClick={() => setShowSnoozeDialog(true)}
                  variant="outline"
                  className="gap-1.5 rounded-lg border-blue-200 bg-blue-50 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 h-auto"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Senare
                </Button>
                <Button
                  onClick={() => setShowCompleteDialog(true)}
                  variant="outline"
                  className="gap-1.5 rounded-lg border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 h-auto"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Klar
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="gap-1.5 rounded-lg border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 h-auto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Radera
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Snooze Dialog */}
        {showSnoozeDialog && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 rounded-2xl">
            <div className="bg-white rounded-xl shadow-2xl p-5 w-full max-w-sm">
              <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Svara senare
              </h4>
              <div className="space-y-2">
                <button onClick={() => handleSnooze('1 timme')} className="w-full text-left rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <p className="text-sm font-semibold text-gray-900">Om 1 timme</p>
                </button>
                <button onClick={() => handleSnooze('Imorgon 09:00')} className="w-full text-left rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <p className="text-sm font-semibold text-gray-900">Imorgon 09:00</p>
                </button>
                <button onClick={() => handleSnooze('Måndag 09:00')} className="w-full text-left rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <p className="text-sm font-semibold text-gray-900">Måndag 09:00</p>
                </button>
                <button onClick={() => setShowSnoozeDialog(false)} className="w-full text-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                  <p className="text-sm font-medium text-gray-600">Avbryt</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Complete Dialog */}
        {showCompleteDialog && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 rounded-2xl">
            <div className="bg-white rounded-xl shadow-2xl p-5 w-full max-w-sm">
              <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Markera som hanterad
              </h4>
              <div className="space-y-2">
                <button onClick={() => handleComplete('Bokad')} className="w-full text-left rounded-lg border border-gray-200 p-3 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                  <p className="text-sm font-semibold text-gray-900">Bokad</p>
                </button>
                <button onClick={() => handleComplete('Besvarat')} className="w-full text-left rounded-lg border border-gray-200 p-3 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                  <p className="text-sm font-semibold text-gray-900">Besvarat</p>
                </button>
                <button onClick={() => handleComplete('Ej intresserad')} className="w-full text-left rounded-lg border border-gray-200 p-3 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                  <p className="text-sm font-semibold text-gray-900">Ej intresserad</p>
                </button>
                <button onClick={() => setShowCompleteDialog(false)} className="w-full text-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                  <p className="text-sm font-medium text-gray-600">Avbryt</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Signature Editor */}
        {showSignatureEditor && (
          <SignatureEditorModal
            onClose={() => setShowSignatureEditor(false)}
            onSignatureChange={setSelectedSignatureId}
            currentSignature={currentSignature}
            selectedSignatureId={selectedSignatureId}
          />
        )}

        {/* PREVIEW DIALOG */}
        {showPreview && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 rounded-2xl z-10">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 bg-gradient-to-r from-indigo-50 to-blue-50">
                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-indigo-600" />
                  Förhandsvisning (exakt som kunden ser det)
                </h4>
                <button
                  onClick={() => setShowPreview(false)}
                  className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="rounded-lg border-2 border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Till: {customerData.email}</p>
                    <p className="text-xs text-gray-500 mb-1">Från: {currentSignature.email}</p>
                    <p className="text-xs text-gray-500">Ämne: Re: Bokning av tid</p>
                  </div>

                  <div className="text-sm text-gray-800 whitespace-pre-wrap mb-6" style={{ lineHeight: '1.4' }}>
                    {draftText}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700 mb-3">{currentSignature.greeting}</p>
                    <div className="flex gap-3">
                      <AnimatedSignatureLogo 
                        src={currentSignature.logo} 
                        alt="Logo" 
                        className="h-16 w-16 flex-shrink-0"
                      />
                      <div className="w-[1.5px] bg-gray-300 rounded-full"></div>
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-gray-400">{currentSignature.name}</p>
                        <p className="font-bold text-gray-900 text-sm">{currentSignature.title}</p>
                        <p className="text-gray-800 mt-1">{currentSignature.phone}</p>
                        <p className="text-gray-600">{currentSignature.email}</p>
                        {currentSignature.address && (
                          <p className="text-gray-600 mt-1">{currentSignature.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-5 py-3 bg-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  Signaturen läggs till automatiskt när du skickar
                </p>
                <Button
                  onClick={() => setShowPreview(false)}
                  className="rounded-lg px-4 py-2 bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                >
                  Stäng
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}