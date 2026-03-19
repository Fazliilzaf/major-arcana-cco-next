import { MoreHorizontal, CheckCircle2, ChevronDown, Square, Bookmark, Wand2, Minimize2, Flame, Briefcase, Zap, Sparkles, Calendar, Copy, Send } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EmailSignature } from "./email-signature";

export function ResponseStudio() {
  const { t } = useTranslation();
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
    toast.info(t("studio.options"));
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

  const handleSendReply = () => {
    toast.success("Svar skickat till Johan Lagerström!");
  };

  // Draft editing functions
  const handleShortenDraft = () => {
    toast.success("Förkortar text...");
    setDraftText("Hej Johan,\n\nPerfekt! Din tid fredag kl 09:00 är bokad.\n\nDu får påminnelse på sms dagen innan.");
  };

  const handleWarmerTone = () => {
    toast.success("Gör varmare...");
  };

  const handleMoreProfessional = () => {
    toast.success("Gör mer professionell...");
  };

  const handleSharperTone = () => {
    toast.success("Gör skarpare...");
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftText);
    toast.success(t("studio.copiedToClipboard"));
  };

  const handleGenerateAI = () => {
    toast.info("AI-generera svar");
  };

  const handleSchedule = () => {
    toast.info("Schemalägg");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="text-[16px] font-semibold text-gray-900">Svarstudio</h2>
        <button 
          onClick={handleMoreOptions}
          className="rounded-lg p-1 hover:bg-gray-50 transition-colors"
        >
          <MoreHorizontal className="h-[16px] w-[16px] text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Priority and Temperature Selector */}
        <div className="mb-4 flex items-center gap-2">
          <button 
            onClick={handleRiskLevel}
            className="rounded-full border border-gray-200 bg-rose-50/40 px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm hover:bg-rose-100/40 hover:border-rose-200 transition-all"
          >
            Risknivå
          </button>
          <button 
            onClick={handlePriority}
            className="rounded-full bg-gradient-to-br from-rose-300 to-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-900 shadow-sm hover:from-rose-400 hover:to-rose-300 transition-all"
          >
            Hög
          </button>
          <button 
            onClick={handleValue}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            $46K
          </button>
          <button 
            onClick={handleMoreOptions}
            className="ml-auto rounded-lg p-1 hover:bg-gray-50 transition-colors"
          >
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-50/50 p-2.5 border border-gray-100">
          <button
            onClick={() => toggleFilter('kort')}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 shadow-sm transition-all ${
              selectedFilters.kort 
                ? 'border-gray-400 bg-gray-100' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <Square className="h-3 w-3 rounded-sm border-2 border-gray-500" strokeWidth={2.5} />
            <span className="text-[11px] font-medium text-gray-800">Kort</span>
          </button>
          <button
            onClick={() => toggleFilter('varm')}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 shadow-sm transition-all ${
              selectedFilters.varm 
                ? 'border-amber-400 bg-amber-50' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-amber-700 to-amber-600 shadow-sm" />
            <span className="text-[11px] font-medium text-gray-800">Varm</span>
          </button>
          <button
            onClick={() => toggleFilter('proffsig')}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 shadow-sm transition-all ${
              selectedFilters.proffsig 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" strokeWidth={2.5} />
            <span className="text-[11px] font-medium text-gray-800">Proffsig</span>
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

        {/* Draft Editing Toolbar */}
        <div className="mb-3 flex flex-wrap gap-1.5 rounded-xl border border-gray-200 bg-gray-50/50 p-2.5">
          <button
            onClick={handleShortenDraft}
            className="flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <Minimize2 className="h-3 w-3" />
            Förkorta
          </button>
          <button
            onClick={handleWarmerTone}
            className="flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <Flame className="h-3 w-3" />
            Varmare
          </button>
          <button
            onClick={handleMoreProfessional}
            className="flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <Briefcase className="h-3 w-3" />
            Professionell
          </button>
          <button
            onClick={handleSharperTone}
            className="flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <Zap className="h-3 w-3" />
            Skarpare
          </button>
          <button
            onClick={handleCopyDraft}
            className="ml-auto flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-medium text-blue-700 shadow-sm hover:bg-blue-100 transition-all"
          >
            <Wand2 className="h-3 w-3" />
            Kopiera svar
          </button>
        </div>

        {/* Message Preview - Editable */}
        <div className="mb-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            className="w-full min-h-[160px] text-[13px] leading-relaxed text-gray-800 focus:outline-none resize-none"
          />
          
          {/* Email Signature - Animated */}
          <EmailSignature animated={true} />
        </div>

        {/* Compact Action Bar - Icons + Send on one line */}
        <div className="flex items-center gap-2 mb-2">
          {/* Left: Action Icons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleGenerateAI}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-sm hover:shadow-md transition-all"
              title="AI-generera svar"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              onClick={handleSchedule}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-all"
              title="Schemalägg"
            >
              <Calendar className="h-4 w-4" />
            </button>
            <button
              onClick={handleCopyDraft}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-all"
              title="Kopiera"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={handleSaveDraft}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-all"
              title="Spara utkast"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>

          {/* Right: Send Button */}
          <Button 
            onClick={handleSendReply}
            className="ml-auto flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-800 to-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-rose-700 hover:to-rose-600 transition-all"
          >
            <Send className="h-4 w-4" />
            Skicka
          </Button>
        </div>

        {/* Compliance Footer */}
        <div className="rounded-lg bg-gray-50 px-3 py-1.5 text-center text-[10px] font-medium text-gray-600">
          Tillåtlista OK · Policy OK · Risk OK · Signatur OK
        </div>
      </div>
    </div>
  );
}