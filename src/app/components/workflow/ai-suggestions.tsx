import { Sparkles, TrendingUp, X, Check, Lightbulb, Zap } from 'lucide-react';
import { Workflow } from '../../pages/workflow-builder-page';

interface AISuggestionsProps {
  workflow: Workflow;
  onClose: () => void;
  onApplySuggestion: (suggestion: string) => void;
}

interface Suggestion {
  id: string;
  type: 'optimization' | 'bottleneck' | 'pattern' | 'template';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: any;
}

const SAMPLE_SUGGESTIONS: Suggestion[] = [
  {
    id: '1',
    type: 'optimization',
    title: 'Slå samman dubbla åtgärder',
    description: 'Steg 3 och 7 skickar båda e-post till samma kund. Kombinera dem för att spara tid.',
    impact: 'high',
    icon: TrendingUp,
  },
  {
    id: '2',
    type: 'bottleneck',
    title: 'Minska väntetid',
    description: '"Vänta 3 dagar" kan minskas till 2 dagar baserat på kundresponsmönster.',
    impact: 'medium',
    icon: Zap,
  },
  {
    id: '3',
    type: 'pattern',
    title: 'Lägg till felhantering',
    description: 'Du lägger alltid till felhantering efter API-anrop i andra arbetsflöden. Lägg till här?',
    impact: 'high',
    icon: Lightbulb,
  },
  {
    id: '4',
    type: 'template',
    title: 'Använd mall: "VIP-uppföljning"',
    description: 'Detta arbetsflöde liknar mallen "VIP-uppföljning". Överväg att börja därifrån.',
    impact: 'low',
    icon: Sparkles,
  },
];

export function AISuggestions({ workflow, onClose, onApplySuggestion }: AISuggestionsProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-gray-900">AI-förslag</h3>
            <p className="text-[9px] text-gray-600">Smarta optimeringar</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-0.5 rounded hover:bg-white/50 transition-colors"
        >
          <X className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>

      {/* Autopilot Status */}
      <div className="px-3 py-2 border-b border-gray-200 bg-green-50">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-green-900">Autopilot aktiv</span>
        </div>
        <p className="text-[9px] text-green-800 mt-0.5">
          Analyserar kontinuerligt arbetsflödesprestanda
        </p>
      </div>

      {/* Suggestions List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {SAMPLE_SUGGESTIONS.map(suggestion => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onApply={() => onApplySuggestion(suggestion.title)}
          />
        ))}

        {/* Learning Indicator */}
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-semibold text-blue-900 mb-0.5">Lär från dig</p>
              <p className="text-[9px] text-blue-800">
                AI har analyserat 847 körningar av detta arbetsflöde och dina redigeringsmönster.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-3 py-2 bg-gray-50">
        <p className="text-[9px] text-gray-600 text-center">
          💡 Förslag uppdateras i realtid
        </p>
      </div>
    </div>
  );
}

function SuggestionCard({ 
  suggestion, 
  onApply 
}: { 
  suggestion: Suggestion;
  onApply: () => void;
}) {
  const impactColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
    high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'hög påverkan' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'medel påverkan' },
    low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'låg påverkan' },
  };

  const colors = impactColors[suggestion.impact];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2.5 hover:border-purple-300 hover:shadow-md transition-all group">
      {/* Header */}
      <div className="flex items-start gap-1.5 mb-1.5">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          <suggestion.icon className="h-3 w-3 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] font-bold text-gray-900">{suggestion.title}</h4>
          <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[8px] font-semibold ${colors.bg} ${colors.text} ${colors.border} border`}>
            {colors.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[9px] text-gray-600 mb-2">
        {suggestion.description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onApply}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md text-[9px] font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Check className="h-2.5 w-2.5" />
          Tillämpa
        </button>
        <button className="px-2 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-[9px] font-semibold hover:bg-gray-50 transition-all">
          Avfärda
        </button>
      </div>
    </div>
  );
}
