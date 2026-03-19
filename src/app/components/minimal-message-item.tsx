import { Star, Archive, Clock, Zap, AlertTriangle, MessageSquare, AlertCircle, Stethoscope, Mail } from "lucide-react";
import { toast } from "sonner";
import { memo } from "react";

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
  sentiment?: 'happy' | 'frustrated' | 'neutral' | 'excited' | 'worried';
  isVIP?: boolean;
  isDuplicate?: boolean;
  duplicateCount?: number;
  competitorMentioned?: string;
  isTyping?: boolean;
  medicalFlags?: string[];
  receivedAt?: string; // Vilken mailbox kunden skickade till
}

interface MinimalMessageItemProps {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
  multiSelectMode?: boolean;
  isMultiSelected?: boolean;
  onToggleMultiSelect?: (messageId: string) => void;
  showReceivedAt?: boolean; // Visa receivedAt-badge när "Alla mail" är valt
}

export function MinimalMessageItem({
  message,
  isSelected,
  onClick,
  multiSelectMode = false,
  isMultiSelected = false,
  onToggleMultiSelect,
  showReceivedAt = false,
}: MinimalMessageItemProps) {
  
  // Format receivedAt för tydligare visning
  const formatReceivedAt = (email: string) => {
    // Ta bort @ och eventuell 1 i slutet, kapitalisera första bokstaven
    const cleaned = email.replace('@', '').replace(/1$/, '');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  };

  // Sentiment emoji mapping
  const sentimentEmoji: Record<string, string> = {
    'happy': '😊',
    'frustrated': '😤',
    'neutral': '😐',
    'excited': '🎉',
    'worried': '😰',
  };

  const getPriorityTag = () => {
    const priorityMap: Record<string, { label: string; icon: any; class: string }> = {
      'sprint': { label: 'Sprint', icon: Zap, class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      'critical': { label: 'Critical', icon: AlertTriangle, class: 'bg-red-100 text-red-700 border-red-200' },
    };
    return priorityMap[message.priority] || null;
  };

  const getIntentTag = () => {
    if (!message.intent) return null;
    const intentMap: Record<string, string> = {
      'Bokning': 'bg-blue-100 text-blue-800 border-blue-200',
      'Omboka': 'bg-amber-100 text-amber-800 border-amber-200',
      'Prisfråga': 'bg-slate-100 text-slate-800 border-slate-200',
      'Uppföljning': 'bg-purple-100 text-purple-800 border-purple-200',
      'Faktura': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Feedback': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    return intentMap[message.intent] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const priorityTag = getPriorityTag();
  
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer border-b border-gray-100 dark:border-gray-800 px-2.5 py-1.5 transition-all ${ 
        message.unread
          ? "bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-100/40 dark:hover:bg-rose-950/30"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      } ${isSelected ? 'bg-pink-50 dark:bg-pink-950/30 border-l-2 border-l-pink-500' : ''} ${isMultiSelected ? 'bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-200 dark:ring-blue-800' : ''}`}
    >
      {multiSelectMode && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
          <input
            type="checkbox"
            checked={isMultiSelected}
            onChange={() => onToggleMultiSelect?.(message.id)}
            onClick={(e) => e.stopPropagation()}
            className="h-3 w-3 rounded border-gray-300 dark:border-gray-600 text-pink-600"
          />
        </div>
      )}
      
      <div className={`flex items-start gap-2 ${multiSelectMode ? 'ml-5' : ''}`}>
        {/* Avatar - MINI 28px */}
        <div className="relative flex-shrink-0">
          <img
            src={message.avatar}
            alt={message.sender}
            className="h-7 w-7 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
          />
          {/* Unread indicator - SMALLER */}
          {message.unread && (
            <div className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full border border-white dark:border-gray-900 bg-emerald-500" />
          )}
          {/* VIP Badge - SMALLER */}
          {message.isVIP && (
            <div className="absolute -right-0.5 -bottom-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border border-white dark:border-gray-900 shadow-sm">
              <Star className="h-1.5 w-1.5 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Content - ULTRA KOMPAKT */}
        <div className="min-w-0 flex-1">
          {/* Name, Sentiment, Time Row - KOMPAKT */}
          <div className="flex items-baseline justify-between gap-1.5 mb-0">
            <div className="flex items-center gap-1">
              <h3 className={`text-[11px] ${message.unread ? "font-bold text-gray-900 dark:text-gray-100" : "font-semibold text-gray-800 dark:text-gray-200"}`}>
                {message.sender}
              </h3>
              {/* Sentiment Emoji - MINI */}
              {message.sentiment && (
                <span className="text-[10px]" title={`Sentiment: ${message.sentiment}`}>
                  {sentimentEmoji[message.sentiment]}
                </span>
              )}
              {/* Typing Indicator - MINI */}
              {message.isTyping && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-green-50 dark:bg-green-950 px-1 py-0 text-[7px] font-medium text-green-700 dark:text-green-400 animate-pulse border border-green-200 dark:border-green-800">
                  <MessageSquare className="h-1.5 w-1.5" />
                  Skriver...
                </span>
              )}
            </div>
            <span className="flex-shrink-0 text-[9px] text-gray-500 dark:text-gray-400">{message.time}</span>
          </div>

          {/* Subject - KOMPAKT */}
          <div className="flex items-center gap-1 mb-0.5">
            <p className={`text-[10px] truncate ${message.unread ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
              {message.subject}
            </p>
            {/* Medical Flag - CRITICAL */}
            {message.medicalFlags && message.medicalFlags.length > 0 && (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-red-50 dark:bg-red-950 px-1 py-0 text-[7px] font-semibold text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800" title={message.medicalFlags.join(', ')}>
                <Stethoscope className="h-1.5 w-1.5" />
                ⚠️
              </span>
            )}
            {/* Competitor Warning */}
            {message.competitorMentioned && (
              <AlertCircle className="h-2 w-2 text-red-600 dark:text-red-400" title={`Nämner: ${message.competitorMentioned}`} />
            )}
          </div>

          {/* Tags Row - MINI BADGES */}
          <div className="flex items-center gap-0.5 flex-wrap">
            {/* ReceivedAt Badge - När "Alla mail" är valt */}
            {showReceivedAt && message.receivedAt && (
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-0 text-[8px] font-bold border bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-950 dark:to-purple-900 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700 shadow-sm">
                <Mail className="h-2 w-2" />
                {formatReceivedAt(message.receivedAt)}
              </span>
            )}

            {/* Intent Tag */}
            {message.intent && (
              <span className={`inline-flex items-center gap-0.5 rounded px-1 py-0 text-[8px] font-medium border ${getIntentTag()}`}>
                {message.intent}
              </span>
            )}

            {/* Priority Tag - Only Sprint/Critical */}
            {priorityTag && (
              <span className={`inline-flex items-center gap-0.5 rounded px-1 py-0 text-[8px] font-medium border ${priorityTag.class}`}>
                <priorityTag.icon className="h-2 w-2" />
                {priorityTag.label}
              </span>
            )}

            {/* SLA Tag - Only if breach/warning */}
            {message.sla && (message.slaStatus === 'breach' || message.slaStatus === 'warning') && (
              <span className={`inline-flex items-center gap-0.5 rounded px-1 py-0 text-[8px] font-semibold border ${
                message.slaStatus === 'breach' 
                  ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800' 
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800'
              }`}>
                <Clock className="h-2 w-2" />
                {message.sla}
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions - Archive Icon - MINI */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.success(`Arkiverad: ${message.sender}`);
            }}
            className="rounded p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Arkivera"
          >
            <Archive className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(MinimalMessageItem);