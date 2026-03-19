import { Sparkles, RefreshCw, Check, Edit3, Copy, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AICopilotProps {
  customerName: string;
  customerHistory?: string;
  currentIntent?: string;
  onAccept: (text: string) => void;
  onRegenerate: () => void;
}

const TONE_OPTIONS = [
  { id: 'friendly', label: 'Friendly', emoji: '😊' },
  { id: 'formal', label: 'Formal', emoji: '🤝' },
  { id: 'concise', label: 'Concise', emoji: '⚡' },
  { id: 'empathetic', label: 'Empathetic', emoji: '❤️' },
];

export function AICopilot({ 
  customerName, 
  customerHistory, 
  currentIntent,
  onAccept, 
  onRegenerate 
}: AICopilotProps) {
  const [tone, setTone] = useState<string>('friendly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<string>(
    `Hej ${customerName}! 👋\n\nTack för ditt meddelande om bokning. Jag ser att du tidigare besökte oss 15 maj och var mycket nöjd med behandlingen.\n\nBaserat på din förfrågan föreslår jag följande tider för din nästa konsultation:\n\n• Torsdag 10:00\n• Fredag 14:00\n• Måndag 11:30\n\nVilken tid passar dig bäst? Du kan även boka direkt via vår bokningslänk.\n\nVarma hälsningar,\nHairTP Clinic`
  );

  const handleRegenerate = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Different suggestion based on tone
    const suggestions: Record<string, string> = {
      friendly: `Hej ${customerName}! 👋\n\nSå kul att höra från dig igen! Jag ser att du tidigare besökte oss och var jättenöjd.\n\nHär är några lediga tider som passar perfekt:\n• Torsdag 10:00 ☕\n• Fredag 14:00 ✨\n\nVad säger du?\n\nKram,\nHairTP Team`,
      formal: `Bästa ${customerName},\n\nTack för er förfrågan angående bokning. Med hänvisning till er tidigare behandling den 15 maj, kan vi erbjuda följande tillgängliga tider:\n\n• Torsdag kl. 10:00\n• Fredag kl. 14:00\n\nVänligen bekräfta vilken tid som passar er bäst.\n\nMed vänliga hälsningar,\nHairTP Clinic`,
      concise: `Hej ${customerName},\n\nLediga tider:\n• Torsdag 10:00\n• Fredag 14:00\n\nVilken passar?\n\n/HairTP`,
      empathetic: `Kära ${customerName} 💕\n\nJag förstår hur viktigt det är att hitta rätt tid för din behandling. Baserat på din tidigare fantastiska upplevelse hos oss vill jag verkligen hjälpa dig att hitta en tid som passar perfekt.\n\nJag har reserverat två tider som jag tror kan fungera:\n• Torsdag 10:00 - lugnt på morgonen\n• Fredag 14:00 - avslappnat på eftermiddagen\n\nVilken känns bäst för dig?\n\nStorma kramar,\nDitt HairTP Team ✨`,
    };

    setSuggestion(suggestions[tone] || suggestions.friendly);
    setIsGenerating(false);
    toast.success('✨ New suggestion generated!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    toast.success('📋 Copied to clipboard');
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">AI Co-Pilot</h3>
            <p className="text-xs text-gray-500">Context-aware suggestion</p>
          </div>
        </div>
        
        {/* Tone Selector */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {TONE_OPTIONS.map(option => (
            <button
              key={option.id}
              onClick={() => setTone(option.id)}
              className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                tone === option.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title={option.label}
            >
              {option.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Context Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {customerHistory && (
          <div className="px-2 py-1 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700">
            📊 Previous visit: {customerHistory}
          </div>
        )}
        {currentIntent && (
          <div className="px-2 py-1 bg-green-50 border border-green-200 rounded-md text-xs text-green-700">
            🎯 Intent: {currentIntent}
          </div>
        )}
        <div className="px-2 py-1 bg-purple-50 border border-purple-200 rounded-md text-xs text-purple-700">
          ✨ Tone: {TONE_OPTIONS.find(t => t.id === tone)?.label}
        </div>
      </div>

      {/* Suggestion Box */}
      <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-200 rounded-xl p-4">
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-purple-600">
              <Wand2 className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-semibold">Generating...</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Suggestion Text */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
            <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans leading-relaxed">
              {suggestion}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAccept(suggestion)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm"
            >
              <Check className="h-4 w-4" />
              Use This (⌘J)
            </button>
            <button
              onClick={() => onAccept(suggestion)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-purple-300 text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-all"
              title="Edit before using"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={handleRegenerate}
              className="p-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              title="Regenerate (⌘R)"
              disabled={isGenerating}
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Learning Indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>AI learns from your edits</span>
        </div>
        <span className="text-gray-300">•</span>
        <span>Powered by GPT-4</span>
      </div>
    </div>
  );
}

// Compact version for inline suggestions
export function AICopilotInline({ onAccept }: { onAccept: (text: string) => void }) {
  return (
    <button
      onClick={() => onAccept('AI suggested text...')}
      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg text-sm font-semibold text-purple-700 hover:from-purple-100 hover:to-pink-100 transition-all"
    >
      <Sparkles className="h-4 w-4" />
      <span>Generate with AI</span>
      <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-white border border-purple-300 rounded">⌘J</kbd>
    </button>
  );
}
