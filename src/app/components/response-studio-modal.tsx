import { MoreHorizontal, CheckCircle2, Square, Bookmark, Minimize2, Flame, Briefcase, Zap, Archive, Clock, Trash2, Edit3, Sparkles, Send, X, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, FileText, Smile, Heart, Target, Wand2, Copy, RefreshCw, Volume2, Scissors, Thermometer, Shield, Star, User, Mail, Phone, MapPin, Package, Bot, ClipboardList, SmilePlus } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { SignatureEditorModal, defaultSignatures } from "./signature-editor-modal";
import { AnimatedSignatureLogo } from "./animated-signature-logo";
import { useLanguage } from "../context/language-context";
import { ValidatedInput } from "./validated-input";
import { useFormValidation } from "../hooks/use-form-validation";
import { useApiErrorHandler } from "../hooks/use-api-error-handler";
import { LoadingSpinner } from "./loading-states";

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

interface ResponseStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDraft?: string;
}

// Vanliga emojis för snabb-insättning
const quickEmojis = [
  '😊', '🙏', '✨', '💫', '❤️', '💪', '👍', '🎉',
  '📅', '⏰', '💉', '🌟', '🔥', '💝', '🌸', '☀️'
];

export function ResponseStudioModal({ isOpen, onClose, initialDraft = "" }: ResponseStudioModalProps) {
  const [selectedFilters, setSelectedFilters] = useState({
    kort: false,
    varm: true,
    proffsig: true,
  });
  
  const [draftText, setDraftText] = useState(initialDraft || `Hej Johan,

Vad kul att fredag kl 09:00 passar – det ser jag fram emot!

Din tid är nu bokad.

Du får en påminnelse dagen innan på sms.

Hör av dig om du har några frågor.`);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSignatureEditor, setShowSignatureEditor] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<Signature>(defaultSignatures.fazli);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>("fazli");
  const [isSending, setIsSending] = useState(false);
  
  // AI SETTINGS
  const [aiMode, setAiMode] = useState<'conversation-only' | 'full-context'>('conversation-only');
  const [aiTone, setAiTone] = useState<'match-company' | 'professional' | 'friendly'>('match-company');
  
  const handleError = useApiErrorHandler();
  
  // Update draftText when initialDraft changes
  useEffect(() => {
    if (initialDraft) {
      setDraftText(initialDraft);
    }
  }, [initialDraft]);

  // Form validation
  const { values, errors, handleChange, validateForm } = useFormValidation({
    initialValues: {
      message: draftText,
    },
    validationRules: {
      message: { required: true, minLength: 10, maxLength: 2000 },
    },
  });

  const { language } = useLanguage();

  // Word count and policy check
  const wordCount = draftText.trim().split(/\s+/).length;
  const recommendedWordCount = 150;
  const maxWordCount = 200;
  const hasViolation = draftText.toLowerCase().includes("gratis") || draftText.toLowerCase().includes("garanti");
  const isTooLong = wordCount > maxWordCount;
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

  const handleRiskLevel = () => {
    toast.info("Risknivå-inställningar");
  };

  const handlePriority = () => {
    toast.success("Prioritet: Hög");
  };

  const handleValue = () => {
    toast.info(`Kundvärde: ${(customerData.ltv / 1000).toFixed(0)}K SEK`);
  };

  const handleMoreOptions = () => {
    toast.info("Svarstudio-alternativ");
  };

  const toggleFilter = (filter: keyof typeof selectedFilters) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
    toast.success(`${filter.charAt(0).toUpperCase() + filter.slice(1)}: ${!selectedFilters[filter] ? 'På' : 'Av'}`);
  };

  const handleSaveDraft = () => {
    toast.success("💾 Utkast sparat · Finns i 'Utkast'-filtret");
  };

  const handleMarkHandled = () => {
    toast.success("Markerad som hanterad · Flyttad till arkiv");
    onClose();
  };

  const handleReturnLater = () => {
    toast.info("Välj påminnelse-tid");
  };

  const handleSendReply = async () => {
    // Validate form
    if (!validateForm()) {
      toast.error("Vänligen kontrollera formuläret");
      return;
    }

    if (!draftText.trim()) {
      toast.error("Meddelandet kan inte vara tomt");
      return;
    }

    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success(`✅ Svar skickat till ${customerData.name}!`);
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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    toast.success("🗑️ Meddelande flyttat till papperskorgen (kan återställas inom 30 dagar)");
    setShowDeleteConfirm(false);
    onClose();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    toast.info("Radering avbruten");
  };

  // Draft editing functions
  const handleShortenMessage = () => {
    toast.success("✂️ Förkortar text...");
    setDraftText(`Hej ${customerData.name.split(' ')[0]}!

Perfekt! Din tid fredag kl 09:00 är bokad.

Du får påminnelse på sms dagen innan.`);
  };

  const handleMakeWarmer = () => {
    toast.success("🔥 Gör varmare...");
    setDraftText(`Hej ${customerData.name.split(' ')[0]}! 😊

Så kul att fredag kl 09:00 passar perfekt – jag ser verkligen fram emot att träffa dig!

Din tid är nu bokad och jag har noterat allt.

Du får en vänlig påminnelse på sms dagen innan.

Hör gärna av dig om du har några frågor eller funderingar innan dess!`);
  };

  const handleMoreProfessional = () => {
    toast.success("💼 Gör mer professionell...");
    setDraftText(`Hej ${customerData.name.split(' ')[0]},

Tack för ditt meddelande. Din bokningsförfrågan är nu bekräftad.

Tid: Fredag kl 09:00
Behandling: PRP
Behandlare: Dr. Eriksson

En påminnelse kommer att skickas via SMS 24 timmar innan utsatt tid.

Vid eventuella frågor är du välkommen att kontakta oss.`);
  };

  const handleSharperTone = () => {
    toast.success("⚡ Gör skarpare...");
    setDraftText("Fredag 09:00 är bokad.\n\nPåminnelse skickas på SMS dagen innan.");
  };

  const handleImproveGrammar = () => {
    toast.success("✨ Grammatik förbättrad!");
  };

  const handleRegenerate = () => {
    toast.success("🔄 Regenererar med AI...");
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftText);
    toast.success("Kopierat till urklipp!");
  };

  const handleEditSignature = () => {
    setShowSignatureEditor(true);
  };

  const handleSignatureEditorClose = () => {
    setShowSignatureEditor(false);
  };

  const handleSignatureChange = (signatureId: string) => {
    setSelectedSignatureId(signatureId);
    toast.success("Signatur bytt!");
  };

  const insertEmoji = (emoji: string) => {
    setDraftText(prev => prev + emoji);
    setShowEmojiPicker(false);
    toast.success(`${emoji} tillagd!`);
  };

  // Template functions
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
    toast.success("📋 Mall tillagd!");
  };

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

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header - KOMPAKT MED VIP/LTV */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-600" />
            <h3 className="text-sm font-bold text-gray-900">Svarstudio</h3>
            {/* Customer Pills - INLINE & KOMPAKT */}
            <div className="flex items-center gap-1 ml-2">
              <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[9px] font-medium text-gray-700">
                {customerData.intent}
              </span>
              {customerData.vip && (
                <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 text-[9px] font-bold text-white flex items-center gap-0.5">
                  <Star className="h-2 w-2 fill-white" />
                  VIP
                </span>
              )}
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                {(customerData.ltv / 1000).toFixed(0)}K SEK
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleMoreOptions}
              className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content - TVÅ KOLUMNER: VÄNSTER = KUNDINFO, HÖGER = MEDDELANDE */}
        <div className="flex-1 overflow-hidden flex">
          {/* LEFT SIDEBAR: KUNDKONTEXT - ALLTID SYNLIG */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4 space-y-3">
              {/* RELATIONSSIGNAL - VIP BOX ★★★ */}
              <div className="rounded-lg border-2 border-amber-300 p-3 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-amber-600 fill-amber-600" />
                  <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Relationssignal
                  </h5>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" />
                    VIP
                  </span>
                  <span className="text-sm font-bold text-amber-900">126 000 kr</span>
                </div>
                <p className="text-[10px] text-amber-800 leading-tight">
                  Återkommande patient · Högt lifetime value · Bevara relationen
                </p>
              </div>

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
                        <span className="text-[10px] text-green-600 font-medium">😊 Glad & ivrig</span>
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

              {/* GÖR DETTA NU - BOKNINGSKONTEXT */}
              <div className="rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300 p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-pink-600" />
                  <h5 className="text-xs font-bold text-pink-900 uppercase tracking-wide">🎯 Gör detta nu</h5>
                </div>
                <p className="text-[11px] font-semibold text-gray-900 mb-2">
                  Skicka bokningsförslag
                </p>
                <p className="text-[10px] text-gray-700 leading-relaxed mb-3">
                  Kunden har visat intresse för PRP-behandling och föredrar morgontider på fredagar.
                </p>
                <button className="w-full rounded-lg bg-pink-600 px-3 py-2 text-xs font-bold text-white hover:bg-pink-700 transition-colors shadow-sm">
                  📅 Boka fredag 09:00
                </button>
              </div>

              {/* Bokningsstatus */}
              <div className="rounded-lg bg-white border border-gray-200 p-3">
                <h5 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-gray-600" />
                  Bokningsstatus
                </h5>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Läge:</span>
                    <span className="font-semibold text-green-600">Kan erbjudas nu</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Risk:</span>
                    <span className="font-semibold text-amber-600">Bevaka risk</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Follow-up:</span>
                    <span className="font-semibold text-blue-600">Idag 15:15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: MESSAGE AREA */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
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

              {/* MESSAGE EDITOR - TOP PRIORITY! */}
              <div className="space-y-2 rounded-lg border-2 border-pink-200 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-900">Till: {customerData.name}</label>
                  <div className="flex items-center gap-1">
                    {/* Quick AI Actions - KOMPAKT */}
                    <button
                      onClick={handleMakeWarmer}
                      className="p-1 rounded hover:bg-orange-50 transition-colors"
                      title="Gör varmare"
                    >
                      <Flame className="h-3.5 w-3.5 text-orange-600" />
                    </button>
                    <button
                      onClick={handleMoreProfessional}
                      className="p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Gör proffsig"
                    >
                      <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                    </button>
                    <button
                      onClick={handleShortenMessage}
                      className="p-1 rounded hover:bg-purple-50 transition-colors"
                      title="Förkorta"
                    >
                      <Scissors className="h-3.5 w-3.5 text-purple-600" />
                    </button>
                    <button
                      onClick={handleImproveGrammar}
                      className="p-1 rounded hover:bg-green-50 transition-colors"
                      title="Förbättra grammatik"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-green-600" />
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="p-1 rounded hover:bg-pink-50 transition-colors"
                      title="Regenerera"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-pink-600" />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                        className="p-1 rounded hover:bg-yellow-50 transition-colors" 
                        title="Lägg till emoji"
                      >
                        <SmilePlus className="h-3.5 w-3.5 text-yellow-600" />
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
                  className={`w-full min-h-[280px] text-sm leading-relaxed text-gray-800 focus:outline-none resize-none ${
                    hasViolation ? 'border border-red-200 rounded-lg p-3' : ''
                  }`}
                  placeholder="Skriv ditt meddelande här..."
                />
                
                {/* Word count & Policy - KOMPAKT */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className={`text-[10px] font-medium ${
                    isTooLong ? 'text-red-600' : wordCount > recommendedWordCount ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    {wordCount} ord {isTooLong ? '(för långt)' : wordCount > recommendedWordCount ? '(lite långt)' : ''}
                  </span>
                  <div className="flex items-center gap-2">
                    {hasViolation && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-medium text-red-700">
                        ⚠️ Policy risk
                      </span>
                    )}
                    {!hasViolation && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-medium text-green-700">
                        ✅ Policy OK
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quality Checks */}
              {(hasMissingTime || hasMissingPrice) && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-amber-900 mb-1">Kvalitetskontroll</p>
                      <ul className="space-y-0.5 text-[10px] text-amber-800">
                        {hasMissingTime && <li>• Ingen tid angiven (rekommenderas för bokningar)</li>}
                        {hasMissingPrice && <li>• Inget pris nämnt (bra att inkludera)</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Policy Warning - Om behövs */}
              {hasViolation && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-2">
                  <p className="text-[10px] font-semibold text-red-900">
                    ⚠️ Texten innehåller ord som kan bryta mot policy
                  </p>
                </div>
              )}

              {/* SNABBMALLAR - COLLAPSIBLE */}
              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-3 w-3 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">Snabbmallar</span>
                    </div>
                  </div>
                </summary>
                <div className="mt-2 grid grid-cols-2 gap-2">
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
              </details>

              {/* AI-REKOMMENDATIONER & INSTÄLLNINGAR - COLLAPSIBLE */}
              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white px-3 py-2 hover:border-blue-300 transition-colors">
                    <Sparkles className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-900">AI-verktyg & Inställningar</span>
                    <span className="ml-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white">
                      92%
                    </span>
                  </div>
                </summary>
                <div className="mt-2 space-y-2">
                  {/* AI-STÖD 92% - PROMINENT BADGE */}
                  <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-green-600" />
                        <h5 className="text-xs font-bold text-green-900 uppercase tracking-wide">✨ AI-stöd</h5>
                      </div>
                      <div className="ml-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-sm font-bold text-white shadow-sm">
                        92%
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-green-900 mb-1">
                      Bokningsförslag rekommenderas
                    </p>
                    <p className="text-[10px] text-green-800 leading-tight">
                      Baserat på konversationskontext, kundpreferenser och bokningshistorik rekommenderar AI starkt att skicka ett bokningsförslag för fredag 09:00.
                    </p>
                  </div>

                  {/* AI Recommendations */}
                  <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-2.5">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-3.5 w-3.5 text-purple-600" />
                      <h5 className="text-[10px] font-bold text-gray-900">AI-rekommendationer</h5>
                    </div>
                    <div className="space-y-1.5">
                      <button
                        onClick={handleAddBookingLink}
                        className="w-full text-left rounded-lg bg-white border border-purple-200 p-2 hover:bg-purple-50 transition-colors"
                      >
                        <p className="text-[10px] font-semibold text-gray-900">Lägg till bokningslänk</p>
                        <p className="text-[9px] text-gray-600">Gör det enkelt att boka direkt</p>
                      </button>
                      <button
                        onClick={handleSuggestUpsell}
                        className="w-full text-left rounded-lg bg-white border border-purple-200 p-2 hover:bg-purple-50 transition-colors"
                      >
                        <p className="text-[10px] font-semibold text-gray-900">Föreslå paketpris</p>
                        <p className="text-[9px] text-gray-600">Kunden är intresserad av PRP</p>
                      </button>
                      <button
                        onClick={handleMakeWarmer}
                        className="w-full text-left rounded-lg bg-white border border-purple-200 p-2 hover:bg-purple-50 transition-colors"
                      >
                        <p className="text-[10px] font-semibold text-gray-900">Använd varm ton</p>
                        <p className="text-[9px] text-gray-600">Matchar kundens stil</p>
                      </button>
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 p-1.5 border border-gray-100">
                    <button
                      onClick={() => toggleFilter('kort')}
                      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium transition-all ${
                        selectedFilters.kort 
                          ? 'border-gray-400 bg-gray-100' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Square className="h-2.5 w-2.5 rounded-sm border border-gray-500" />
                      Kort
                    </button>
                    <button
                      onClick={() => toggleFilter('varm')}
                      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium transition-all ${
                        selectedFilters.varm 
                          ? 'border-amber-400 bg-amber-50' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Flame className="h-2.5 w-2.5 text-amber-600" />
                      Varm
                    </button>
                    <button
                      onClick={() => toggleFilter('proffsig')}
                      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium transition-all ${
                        selectedFilters.proffsig 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Briefcase className="h-2.5 w-2.5 text-blue-600" />
                      Proffsig
                    </button>
                  </div>

                  {/* Recommended Tone */}
                  <div className="rounded-lg border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-yellow-50/50 p-2">
                    <p className="text-[10px] text-gray-700">
                      <span className="font-semibold">💡 Rekommenderat:</span> Varm ton (senaste meddelandet är vänligt och gäller bokning)
                    </p>
                  </div>

                  {/* AI SETTINGS */}
                  <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-300 p-2.5">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-3.5 w-3.5 text-indigo-600" />
                      <h5 className="text-[10px] font-bold text-gray-900">AI-inställningar</h5>
                    </div>
                    
                    {/* AI Mode */}
                    <div className="mb-2">
                      <p className="text-[9px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Datakällor:</p>
                      <div className="space-y-1">
                        <label className="flex items-start gap-1.5 cursor-pointer group">
                          <input
                            type="radio"
                            checked={aiMode === 'conversation-only'}
                            onChange={() => setAiMode('conversation-only')}
                            className="mt-0.5 h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <p className="text-[10px] font-semibold text-gray-900 group-hover:text-indigo-700">Endast konversation</p>
                            <p className="text-[9px] text-gray-600 leading-tight">AI använder bara mejlkonversationen.</p>
                          </div>
                        </label>
                        <label className="flex items-start gap-1.5 cursor-pointer group">
                          <input
                            type="radio"
                            checked={aiMode === 'full-context'}
                            onChange={() => setAiMode('full-context')}
                            className="mt-0.5 h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <p className="text-[10px] font-semibold text-gray-900 group-hover:text-indigo-700">Full kontext</p>
                            <p className="text-[9px] text-gray-600 leading-tight">AI använder allt: önskemål, noter, historik och preferenser.</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* AI Tone */}
                    <div className="pt-2 border-t border-indigo-200">
                      <p className="text-[9px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Tonalitet:</p>
                      <div className="space-y-1">
                        <label className="flex items-start gap-1.5 cursor-pointer group">
                          <input
                            type="radio"
                            checked={aiTone === 'match-company'}
                            onChange={() => setAiTone('match-company')}
                            className="mt-0.5 h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <p className="text-[10px] font-semibold text-gray-900 group-hover:text-indigo-700">Matcha företaget</p>
                            <p className="text-[9px] text-gray-600 leading-tight">Matchar företagets vanliga svarsstil.</p>
                          </div>
                        </label>
                        <label className="flex items-start gap-1.5 cursor-pointer group">
                          <input
                            type="radio"
                            checked={aiTone === 'professional'}
                            onChange={() => setAiTone('professional')}
                            className="mt-0.5 h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <p className="text-[10px] font-semibold text-gray-900 group-hover:text-indigo-700">Professionell</p>
                            <p className="text-[9px] text-gray-600 leading-tight">Formell och saklig ton.</p>
                          </div>
                        </label>
                        <label className="flex items-start gap-1.5 cursor-pointer group">
                          <input
                            type="radio"
                            checked={aiTone === 'friendly'}
                            onChange={() => setAiTone('friendly')}
                            className="mt-0.5 h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <p className="text-[10px] font-semibold text-gray-900 group-hover:text-indigo-700">Vänlig</p>
                            <p className="text-[9px] text-gray-600 leading-tight">Varm och personlig ton.</p>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {/* Warning if Full Context */}
                    {aiMode === 'full-context' && (
                      <div className="mt-2 rounded-lg bg-amber-50 border border-amber-300 p-1.5">
                        <div className="flex items-start gap-1">
                          <AlertCircle className="h-3 w-3 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-[9px] text-amber-800 leading-tight">
                            <strong>OBS:</strong> AI kan nu ta beslut baserat på noter och historik. Granska alltid svaret!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </details>

              {/* Signature - COLLAPSIBLE */}
              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Edit3 className="h-3 w-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700">E-postsignatur</span>
                      <span className="text-[10px] text-gray-500">({currentSignature.name})</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditSignature();
                      }}
                      className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[9px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Redigera
                    </button>
                  </div>
                </summary>
                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-[10px] leading-relaxed">
                  <p className="mb-2 text-gray-700">{currentSignature.greeting}</p>
                  <div className="flex gap-2">
                    <AnimatedSignatureLogo 
                      src={currentSignature.logo} 
                      alt="Logo" 
                      className="h-16 w-16 flex-shrink-0"
                    />
                    <div className="w-[1.5px] bg-gray-300 rounded-full"></div>
                    <div className="flex-1 text-[9px]">
                      <p className="font-semibold text-gray-400">{currentSignature.name}</p>
                      <p className="font-bold text-gray-900 text-[10px]">{currentSignature.title}</p>
                      <p className="text-gray-800">{currentSignature.phone}</p>
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Footer Actions - KOMPAKT */}
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 space-y-2">
              {/* Primary Action */}
              <Button
                onClick={handleSendReply}
                disabled={isSending}
                className="w-full gap-2 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 py-2.5 text-sm font-bold text-white shadow-sm hover:from-pink-700 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Secondary Actions - KOMPAKT GRID */}
              <div className="grid grid-cols-4 gap-1.5">
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  className="gap-1 rounded-lg border border-gray-200 bg-white py-1.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 h-auto"
                >
                  <Bookmark className="h-3 w-3" />
                  Utkast
                </Button>
                <Button
                  onClick={handleReturnLater}
                  variant="outline"
                  className="gap-1 rounded-lg border border-blue-200 bg-blue-50 py-1.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 h-auto"
                >
                  <Clock className="h-3 w-3" />
                  Senare
                </Button>
                <Button
                  onClick={handleMarkHandled}
                  variant="outline"
                  className="gap-1 rounded-lg border border-emerald-200 bg-emerald-50 py-1.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 h-auto"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Klar
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="gap-1 rounded-lg border border-red-200 bg-red-50 py-1.5 text-[10px] font-semibold text-red-700 hover:bg-red-100 h-auto"
                >
                  <Trash2 className="h-3 w-3" />
                  Radera
                </Button>
              </div>

              {/* Compliance - SUPER KOMPAKT */}
              <div className={`rounded px-2 py-1 text-center text-[9px] font-medium ${
                hasViolation ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {hasViolation ? '⚠️ Policy RISK' : '✅ Policy OK'}
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Radera meddelande?</h3>
                      <p className="text-sm text-gray-500">Detta går att ångra inom 30 dagar</p>
                    </div>
                  </div>
                  
                  <div className="mb-5 rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <p className="text-sm text-amber-900">
                      <strong>Säker radering:</strong> Meddelandet flyttas till Papperskorg (inte permanent raderat). Du kan återställa det inom 30 dagar.
                    </p>
                  </div>

                  <div className="mb-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Meddelande:</p>
                    <p className="text-xs text-gray-600">Från: {customerData.name}</p>
                    <p className="text-xs text-gray-600">Ämne: Bokning av tid</p>
                    <p className="text-xs text-gray-600">Tid: Idag 10:58</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={cancelDelete}
                      variant="outline"
                      className="flex-1 rounded-full border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Avbryt
                    </Button>
                    <Button
                      onClick={confirmDelete}
                      className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Flytta till papperskorg
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Signature Editor Modal */}
            {showSignatureEditor && (
              <SignatureEditorModal
                onClose={handleSignatureEditorClose}
                onSignatureChange={handleSignatureChange}
                currentSignature={currentSignature}
                selectedSignatureId={selectedSignatureId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}