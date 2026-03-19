import { useState, useEffect } from "react";
import { 
  X, Send, Sparkles, Calendar, Copy, Bookmark, Minimize2, Flame, 
  Briefcase, Zap, BellOff, Flag, RotateCcw, ChevronDown, Square, 
  CheckCircle2, MoreHorizontal
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { EmailSignature } from "./email-signature";

interface ResponseStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export function ResponseStudioDrawer({ isOpen, onClose, initialMessage = "" }: ResponseStudioDrawerProps) {
  const [draftText, setDraftText] = useState(initialMessage);
  const [selectedFilters, setSelectedFilters] = useState({
    kort: false,
    varm: true,
    proffsig: true,
  });

  // Update draft when initialMessage changes
  useEffect(() => {
    if (initialMessage) {
      setDraftText(initialMessage);
    }
  }, [initialMessage]);

  const toggleFilter = (filter: keyof typeof selectedFilters) => {
    setSelectedFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleSendReply = () => {
    toast.success("Svar skickat!");
    onClose();
  };

  const handleSnooze = () => {
    toast.success("Konversation snoozad till senare");
  };

  const handleMarkFollowUp = () => {
    toast.success("Markerad för uppföljning");
  };

  const handleRemindIfNoReply = () => {
    toast.success("Påminnelse aktiverad om inget svar skickas");
  };

  const handleGenerateAI = () => {
    toast.info("AI-genererar svar...");
  };

  const handleSchedule = () => {
    toast.info("Schemalägg meddelande...");
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftText);
    toast.success("Kopierat till urklipp!");
  };

  const handleSaveDraft = () => {
    toast.info("Utkast sparat");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-[600px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50">
          <h2 className="text-[16px] font-semibold text-gray-900">Svarsstudio</h2>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-white/80 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Priority Badges */}
          <div className="mb-3 flex items-center gap-2">
            <button className="rounded-full border border-gray-200 bg-rose-50/40 px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm hover:bg-rose-100/40 transition-all">
              Risknivå
            </button>
            <button className="rounded-full bg-gradient-to-br from-rose-300 to-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-900 shadow-sm">
              Hög
            </button>
            <button className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm">
              $46K
            </button>
          </div>

          {/* Quick Filters */}
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-50/50 p-2.5 border border-gray-100">
            <button
              onClick={() => toggleFilter('kort')}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 shadow-sm transition-all ${
                selectedFilters.kort ? 'border-gray-400 bg-gray-100' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <Square className="h-3 w-3 rounded-sm border-2 border-gray-500" strokeWidth={2.5} />
              <span className="text-[11px] font-medium text-gray-800">Kort</span>
            </button>
            <button
              onClick={() => toggleFilter('varm')}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 shadow-sm transition-all ${
                selectedFilters.varm ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-amber-700 to-amber-600 shadow-sm" />
              <span className="text-[11px] font-medium text-gray-800">Varm</span>
            </button>
            <button
              onClick={() => toggleFilter('proffsig')}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 shadow-sm transition-all ${
                selectedFilters.proffsig ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" strokeWidth={2.5} />
              <span className="text-[11px] font-medium text-gray-800">Proffsig</span>
            </button>
          </div>

          {/* Recommended Tone */}
          <div className="mb-3 rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-yellow-50/50 p-3 shadow-sm">
            <h3 className="mb-1 text-[13px] font-semibold text-gray-900">
              Rekommenderat läge: Varm
            </h3>
            <p className="text-[11px] text-gray-700">
              Senaste kundmeddelandet är vänligt och gäller ett bokningsärende.
            </p>
          </div>

          {/* Tone Adjustment Toolbar */}
          <div className="mb-3 flex flex-wrap gap-1.5 rounded-xl border border-gray-200 bg-gray-50/50 p-2.5">
            <button className="flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-all">
              <Minimize2 className="h-3 w-3" />
              Förkorta
            </button>
            <button className="flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-all">
              <Flame className="h-3 w-3" />
              Varmare
            </button>
            <button className="flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-all">
              <Briefcase className="h-3 w-3" />
              Professionell
            </button>
            <button className="flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-all">
              <Zap className="h-3 w-3" />
              Skarpare
            </button>
          </div>

          {/* Large Writing Area - FULL WIDTH! */}
          <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="Skriv ditt svar här..."
              className="w-full min-h-[250px] text-[13px] leading-relaxed text-gray-800 focus:outline-none resize-none"
            />
            
            {/* Email Signature */}
            <EmailSignature animated={true} />
          </div>

          {/* Action Buttons - SEND BELOW TEXTAREA! */}
          <div className="mb-3">
            {/* Quick Action Icons - Horizontal Row */}
            <div className="flex items-center gap-1.5 mb-2">
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
              <button
                onClick={() => toast.info("Fler alternativ...")} 
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-all"
                title="Mer"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Send Button - FULL WIDTH, COMPRESSED HEIGHT */}
            <button
              onClick={handleSendReply}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-800 to-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-rose-700 hover:to-rose-600 transition-all"
            >
              <Send className="h-4 w-4" />
              Skicka svar
            </button>
          </div>

          {/* Smart Follow-Up Actions */}
          <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
            <h3 className="text-[12px] font-semibold text-gray-900 mb-2">Uppföljningsåtgärder</h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={handleSnooze}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-gray-300 text-gray-700 text-[11px] font-semibold hover:bg-gray-50 transition-all"
              >
                <BellOff className="h-3.5 w-3.5" />
                Svara senare
              </button>
              <button
                onClick={handleMarkFollowUp}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-gray-300 text-gray-700 text-[11px] font-semibold hover:bg-gray-50 transition-all"
              >
                <Flag className="h-3.5 w-3.5" />
                Markera för uppföljning
              </button>
              <button
                onClick={handleRemindIfNoReply}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-gray-300 text-gray-700 text-[11px] font-semibold hover:bg-gray-50 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Påminn om inget svar
              </button>
            </div>
          </div>

          {/* Compliance Footer */}
          <div className="rounded-lg bg-gray-50 px-3 py-1.5 text-center text-[10px] font-medium text-gray-600">
            Tillåtlista OK · Policy OK · Risk OK · Signatur OK
          </div>
        </div>
      </div>
    </>
  );
}