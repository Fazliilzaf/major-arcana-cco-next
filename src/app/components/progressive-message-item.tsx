import { Clock, Zap, Star, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/language-context';

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
  priority: "sprint" | "critical" | "high" | "normal" | "low";
  warmth?: "cold" | "warm" | "hot";
  intent?: string;
  confidence?: number;
  recommendedAction?: string;
  tags?: string[];
  sentiment?: 'happy' | 'frustrated' | 'neutral' | 'excited' | 'worried';
  isVIP?: boolean;
  journeyStage?: 'lead' | 'consultation' | 'customer' | 'returning' | 'vip';
  conversionProbability?: number;
}

interface ProgressiveMessageItemProps {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
}

export function ProgressiveMessageItem({ message, isSelected, onClick }: ProgressiveMessageItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  const shouldShowSLA = message.slaStatus === 'breach' || message.slaStatus === 'warning';
  const isPriority = message.priority === 'sprint' || message.priority === 'critical';

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer border-b border-gray-100 transition-all ${
        isSelected 
          ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-l-pink-500' 
          : 'hover:bg-gray-50'
      } ${message.unread ? 'bg-white' : 'bg-gray-50/50'}`}
    >
      {/* LAYER 1: Always Visible (Essential Info) */}
      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={message.avatar}
              alt={message.sender}
              className="h-10 w-10 rounded-full object-cover"
            />
            {message.isVIP && (
              <div className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 border-white">
                <Star className="h-2.5 w-2.5 text-white fill-white" />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sender & Time */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className={`text-sm truncate ${message.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                {message.sender}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
            </div>

            {/* Subject */}
            <div className={`text-sm mb-1 truncate ${message.unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
              {message.subject}
            </div>

            {/* Preview (in compact mode) */}
            {!isExpanded && (
              <div className="text-xs text-gray-600 truncate">
                {message.preview}
              </div>
            )}

            {/* Critical Badges (Always visible if present) */}
            <div className="flex items-center gap-2 mt-2">
              {/* SLA Warning/Breach */}
              {shouldShowSLA && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  message.slaStatus === 'breach' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  <Clock className="h-3 w-3" />
                  {message.sla}
                </div>
              )}

              {/* Sprint/Critical Priority */}
              {isPriority && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  message.priority === 'sprint'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                    : 'bg-red-100 text-red-700'
                }`}>
                  <Zap className="h-3 w-3" />
                  {message.priority === 'sprint' ? 'Sprint' : 'Critical'}
                </div>
              )}

              {/* Expand/Collapse Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* LAYER 2: Expanded Details (Progressive Disclosure) */}
        {isExpanded && (
          <div className="mt-3 pl-13 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {/* Full Preview */}
            <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
              {message.preview}
            </div>

            {/* AI Insights */}
            {message.intent && (
              <div className="flex items-start gap-2">
                <div className="text-xs font-semibold text-gray-600 w-24">Intent:</div>
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                    {message.intent}
                    {message.confidence && (
                      <span className="text-blue-600">({message.confidence}%)</span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Recommended Action */}
            {message.recommendedAction && (
              <div className="flex items-start gap-2">
                <div className="text-xs font-semibold text-gray-600 w-24">Action:</div>
                <div className="text-xs text-gray-900 font-semibold flex-1">
                  {message.recommendedAction}
                </div>
              </div>
            )}

            {/* Tags */}
            {message.tags && message.tags.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="text-xs font-semibold text-gray-600 w-24">Tags:</div>
                <div className="flex flex-wrap gap-1 flex-1">
                  {message.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Journey Stage & Conversion */}
            {message.journeyStage && (
              <div className="flex items-start gap-2">
                <div className="text-xs font-semibold text-gray-600 w-24">Journey:</div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold capitalize">
                    {message.journeyStage}
                  </span>
                  {message.conversionProbability && (
                    <span className="text-xs text-gray-600">
                      {message.conversionProbability}% conversion
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Sentiment */}
            {message.sentiment && (
              <div className="flex items-start gap-2">
                <div className="text-xs font-semibold text-gray-600 w-24">Sentiment:</div>
                <div className="text-xs capitalize text-gray-700 flex-1">
                  {getSentimentEmoji(message.sentiment)} {message.sentiment}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Unread Indicator */}
      {message.unread && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-500" />
      )}
    </div>
  );
}

function getSentimentEmoji(sentiment: string): string {
  const emojis: Record<string, string> = {
    happy: '😊',
    frustrated: '😤',
    neutral: '😐',
    excited: '🤩',
    worried: '😟',
  };
  return emojis[sentiment] || '😐';
}