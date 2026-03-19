import { MoreHorizontal, CheckCircle2, ChevronDown, Square, Bookmark, Wand2, Minimize2, Flame, Briefcase, Zap, Archive, Clock, Trash2, Edit3, Sparkles, Send, AlertTriangle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { SignatureEditorModal, defaultSignatures } from "./signature-editor-modal";
import { AnimatedSignatureLogo } from "./animated-signature-logo";
import { useMailbox } from "../context/mailbox-context";
import { useLanguage } from "../context/language-context";

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

export function EnhancedResponseStudio() {
  const { t } = useLanguage();
  const [selectedFilters, setSelectedFilters] = useState({
    kort: false,
    varm: true,
    proffsig: true,
  });
  const [draftText, setDraftText] = useState(`Hej Johan,

Vad kul att fredag kl 09:00 passar – det ser jag fram emot!

Din tid är nu bokad.

Du får en påminnelse dagen innan på sms.

Hör av dig om du har några frågor.`);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSignatureEditor, setShowSignatureEditor] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<Signature>(defaultSignatures.fazli);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>("fazli");
  
  // AI-transparency states
  const [isAIGenerated, setIsAIGenerated] = useState(true);
  const [aiConfidence, setAiConfidence] = useState<'high' | 'medium' | 'low'>('high');
  const [aiContext, setAiContext] = useState('kundens senaste behandling (PrP 14 jan 2025) och tidigare konversationer');

  // Word count and policy check
  const wordCount = draftText.trim().split(/\s+/).length;
  const recommendedWordCount = 150;
  const maxWordCount = 200;
  const hasViolation = draftText.toLowerCase().includes("gratis") || draftText.toLowerCase().includes("garanti");
  const isTooLong = wordCount > maxWordCount;

  const handleRiskLevel = () => {
    toast.info("Risknivå-inställningar");
  };

  const handlePriority = () => {
    toast.success("Prioritet: Hög");
  };

  const handleValue = () => {
    toast.info("Kundvärde: $46K");
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

  const handleSnooze = () => {
    toast.success("Konversation snoozad");
  };

  const handleSaveDraft = () => {
    toast.info("Utkast sparat");
  };

  const handleMarkHandled = () => {
    toast.success("Markerad som hanterad · Flyttad till arkiv");
  };

  const handleReturnLater = () => {
    toast.info("Välj påminnelse-tid");
  };

  const handleSendReply = () => {
    toast.success("Svar skickat till Johan Lagerström!");
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    toast.success("Meddelande flyttat till papperskorgen");
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    toast.info("Radering avbruten");
  };

  // Draft editing functions
  const handleShortenMessage = () => {
    toast.success("Förkortar text...");
    setDraftText("Hej Johan,\n\nPerfekt! Din tid fredag kl 09:00 är bokad.\n\nDu får påminnelse på sms dagen innan.");
  };

  const handleMakeWarmer = () => {
    toast.success("Gör varmare...");
    setDraftText(`Hej Johan! 😊

Så kul att fredag kl 09:00 passar perfekt – jag ser verkligen fram emot att träffa dig!

Din tid är nu bokad och jag har noterat allt.

Du får en vänlig påminnelse på sms dagen innan.

Hör gärna av dig om du har några frågor eller funderingar innan dess!

Varma hälsningar!`);
  };

  const handleMoreProfessional = () => {
    toast.success("Gör mer professionell...");
    setDraftText(`Hej Johan,

Tack för ditt meddelande. Din bokningsförfrågan är nu bekräftad.

Tid: Fredag kl 09:00
Behandling: PrP

En påminnelse kommer att skickas via SMS 24 timmar innan utsatt tid.

Vid eventuella frågor är du välkommen att kontakta oss.

Med vänliga hälsningar,
CCO Kliniken`);
  };

  const handleSharperTone = () => {
    toast.success("Gör skarpare...");
    setDraftText("Fredag 09:00 är bokad.\n\nPåminnelse skickas på SMS dagen innan.");
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

  return (
    <div className="flex h-full flex-col">
      {/* Header - Kompakt */}
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
        <h2 className="text-[13px] font-semibold text-gray-900">Svarstudio</h2>
        <button 
          onClick={handleMoreOptions}
          className="rounded p-0.5 hover:bg-gray-50 transition-colors"
        >
          <MoreHorizontal className="h-[13px] w-[13px] text-gray-500" />
        </button>
      </div>

      {/* Content - Kompakt scrollbar */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Priority Pills - Kompakta */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handleRiskLevel}
            className="rounded-full border border-gray-200 bg-rose-50/40 px-2 py-0.5 text-[9px] font-medium text-gray-700"
          >
            Risk
          </button>
          <button 
            onClick={handlePriority}
            className="rounded-full bg-gradient-to-br from-rose-300 to-rose-200 px-2 py-0.5 text-[9px] font-semibold text-rose-900"
          >
            Hög
          </button>
          <button 
            onClick={handleValue}
            className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[9px] font-medium text-gray-700"
          >
            $46K
          </button>
        </div>

        {/* Quick Filters - Kompakta pills */}
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 p-1.5 border border-gray-100">
          <button
            onClick={() => toggleFilter('kort')}
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium transition-all ${
              selectedFilters.kort 
                ? 'border-gray-400 bg-gray-100' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <Square className="h-2 w-2 rounded-sm border border-gray-500" />
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
            <Flame className="h-2 w-2 text-amber-600" />
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
            <Briefcase className="h-2 w-2 text-blue-600" />
            Proffsig
          </button>
        </div>

        {/* Recommended Tone */}
        <div className="mb-4 rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-yellow-50/50 p-3 shadow-sm">
          <h3 className="mb-1.5 text-[13px] font-semibold text-gray-900">
            Rekommenderat läge: Varm
          </h3>
          <ul className="space-y-0.5 text-[11px] text-gray-700">
            <li>• Varför: senaste kundmeddelandet är</li>
            <li>• vänligt och gäller ett bokningsärende.</li>
          </ul>
        </div>

        {/* AI Style Adjustments - Kompakta små knappar */}
        <div className="space-y-1.5">
          <p className="text-[9px] font-semibold text-gray-600">✨ AI-justeringar</p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleShortenMessage}
              className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-white px-2 py-1.5 text-left transition-all hover:border-amber-300 hover:shadow-sm"
            >
              <Minimize2 className="h-3 w-3 text-amber-600" />
              <div className="flex-1">
                <p className="text-[9px] font-bold text-amber-900">Förkorta</p>
                <p className="text-[7px] text-amber-700">Mer koncis</p>
              </div>
            </button>

            <button
              onClick={handleMakeWarmer}
              className="flex items-center gap-1.5 rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-white px-2 py-1.5 text-left transition-all hover:border-orange-300 hover:shadow-sm"
            >
              <Flame className="h-3 w-3 text-orange-600" />
              <div className="flex-1">
                <p className="text-[9px] font-bold text-orange-900">Varmare</p>
                <p className="text-[7px] text-orange-700">Personlig</p>
              </div>
            </button>

            <button
              onClick={handleMoreProfessional}
              className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-white px-2 py-1.5 text-left transition-all hover:border-blue-300 hover:shadow-sm"
            >
              <Briefcase className="h-3 w-3 text-blue-600" />
              <div className="flex-1">
                <p className="text-[9px] font-bold text-blue-900">Proffsig</p>
                <p className="text-[7px] text-blue-700">Formell</p>
              </div>
            </button>

            <button
              onClick={handleSharperTone}
              className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-white px-2 py-1.5 text-left transition-all hover:border-purple-300 hover:shadow-sm"
            >
              <Zap className="h-3 w-3 text-purple-600" />
              <div className="flex-1">
                <p className="text-[9px] font-bold text-purple-900">Skarpare</p>
                <p className="text-[7px] text-purple-700">Rakt på sak</p>
              </div>
            </button>
          </div>
        </div>

        {/* AI-TRANSPARENS BADGE - NYT */}
        {isAIGenerated && (
          <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 shadow-sm">
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-blue-900 mb-0.5">
                  🤖 AI-genererat förslag
                </p>
                <p className="text-[9px] text-blue-700 leading-relaxed">
                  Baserat på {aiContext}
                </p>
              </div>
              <div className={`flex-shrink-0 px-2 py-0.5 rounded-full border ${
                aiConfidence === 'high' 
                  ? 'bg-green-100 border-green-300' 
                  : aiConfidence === 'medium'
                  ? 'bg-yellow-100 border-yellow-300'
                  : 'bg-red-100 border-red-300'
              }`}>
                <span className={`text-[8px] font-bold ${
                  aiConfidence === 'high'
                    ? 'text-green-800'
                    : aiConfidence === 'medium'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}>
                  {aiConfidence === 'high' ? 'Hög tillförlitlighet' : aiConfidence === 'medium' ? 'Medel' : 'Låg'}
                </span>
              </div>
            </div>
            
            {/* Granskningsvarning */}
            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-50/50 border border-amber-200">
              <AlertTriangle className="h-3 w-3 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-[9px] font-semibold text-amber-900">
                Granska alltid AI-genererade svar innan sändning
              </p>
            </div>
          </div>
        )}

        {/* Message Preview - Kompakt */}
        <div className="space-y-2 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            className={`w-full min-h-[120px] text-[11px] leading-relaxed text-gray-800 focus:outline-none resize-none ${
              hasViolation ? 'border border-red-200 rounded-lg p-2' : ''
            }`}
          />
          
          {/* Signature Section - Kompakt */}
          <div className="border-t border-gray-200 pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[9px] font-medium text-gray-600">E-postsignatur</p>
              <button
                onClick={handleEditSignature}
                className="flex items-center gap-0.5 rounded bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[8px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Edit3 className="h-2 w-2" />
                Redigera
              </button>
            </div>
            <div className="rounded bg-gray-50 border border-gray-200 p-2 text-[10px] leading-relaxed">
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
                  <p className="font-bold text-gray-900 text-[8px] mb-1">{currentSignature.title}</p>
                  <p className="text-gray-800">{currentSignature.phone}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Word count - Kompakt */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <span className={`text-[9px] font-medium ${
              isTooLong ? 'text-red-600' : wordCount > recommendedWordCount ? 'text-amber-600' : 'text-gray-500'
            }`}>
              {wordCount} ord
            </span>
            {hasViolation && (
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[8px] font-medium text-red-700">
                ⚠️ Policy
              </span>
            )}
          </div>
        </div>

        {/* Policy Warning - Kompakt */}
        {hasViolation && (
          <div className="rounded bg-red-50 border border-red-200 p-2">
            <p className="text-[9px] font-semibold text-red-900 mb-0.5">
              ⚠️ Möjlig policy-överträdelse
            </p>
            <p className="text-[8px] text-red-700">
              Texten innehåller ord som kan bryta mot policy
            </p>
          </div>
        )}

        {/* Action Buttons - Kompakta */}
        <div className="space-y-1.5">
          <Button
            onClick={handleSendReply}
            className="w-full gap-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 py-2 text-[11px] font-bold text-white shadow-sm hover:from-pink-700 hover:to-pink-800"
          >
            <Send className="h-3 w-3" />
            Skicka svar
          </Button>

          <div className="grid grid-cols-2 gap-1.5">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              className="gap-1 rounded-lg border border-gray-200 bg-white py-1.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 h-auto"
            >
              <Bookmark className="h-2.5 w-2.5" />
              Utkast
            </Button>
            <Button
              onClick={handleReturnLater}
              variant="outline"
              className="gap-1 rounded-lg border border-blue-200 bg-blue-50 py-1.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 h-auto"
            >
              <Clock className="h-2.5 w-2.5" />
              Senare
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <Button
              onClick={handleMarkHandled}
              variant="outline"
              className="gap-1 rounded-lg border border-emerald-200 bg-emerald-50 py-1.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 h-auto"
            >
              <CheckCircle2 className="h-2.5 w-2.5" />
              Klar
            </Button>
            <Button
              onClick={handleCopyDraft}
              variant="outline"
              className="gap-1 rounded-lg border border-gray-200 bg-white py-1.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 h-auto"
            >
              <Archive className="h-2.5 w-2.5" />
              Kopiera
            </Button>
          </div>

          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="outline"
            className="w-full gap-1 rounded-lg border border-red-200 bg-red-50 py-1.5 text-[10px] font-semibold text-red-700 hover:bg-red-100 h-auto"
          >
            <Trash2 className="h-2.5 w-2.5" />
            Radera
          </Button>
        </div>

        {/* Compliance Footer - Kompakt */}
        <div className={`rounded px-2 py-1 text-center text-[8px] font-medium ${
          hasViolation ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'
        }`}>
          {hasViolation ? 'Policy RISK' : 'Policy OK'} · Signatur OK
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-gray-900">Radera meddelande?</h3>
                  <p className="text-[12px] text-gray-500">Detta går att ångra inom 30 dagar</p>
                </div>
              </div>
              
              <div className="mb-5 rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-[12px] text-amber-900">
                  <strong>Säker radering:</strong> Meddelandet flyttas till Papperskorg (inte permanent raderat). Du kan återställa det inom 30 dagar.
                </p>
              </div>

              <div className="mb-4 rounded-lg bg-gray-50 p-3">
                <p className="text-[11px] font-medium text-gray-700 mb-1">Meddelande:</p>
                <p className="text-[11px] text-gray-600">Från: Johan Lagerström</p>
                <p className="text-[11px] text-gray-600">Ämne: Bokning av tid</p>
                <p className="text-[11px] text-gray-600">Tid: Idag 10:58</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={cancelDelete}
                  variant="outline"
                  className="flex-1 rounded-full border-gray-200 px-4 py-2.5 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
                >
                  Avbryt
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-red-700"
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
  );
}