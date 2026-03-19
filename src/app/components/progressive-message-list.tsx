import { MoreHorizontal, Reply, Mail, ChevronDown, ChevronUp, Zap, AlertTriangle, Clock, XCircle, RotateCcw, CheckSquare, Archive, Star, TrendingUp, Copy, Users, Eye, AlertCircle, MessageSquare, Calendar, DollarSign, Shield, Activity, UserCheck, Bell, FileText, Stethoscope, Globe, Mic, Search, Keyboard, TrendingDown, Sparkles, Plus, Target, Briefcase, BarChart3 } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { DensityModeSelector, DensityMode } from "./density-mode-selector";
import { ViewDensityToggle, ViewDensity } from "./view-density-toggle";
import { CombinedDensityControl } from "./combined-density-control";
import { SoftBreakModal } from "./soft-break-modal";
import { RestoreIgnoredModal } from "./restore-ignored-modal";
import { MultiSelectToolbar } from "./multi-select-toolbar";
import { useLanguage } from "../context/language-context";
import { MinimalMessageItem } from "./minimal-message-item";
import { useMailbox } from "../context/mailbox-context";
import { AddMailboxModal } from "./add-mailbox-modal";
import { MailboxDropdown } from "./mailbox-dropdown";
import { EmptyState } from "./empty-states";
import { LoadingSpinner } from "./loading-states";
import { useRetry } from "../hooks/use-retry";
import { useApiErrorHandler } from "../hooks/use-api-error-handler";
import { FollowUpFilter, FollowUpFilterType } from "./follow-up-filter";

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
  icon?: string;
  snoozed?: string;
  warmth?: "cold" | "warm" | "hot";
  lifecycle?: "new" | "active" | "returning" | "dormant";
  receivedAt?: string; // Vilken mailbox kunden skickade till (t.ex. "kons@", "contact@")
  intent?: string;
  confidence?: number;
  recommendedAction?: string;
  tags?: string[];
  slaRisk?: "breach" | "warning" | "safe";
  slaTime?: string;
  // 🎯 SMART FEATURES - Phase 1 (Already implemented)
  sentiment?: 'happy' | 'frustrated' | 'neutral' | 'excited' | 'worried';
  isVIP?: boolean;
  revenuePotential?: 'low' | 'medium' | 'high' | 'premium';
  journeyStage?: 'lead' | 'consultation' | 'customer' | 'returning' | 'vip';
  isDuplicate?: boolean;
  duplicateCount?: number;
  timeSinceLastVisit?: string;
  interactionCount?: number;
  conversionProbability?: number;
  referralSource?: 'google' | 'instagram' | 'facebook' | 'referral' | 'direct' | 'tiktok';
  isRead?: boolean;
  isStagnant?: boolean;
  stagnantDays?: number;
  competitorMentioned?: string;
  // 🚀 SMART FEATURES - Phase 2 (NEW!)
  suggestedReply?: string;
  suggestedSlots?: string[];
  detectedLanguage?: 'sv' | 'en' | 'no' | 'da' | 'de' | 'es' | 'fr';
  upsellOpportunity?: string;
  lifetimeValue?: number;
  needsFollowup?: boolean;
  avgResponseTime?: string;
  bestTimeToReply?: string;
  assignedTo?: string;
  internalNotes?: string[];
  handoffStatus?: 'unassigned' | 'in-progress' | 'waiting' | 'completed';
  churnRisk?: 'low' | 'medium' | 'high';
  treatmentHistory?: string[];
  medicalFlags?: string[];
  consentStatus?: { gdpr: boolean; photos: boolean; marketing: boolean };
  insurance?: string;
  isTyping?: boolean;
  reactions?: string[];
  hasVoiceNote?: boolean;
  slaPrediction?: 'safe' | 'at-risk' | 'will-breach';
  receivedAt?: string; // E-postadress kunden skickade till (t.ex. "bokning@", "info@", "dr.svensson@")
  // 🆕 STATUS FLAGS
  isLater?: boolean; // Markerad för "Svara senare"
  isSent?: boolean; // Skickat svar
  isDone?: boolean; // Markerad som "Klar" (auto-reset när kund svarar)
  lastCustomerReplyTime?: string; // Senaste tiden kund svarade (för att detektera nya svar)
}

const allMessages: Message[] = [
  {
    id: "1",
    sender: "Johan Lagerström",
    subject: "Bokning av tid",
    preview: "Hej, jag vill boka en tid...",
    time: "19:22",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    unread: true,
    sla: "1m",
    slaStatus: "breach",
    slaMinutesLeft: 1,
    priority: "sprint",
    warmth: "hot",
    lifecycle: "active",
    receivedAt: "kons@",
    intent: "Bokning",
    confidence: 98,
    recommendedAction: "Bekräfta tid",
    tags: ["Bokning", "Sprint"],
    slaRisk: "breach",
    slaTime: "1m",
    // Smart features
    sentiment: "excited",
    isVIP: false,
    revenuePotential: "high",
    journeyStage: "lead",
    isDuplicate: false,
    timeSinceLastVisit: "Aldrig",
    interactionCount: 1,
    conversionProbability: 85,
    referralSource: "instagram",
    isRead: false,
    isStagnant: false,
    // Phase 2 - NEW SMART FEATURES!
    suggestedReply: "Hej Johan! Självklart! Vi har lediga tider på torsdag 14:00 eller fredag 10:30. Vilken passar bäst?",
    suggestedSlots: ["Torsdag 14:00", "Fredag 10:30", "Måndag 13:00"],
    detectedLanguage: "sv",
    upsellOpportunity: "Kunden frågade om fillers → föreslå konsultation paket",
    lifetimeValue: 0,
    needsFollowup: true,
    avgResponseTime: "N/A",
    bestTimeToReply: "18:00-20:00",
    assignedTo: "Sara Lindberg",
    internalNotes: ["Första kontakten", "Verkar mycket intresserad"],
    handoffStatus: "in-progress",
    churnRisk: "low",
    treatmentHistory: [],
    medicalFlags: [],
    consentStatus: { gdpr: false, photos: false, marketing: false },
    insurance: undefined,
    isTyping: false,
    reactions: [],
    hasVoiceNote: false,
    slaPrediction: "will-breach",
  },
  {
    id: "2",
    sender: "Anna Karlsson",
    subject: "Akut ombokningsfråga",
    preview: "Måste tyvärr ställa in imorgon...",
    time: "18:45",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    unread: true,
    sla: "30m",
    slaStatus: "breach",
    slaMinutesLeft: 30,
    priority: "sprint",
    warmth: "warm",
    lifecycle: "active",
    intent: "Omboka",
    confidence: 95,
    recommendedAction: "Föreslå ny tid",
    tags: ["Omboka", "Sprint"],
    slaRisk: "breach",
    slaTime: "30m",
    // Smart features
    sentiment: "worried",
    isVIP: true,
    revenuePotential: "premium",
    journeyStage: "customer",
    isDuplicate: false,
    timeSinceLastVisit: "2 veckor",
    interactionCount: 8,
    conversionProbability: 95,
    referralSource: "referral",
    isRead: true,
    isStagnant: false,
    // Phase 2
    suggestedReply: "Hej Anna! Inga problem, jag förstår. Vad sägs om onsdag 15:00 eller torsdag 11:00?",
    suggestedSlots: ["Onsdag 15:00", "Torsdag 11:00", "Fredag 14:00"],
    detectedLanguage: "sv",
    upsellOpportunity: "Återkommande VIP → erbjud premium membership",
    lifetimeValue: 48500,
    needsFollowup: false,
    avgResponseTime: "12 min",
    bestTimeToReply: "17:00-19:00",
    assignedTo: "Dr. Eriksson",
    internalNotes: ["VIP-kund sedan 2 år", "Alltid mycket nöjd", "Prefererar Dr. Eriksson"],
    handoffStatus: "in-progress",
    churnRisk: "low",
    treatmentHistory: ["Fillers (2024-02)", "Botox (2024-01)", "Konsultation (2023-11)"],
    medicalFlags: ["Allergi: Latex"],
    consentStatus: { gdpr: true, photos: true, marketing: true },
    insurance: "Folksam Premium",
    isTyping: true,
    reactions: ["👍", "❤️"],
    hasVoiceNote: false,
    slaPrediction: "at-risk",
    receivedAt: "info@",
    isLater: true, // ⏰ Markerad för "Svara senare"
  },
  {
    id: "3",
    sender: "Erik Svensson",
    subject: "Prisfråga konsultation",
    preview: "Hej! Vad kostar en första konsultation?",
    time: "15:20",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    unread: true,
    sla: "4h",
    slaStatus: "warning",
    slaMinutesLeft: 135,
    priority: "critical",
    warmth: "cold",
    lifecycle: "new",
    intent: "Prisfråga",
    confidence: 92,
    recommendedAction: "Skicka prislista",
    tags: ["Prisfråga", "Critical"],
    slaRisk: "warning",
    slaTime: "4h",
    // Smart features
    sentiment: "neutral",
    isVIP: false,
    revenuePotential: "medium",
    journeyStage: "lead",
    isDuplicate: true,
    duplicateCount: 2,
    timeSinceLastVisit: "Aldrig",
    interactionCount: 2,
    conversionProbability: 45,
    referralSource: "google",
    isRead: false,
    isStagnant: false,
    competitorMentioned: "Rival Klinik",
    // Phase 2
    suggestedReply: "Hej Erik! Första konsultationen kostar 500 kr och inkluderar en komplett analys. Vill du boka in en tid?",
    suggestedSlots: ["Måndag 10:00", "Tisdag 14:00", "Onsdag 16:00"],
    detectedLanguage: "sv",
    upsellOpportunity: undefined,
    lifetimeValue: 0,
    needsFollowup: true,
    avgResponseTime: "N/A",
    bestTimeToReply: "15:00-17:00",
    assignedTo: undefined,
    internalNotes: ["Nämner konkurrent - var försiktig", "Prisjämför", "Mailade 2 ggr redan"],
    handoffStatus: "unassigned",
    churnRisk: "high",
    treatmentHistory: [],
    medicalFlags: [],
    consentStatus: { gdpr: false, photos: false, marketing: false },
    insurance: undefined,
    isTyping: false,
    reactions: [],
    hasVoiceNote: false,
    slaPrediction: "at-risk",
    receivedAt: "egzona@",
    isSent: true, // ✅ Skickat svar på detta meddelande
  },
  {
    id: "4",
    sender: "Maria Andersson",
    subject: "Uppföljning behandling",
    preview: "Hur ska jag gå vidare efter första...",
    time: "12:30",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    unread: true,
    priority: "high",
    warmth: "warm",
    lifecycle: "active",
    intent: "Uppföljning",
    confidence: 89,
    recommendedAction: "Boka uppföljning",
    tags: ["Uppföljning", "High"],
    slaRisk: "safe",
    slaTime: "12:30",
    // Smart features
    sentiment: "happy",
    isVIP: false,
    revenuePotential: "high",
    journeyStage: "customer",
    isDuplicate: false,
    timeSinceLastVisit: "1 månad",
    interactionCount: 4,
    conversionProbability: 90,
    referralSource: "facebook",
    isRead: false,
    isStagnant: false,
    // Phase 2
    suggestedReply: "Hej Maria! Så kul att höra från dig! För bästa resultat rekommenderar vi uppföljning om 2 veckor. Passar torsdag 13:00?",
    suggestedSlots: ["Torsdag 13:00", "Fredag 15:00", "Måndag 11:00"],
    detectedLanguage: "sv",
    upsellOpportunity: "Nöjd med botox → föreslå fillers som komplement",
    lifetimeValue: 8900,
    needsFollowup: false,
    avgResponseTime: "45 min",
    bestTimeToReply: "12:00-14:00",
    assignedTo: "Sara Lindberg",
    internalNotes: ["Genomgick första behandling för 1 månad sen", "Mycket nöjd hittills"],
    handoffStatus: "waiting",
    churnRisk: "low",
    treatmentHistory: ["Botox (2024-02)"],
    medicalFlags: [],
    consentStatus: { gdpr: true, photos: false, marketing: true },
    insurance: undefined,
    isTyping: false,
    reactions: ["😊"],
    hasVoiceNote: true,
    slaPrediction: "safe",
    receivedAt: "contact@",
  },
  {
    id: "5",
    sender: "Lisa Nilsson",
    subject: "Fakturafråga",
    preview: "Kan ni skicka en kopia...",
    time: "11:15",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    priority: "normal",
    warmth: "warm",
    lifecycle: "returning",
    intent: "Faktura",
    confidence: 96,
    recommendedAction: "Skicka faktura",
    tags: ["Faktura", "Normal"],
    slaRisk: "safe",
    slaTime: "11:15",
    // Smart features
    sentiment: "neutral",
    isVIP: true,
    revenuePotential: "premium",
    journeyStage: "vip",
    isDuplicate: false,
    timeSinceLastVisit: "1 vecka",
    interactionCount: 15,
    conversionProbability: 100,
    referralSource: "referral",
    isRead: true,
    isStagnant: false,
    // Phase 2
    suggestedReply: "Hej Lisa! Självklart, jag skickar fakturan direkt via mail. Den bör vara framme inom några minuter.",
    suggestedSlots: [],
    detectedLanguage: "sv",
    upsellOpportunity: "VIP med hög LTV → föreslå årligt premium-paket",
    lifetimeValue: 127500,
    needsFollowup: false,
    avgResponseTime: "8 min",
    bestTimeToReply: "10:00-12:00",
    assignedTo: "Ekonomi - Anna",
    internalNotes: ["Toppkund!", "Alltid betalar i tid", "Rekommenderat 3 nya kunder"],
    handoffStatus: "completed",
    churnRisk: "low",
    treatmentHistory: ["Premium Paket (2024-01)", "Fillers (2023-11)", "Botox (2023-10)", "Laserfraktionering (2023-09)"],
    medicalFlags: [],
    consentStatus: { gdpr: true, photos: true, marketing: true },
    insurance: "Skandia VIP",
    isTyping: false,
    reactions: ["❤️", "👍", "😊"],
    hasVoiceNote: false,
    slaPrediction: "safe",
    receivedAt: "kvitto@",
  },
  {
    id: "6",
    sender: "Peter Johansson",
    subject: "Tack för behandlingen",
    preview: "Jag ville bara säga tack...",
    time: "10:05",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    priority: "normal",
    warmth: "hot",
    lifecycle: "active",
    intent: "Feedback",
    confidence: 99,
    recommendedAction: "Tacka och be om recension",
    tags: ["Feedback", "Normal"],
    slaRisk: "safe",
    slaTime: "10:05",
    // Smart features
    sentiment: "happy",
    isVIP: false,
    revenuePotential: "low",
    journeyStage: "customer",
    isDuplicate: false,
    timeSinceLastVisit: "3 dagar",
    interactionCount: 3,
    conversionProbability: 75,
    referralSource: "tiktok",
    isRead: true,
    isStagnant: false,
    // Phase 2
    suggestedReply: "Hej Peter! Tack själv, så kul att du är nöjd! 😊 Skulle betyda mycket om du ville dela din upplevelse på Google!",
    suggestedSlots: [],
    detectedLanguage: "sv",
    upsellOpportunity: undefined,
    lifetimeValue: 3500,
    needsFollowup: false,
    avgResponseTime: "1h 20min",
    bestTimeToReply: "09:00-11:00",
    assignedTo: "Sara Lindberg",
    internalNotes: ["Perfekt tillfälle att be om recension!", "Mycket nöjd kund"],
    handoffStatus: "waiting",
    churnRisk: "medium",
    treatmentHistory: ["Botox (2024-03)"],
    medicalFlags: [],
    consentStatus: { gdpr: true, photos: false, marketing: false },
    insurance: undefined,
    isTyping: false,
    reactions: [],
    hasVoiceNote: false,
    slaPrediction: "safe",
  },
];

// Generate more normal priority messages
for (let i = 7; i <= 20; i++) {
  allMessages.push({
    id: `${i}`,
    sender: `Kund ${i}`,
    subject: `Ämne ${i}`,
    preview: "Generellt meddelande...",
    time: `${i}d`,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    priority: i % 3 === 0 ? "low" : "normal",
    warmth: "warm",
    lifecycle: "active",
    intent: "Allmän",
    confidence: 75,
    recommendedAction: "Svara",
    tags: ["Allmän", i % 3 === 0 ? "Low" : "Normal"],
    slaRisk: "safe",
    slaTime: `${i}d`,
  });
}

interface ProgressiveMessageListProps {
  onSelectMessage?: (messageId: string) => void;
  selectedMessageId?: string | null;
  filterType?: "inbox" | "later" | "sent";
}

export function ProgressiveMessageList({ onSelectMessage, selectedMessageId: externalSelectedId, filterType = "inbox" }: ProgressiveMessageListProps = {}) {
  const [selectedId, setSelectedId] = useState("1");
  const currentSelectedId = externalSelectedId || selectedId;
  const [showCritical, setShowCritical] = useState(true);
  const [showHigh, setShowHigh] = useState(true);
  const [showNormal, setShowNormal] = useState(false);
  const [showLow, setShowLow] = useState(false);
  const [densityMode, setDensityMode] = useState<DensityMode>("overview"); // Default to overview - show all categories
  const [viewDensity, setViewDensity] = useState<ViewDensity>("comfortable");
  const [showSoftBreak, setShowSoftBreak] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);
  const [ignoredTypes, setIgnoredTypes] = useState<string[]>([]);
  const [showRestoreIgnored, setShowRestoreIgnored] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showAddMailbox, setShowAddMailbox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followUpFilter, setFollowUpFilter] = useState<FollowUpFilterType>("all");
  const { t } = useLanguage();
  const { mailboxes, currentMailbox, setCurrentMailbox, addMailbox } = useMailbox();
  const handleError = useApiErrorHandler();

  // 🎯 PAGE FILTER: Filter messages based on page type (inbox/later/sent)
  const pageFilteredMessages = useMemo(() => {
    switch (filterType) {
      case "later":
        return allMessages.filter(m => m.isLater && !m.isDone);
      case "sent":
        return allMessages.filter(m => m.isSent);
      default:
        // Inbox: show messages that are NOT in "later" or "done"
        return allMessages.filter(m => !m.isLater && !m.isDone);
    }
  }, [filterType]);

  // ⚡ PERFORMANCE: Memoize filtered messages (prevents recalculation on every render)
  // NOTE: These use pageFilteredMessages, so they respect the current page filter
  const baseSprintMessages = useMemo(
    () => pageFilteredMessages.filter((m) => m.priority === "sprint"),
    [pageFilteredMessages]
  );
  
  const baseCriticalMessages = useMemo(
    () => pageFilteredMessages.filter((m) => m.priority === "critical"),
    [pageFilteredMessages]
  );
  
  const baseHighMessages = useMemo(
    () => pageFilteredMessages.filter((m) => m.priority === "high"),
    [pageFilteredMessages]
  );
  
  const baseNormalMessages = useMemo(
    () => pageFilteredMessages.filter((m) => m.priority === "normal" && !ignoredTypes.includes(m.id)),
    [pageFilteredMessages, ignoredTypes]
  );
  
  const baseLowMessages = useMemo(
    () => pageFilteredMessages.filter((m) => m.priority === "low"),
    [pageFilteredMessages]
  );

  // Follow-up filtering
  const unansweredMessages = useMemo(
    () => pageFilteredMessages.filter((m) => !m.isRead && (m.priority === "critical" || m.priority === "high")),
    [pageFilteredMessages]
  );

  const followUpMessages = useMemo(
    () => pageFilteredMessages.filter((m) => m.needsFollowup || m.tags?.includes("Uppföljning")),
    [pageFilteredMessages]
  );

  const forgottenMessages = useMemo(
    () => pageFilteredMessages.filter((m) => m.isStagnant || (m.stagnantDays && m.stagnantDays > 2)),
    [pageFilteredMessages]
  );

  const snoozedMessages = useMemo(
    () => pageFilteredMessages.filter((m) => m.snoozed),
    []
  );

  const filterCounts = useMemo(() => ({
    all: allMessages.length,
    unanswered: unansweredMessages.length,
    followUp: followUpMessages.length,
    forgotten: forgottenMessages.length,
    snoozed: snoozedMessages.length,
  }), [allMessages.length, unansweredMessages.length, followUpMessages.length, forgottenMessages.length, snoozedMessages.length]);

  // Apply follow-up filter
  const filteredByFollowUp = useMemo(() => {
    switch (followUpFilter) {
      case "unanswered":
        return unansweredMessages;
      case "follow-up":
        return followUpMessages;
      case "forgotten":
        return forgottenMessages;
      case "snoozed":
        return snoozedMessages;
      default:
        return allMessages;
    }
  }, [followUpFilter, allMessages, unansweredMessages, followUpMessages, forgottenMessages, snoozedMessages]);

  // Apply follow-up filter to each priority category
  const sprintMessages = useMemo(
    () => baseSprintMessages.filter(m => filteredByFollowUp.includes(m)),
    [baseSprintMessages, filteredByFollowUp]
  );
  
  const criticalMessages = useMemo(
    () => baseCriticalMessages.filter(m => filteredByFollowUp.includes(m)),
    [baseCriticalMessages, filteredByFollowUp]
  );
  
  const highMessages = useMemo(
    () => baseHighMessages.filter(m => filteredByFollowUp.includes(m)),
    [baseHighMessages, filteredByFollowUp]
  );
  
  const normalMessages = useMemo(
    () => baseNormalMessages.filter(m => filteredByFollowUp.includes(m)),
    [baseNormalMessages, filteredByFollowUp]
  );
  
  const lowMessages = useMemo(
    () => baseLowMessages.filter(m => filteredByFollowUp.includes(m)),
    [baseLowMessages, filteredByFollowUp]
  );

  // ⚡ PERFORMANCE: Memoize event handlers (prevents recreation on every render)
  const handleMessageClick = useCallback((message: Message) => {
    // Soft Break: Check if clicking outside sprint zone
    const currentMessage = allMessages.find(m => m.id === currentSelectedId);
    const isCurrentSprint = currentMessage?.priority === "sprint";
    const isNewSprint = message.priority === "sprint";
    
    if (isCurrentSprint && !isNewSprint && sprintMessages.length > 0) {
      setPendingMessage(message);
      setShowSoftBreak(true);
      return;
    }
    
    setSelectedId(message.id);
    onSelectMessage?.(message.id);
    toast.success(`Öppnade: ${message.subject}`);
  }, [currentSelectedId, sprintMessages.length, onSelectMessage]);

  const handleSoftBreakContinue = useCallback(() => {
    if (pendingMessage) {
      setSelectedId(pendingMessage.id);
      toast.success(`Öppnade: ${pendingMessage.subject}`);
    }
    setShowSoftBreak(false);
    setPendingMessage(null);
  }, [pendingMessage]);

  const handleSoftBreakCancel = useCallback(() => {
    setShowSoftBreak(false);
    setPendingMessage(null);
    toast.info("Stannade i Snabbläge");
  }, []);

  const handleIgnoreType = useCallback((messageId: string) => {
    setIgnoredTypes(prev => [...prev, messageId]);
    toast.success("Typ ignorerad · Framtida liknande mail hamnar i lågprioritet");
  }, []);

  const handleRestoreIgnored = useCallback((messageId: string) => {
    setIgnoredTypes(prev => prev.filter(id => id !== messageId));
    toast.success("Ignorering ångrad");
  }, []);

  const handleRestoreAllIgnored = useCallback(() => {
    setIgnoredTypes([]);
    setShowRestoreIgnored(false);
    toast.success("Alla ignoreringar återställda");
  }, []);

  const toggleMultiSelect = useCallback(() => {
    setMultiSelectMode(prev => !prev);
    setSelectedMessages([]);
    toast.info(multiSelectMode ? "Multi-select avstängt" : "Multi-select påslaget");
  }, [multiSelectMode]);

  const toggleMessageSelection = useCallback((messageId: string) => {
    setSelectedMessages(prev => {
      if (prev.includes(messageId)) {
        return prev.filter(id => id !== messageId);
      } else {
        return [...prev, messageId];
      }
    });
  }, []);

  const handleBulkArchive = useCallback(() => {
    toast.success(`${selectedMessages.length} meddelanden arkiverade`);
    setSelectedMessages([]);
    setMultiSelectMode(false);
  }, [selectedMessages.length]);

  const handleBulkDelete = useCallback(() => {
    toast.success(`${selectedMessages.length} meddelanden raderade`);
    setSelectedMessages([]);
    setMultiSelectMode(false);
  }, [selectedMessages.length]);

  const handleBulkSnooze = useCallback(() => {
    toast.success(`${selectedMessages.length} meddelanden snoozade`);
    setSelectedMessages([]);
    setMultiSelectMode(false);
  }, [selectedMessages.length]);

  const handleBulkMarkHandled = useCallback(() => {
    toast.success(`${selectedMessages.length} meddelanden markerade som hanterade`);
    setSelectedMessages([]);
    setMultiSelectMode(false);
  }, [selectedMessages.length]);

  const handleClearSelection = useCallback(() => {
    setSelectedMessages([]);
  }, []);

  const handleAddMailbox = (mailbox: { email: string; name: string; signatureId: string; tones: string[]; categories: string[] }) => {
    // Convert to old format (use first tone for backward compatibility)
    const mailboxData = {
      email: mailbox.email,
      name: mailbox.name,
      signatureId: mailbox.signatureId,
      tone: mailbox.tones[0] as "professional" | "warm" | "casual",
      categories: mailbox.categories,
      tones: mailbox.tones,
    };
    addMailbox(mailboxData);
  };

  // Format receivedAt för tydligare visning
  const formatReceivedAt = (email: string) => {
    // Ta bort @ och eventuell 1 i slutet, kapitalisera första bokstaven
    const cleaned = email.replace('@', '').replace(/1$/, '');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  };

  // Density mode logic
  const showSections = {
    sprint: true,
    critical: densityMode !== "focus",
    high: densityMode === "work" || densityMode === "overview",
    normal: densityMode === "overview",
    low: densityMode === "overview",
  };

  // Category expansion state
  const [expandedCategories, setExpandedCategories] = useState({
    sprint: true,
    critical: true,
    urgent: true,
  });

  const toggleCategoryExpand = (category: 'sprint' | 'critical' | 'urgent') => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Helper function for tag styling
  const getTagConfig = (tag: string) => {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes('sprint')) return { icon: Zap, class: 'bg-emerald-100 text-emerald-800' };
    if (tagLower.includes('critical')) return { icon: AlertTriangle, class: 'bg-red-100 text-red-800' };
    if (tagLower.includes('bokning')) return { icon: null, class: 'bg-blue-100 text-blue-800' };
    if (tagLower.includes('omboka')) return { icon: null, class: 'bg-amber-100 text-amber-800' };
    return { icon: null, class: 'bg-gray-100 text-gray-700' };
  };

  // Render message item - KOMPAKT MED ALLA FUNKTIONER
  const renderMessageItem = (message: Message) => {
    const isSelected = selectedMessages.includes(message.id);
    
    // Density styling configuration
    const densityConfig = {
      comfortable: {
        avatarSize: 'h-11 w-11',
        padding: 'px-4 py-3',
        nameSize: 'text-[14px]',
        subjectSize: 'text-[12px]',
        previewSize: 'text-[10px]',
        showPreview: true,
        showAllBadges: true,
        showSentiment: true,
        showInternalNotes: true,
        rowGap: 'gap-3',
        contentGap: 'mb-1',
      },
      compact: {
        avatarSize: 'h-8 w-8',
        padding: 'px-3 py-2',
        nameSize: 'text-[11px]',
        subjectSize: 'text-[10px]',
        previewSize: 'text-[9px]',
        showPreview: true,
        showAllBadges: false, // Only show critical badges
        showSentiment: true,
        showInternalNotes: false,
        rowGap: 'gap-2.5',
        contentGap: 'mb-0.5',
      },
      'super-compact': {
        avatarSize: 'h-6 w-6',
        padding: 'px-3 py-1.5',
        nameSize: 'text-[10px]',
        subjectSize: 'text-[9px]',
        previewSize: 'text-[8px]',
        showPreview: false,
        showAllBadges: false,
        showSentiment: false,
        showInternalNotes: false,
        rowGap: 'gap-2',
        contentGap: 'mb-0',
      },
    };
    
    const config = densityConfig[viewDensity];
    
    // Sentiment emoji mapping
    const sentimentEmoji: Record<string, string> = {
      'happy': '😊',
      'frustrated': '😤',
      'neutral': '😐',
      'excited': '🎉',
      'worried': '😰',
    };

    // Revenue potential config
    const getRevenueBadge = () => {
      if (!message.revenuePotential) return null;
      const revenueMap: Record<string, { label: string; class: string }> = {
        'low': { label: '€', class: 'bg-gray-100 text-gray-600' },
        'medium': { label: '€€', class: 'bg-blue-100 text-blue-700' },
        'high': { label: '€€€', class: 'bg-purple-100 text-purple-700' },
        'premium': { label: '€€€€', class: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800' },
      };
      return revenueMap[message.revenuePotential];
    };

    // Journey stage config
    const getJourneyBadge = () => {
      if (!message.journeyStage) return null;
      const journeyMap: Record<string, { label: string; icon: string; class: string }> = {
        'lead': { label: 'Lead', icon: '🎯', class: 'bg-blue-50 text-blue-700' },
        'consultation': { label: 'Konsult', icon: '📋', class: 'bg-indigo-50 text-indigo-700' },
        'customer': { label: 'Kund', icon: '✓', class: 'bg-green-50 text-green-700' },
        'returning': { label: 'Återkom', icon: '🔄', class: 'bg-purple-50 text-purple-700' },
        'vip': { label: 'VIP', icon: '👑', class: 'bg-amber-50 text-amber-700' },
      };
      return journeyMap[message.journeyStage];
    };

    // Referral source icons
    const getReferralIcon = () => {
      if (!message.referralSource) return null;
      const sourceMap: Record<string, { icon: string; color: string }> = {
        'google': { icon: '🔍', color: 'text-blue-600' },
        'instagram': { icon: '📸', color: 'text-pink-600' },
        'facebook': { icon: '👥', color: 'text-blue-700' },
        'referral': { icon: '🤝', color: 'text-green-600' },
        'direct': { icon: '🔗', color: 'text-gray-600' },
        'tiktok': { icon: '🎵', color: 'text-cyan-600' },
      };
      return sourceMap[message.referralSource];
    };

    // Tag config
    const getIntentTag = () => {
      if (!message.intent) return null;
      const intentMap: Record<string, string> = {
        'Bokning': 'bg-blue-100 text-blue-800',
        'Omboka': 'bg-amber-100 text-amber-800',
        'Prisfråga': 'bg-slate-100 text-slate-800',
        'Uppföljning': 'bg-purple-100 text-purple-800',
        'Faktura': 'bg-indigo-100 text-indigo-800',
        'Feedback': 'bg-emerald-100 text-emerald-800',
      };
      return intentMap[message.intent] || 'bg-gray-100 text-gray-700';
    };

    const getPriorityTag = () => {
      const priorityMap: Record<string, { label: string; icon: any; class: string }> = {
        'sprint': { label: 'Sprint', icon: Zap, class: 'bg-emerald-100 text-emerald-700' },
        'critical': { label: 'Critical', icon: AlertTriangle, class: 'bg-red-100 text-red-700' },
        'high': { label: 'High', icon: Clock, class: 'bg-orange-100 text-orange-700' },
      };
      return priorityMap[message.priority] || null;
    };

    const priorityTag = getPriorityTag();
    const revenueBadge = getRevenueBadge();
    const journeyBadge = getJourneyBadge();
    const referralIcon = getReferralIcon();
    
    return (
      <div
        key={message.id}
        onClick={() => handleMessageClick(message)}
        className={`group relative cursor-pointer border-b border-gray-100 ${config.padding} transition-all duration-200 ${
          message.unread
            ? "bg-rose-50/40 hover:bg-rose-100/40"
            : "hover:bg-gray-50"
        } ${isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}
      >
        {multiSelectMode && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleMessageSelection(message.id)}
              className="h-4 w-4 rounded border-gray-300 text-pink-600"
            />
          </div>
        )}
        
        <div className={`flex items-start ${config.rowGap} ${multiSelectMode ? 'ml-6' : ''}`}>
          {/* Avatar with VIP/Duplicate indicators */}
          <div className="relative flex-shrink-0">
            <img
              src={message.avatar}
              alt={message.sender}
              className={`${config.avatarSize} rounded-full border border-gray-200 object-cover transition-all duration-200`}
            />
            {/* Unread indicator */}
            {message.unread && (
              <div className={`absolute -right-0.5 -top-0.5 rounded-full border-2 border-white bg-emerald-500 transition-all duration-200 ${
                viewDensity === 'super-compact' ? 'h-2 w-2' : 'h-3 w-3'
              }`} />
            )}
            {/* VIP Star */}
            {message.isVIP && (
              <div className={`absolute -right-1 -bottom-1 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white shadow-sm transition-all duration-200 ${
                viewDensity === 'super-compact' ? 'h-3.5 w-3.5' : 'h-5 w-5'
              }`}>
                <Star className={`text-white fill-white transition-all duration-200 ${viewDensity === 'super-compact' ? 'h-2 w-2' : 'h-3 w-3'}`} />
              </div>
            )}
            {/* Duplicate warning */}
            {message.isDuplicate && (
              <div className={`absolute -left-1 -bottom-1 flex items-center justify-center rounded-full bg-red-500 border-2 border-white shadow-sm transition-all duration-200 ${
                viewDensity === 'super-compact' ? 'h-3.5 w-3.5' : 'h-5 w-5'
              }`}>
                <Copy className="text-white transition-all duration-200 h-1 w-1" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Name, Sentiment, Time Row */}
            <div className="flex items-baseline justify-between gap-2 mb-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className={`${config.nameSize} ${message.unread ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                  {message.sender}
                </h3>
                {/* Sentiment Emoji */}
                {config.showSentiment && message.sentiment && (
                  <span className="text-[10px]" title={`Sentiment: ${message.sentiment}`}>
                    {sentimentEmoji[message.sentiment]}
                  </span>
                )}
                {/* Read Receipt */}
                {message.isRead && (
                  <Eye className="h-3.5 w-3.5 text-blue-500" title="Har läst ditt svar" />
                )}
              </div>
              <span className="flex-shrink-0 text-[11px] text-gray-500">{message.time}</span>
            </div>

            {/* Subject with Competitor Warning */}
            <div className={`flex items-center gap-1.5 ${config.contentGap}`}>
              <p className={`${config.subjectSize} truncate ${message.unread ? "text-gray-900" : "text-gray-700"}`}>
                {message.subject}
              </p>
              {message.competitorMentioned && (
                <AlertCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" title={`Nämner: ${message.competitorMentioned}`} />
              )}
            </div>

            {/* Phase 2 - NEW Smart Features Row */}
            <div className={`flex items-center gap-1.5 ${config.contentGap} flex-wrap`}>
              {/* Received At E-mail (endast om "Alla mail" är valt) */}
              {currentMailbox.id === 'alla' && message.receivedAt && (
                <span className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold border bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300 shadow-sm" title={`Skickad till: ${message.receivedAt}hairtpclinic.com`}>
                  <Mail className="h-2.5 w-2.5" />
                  {formatReceivedAt(message.receivedAt)}
                </span>
              )}
              
              {/* Language Detection */}
              {message.detectedLanguage && message.detectedLanguage !== 'sv' && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-cyan-50 px-1.5 py-0.5 text-[10px] font-medium text-cyan-700 border border-cyan-200" title={`Språk: ${message.detectedLanguage.toUpperCase()}`}>
                  <Globe className="h-2.5 w-2.5" />
                  {message.detectedLanguage.toUpperCase()}
                </span>
              )}

              {/* Lifetime Value */}
              {message.lifetimeValue !== undefined && message.lifetimeValue > 0 && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  message.lifetimeValue > 100000 ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800' :
                  message.lifetimeValue > 50000 ? 'bg-indigo-100 text-indigo-800' :
                  message.lifetimeValue > 10000 ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`} title="Customer Lifetime Value">
                  <DollarSign className="h-2.5 w-2.5" />
                  {(message.lifetimeValue / 1000).toFixed(0)}k
                </span>
              )}

              {/* Assigned To */}
              {message.assignedTo && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-700 border border-teal-200" title={`Tilldelad: ${message.assignedTo}`}>
                  <UserCheck className="h-2.5 w-2.5" />
                  {message.assignedTo.split(' ')[0]}
                </span>
              )}

              {/* Handoff Status */}
              {message.handoffStatus && message.handoffStatus !== 'unassigned' && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                  message.handoffStatus === 'completed' ? 'bg-green-100 text-green-700' :
                  message.handoffStatus === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`} title={`Status: ${message.handoffStatus}`}>
                  <Activity className="h-2.5 w-2.5" />
                  {message.handoffStatus === 'in-progress' ? 'Pågår' : message.handoffStatus === 'waiting' ? 'Väntar' : '✓'}
                </span>
              )}

              {/* Churn Risk */}
              {message.churnRisk && message.churnRisk !== 'low' && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                  message.churnRisk === 'high' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`} title="Churn Risk">
                  <TrendingDown className="h-2.5 w-2.5" />
                  Risk
                </span>
              )}

              {/* Medical Flags */}
              {message.medicalFlags && message.medicalFlags.length > 0 && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 border-2 border-red-200" title={message.medicalFlags.join(', ')}>
                  <Stethoscope className="h-2.5 w-2.5" />
                  {message.medicalFlags.length}
                </span>
              )}

              {/* Voice Note */}
              {message.hasVoiceNote && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700" title="Har röstmeddelande">
                  <Mic className="h-2.5 w-2.5" />
                </span>
              )}

              {/* Typing Indicator */}
              {message.isTyping && (
                <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700 animate-pulse" title="Skriver ett svar...">
                  <MessageSquare className="h-2.5 w-2.5" />
                  Skriver...
                </span>
              )}

              {/* Treatment History Count */}
              {message.treatmentHistory && message.treatmentHistory.length > 0 && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700" title={message.treatmentHistory.join(' • ')}>
                  <FileText className="h-2.5 w-2.5" />
                  {message.treatmentHistory.length} beh.
                </span>
              )}

              {/* Needs Follow-up */}
              {message.needsFollowup && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700" title="Behöver uppföljning">
                  <Bell className="h-2.5 w-2.5" />
                  Följ upp
                </span>
              )}

              {/* SLA Prediction */}
              {message.slaPrediction && message.slaPrediction !== 'safe' && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  message.slaPrediction === 'will-breach' ? 'bg-red-100 text-red-800 animate-pulse' :
                  'bg-amber-100 text-amber-800'
                }`} title="SLA Prediction">
                  <Sparkles className="h-2.5 w-2.5" />
                  {message.slaPrediction === 'will-breach' ? 'SLA!' : 'Risk'}
                </span>
              )}

              {/* Consent Status - Minimal indicator */}
              {message.consentStatus && (message.consentStatus.gdpr || message.consentStatus.photos || message.consentStatus.marketing) && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700" title={`GDPR: ${message.consentStatus.gdpr ? '✓' : '✗'} | Foto: ${message.consentStatus.photos ? '✓' : '✗'} | Marknad: ${message.consentStatus.marketing ? '✓' : '✗'}`}>
                  <Shield className="h-2.5 w-2.5" />
                </span>
              )}

              {/* Insurance */}
              {message.insurance && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-700" title={`Försäkring: ${message.insurance}`}>
                  💼
                </span>
              )}

              {/* Quick Reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-pink-50 px-1.5 py-0.5 text-[10px]" title="Team reactions">
                  {message.reactions.join(' ')}
                </span>
              )}
            </div>

            {/* Smart Indicators Row */}
            <div className={`flex items-center gap-1.5 ${config.contentGap} flex-wrap`}>
              {/* Revenue Potential */}
              {revenueBadge && (
                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${revenueBadge.class}`} title="Revenue Potential">
                  {revenueBadge.label}
                </span>
              )}

              {/* Journey Stage */}
              {journeyBadge && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${journeyBadge.class}`} title="Customer Journey">
                  <span>{journeyBadge.icon}</span>
                  {journeyBadge.label}
                </span>
              )}

              {/* Conversion Probability */}
              {message.conversionProbability !== undefined && (
                <span 
                  className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                    message.conversionProbability >= 80 ? 'bg-green-100 text-green-700' :
                    message.conversionProbability >= 50 ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}
                  title="Conversion Probability"
                >
                  <TrendingUp className="h-2.5 w-2.5" />
                  {message.conversionProbability}%
                </span>
              )}

              {/* Referral Source */}
              {config.showAllBadges && referralIcon && (
                <span 
                  className="inline-flex items-center gap-0.5 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium border border-gray-200"
                  title={`Källa: ${message.referralSource}`}
                >
                  <span className={referralIcon.color}>{referralIcon.icon}</span>
                </span>
              )}

              {/* Interaction Count */}
              {config.showAllBadges && message.interactionCount !== undefined && message.interactionCount > 1 && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700" title="Antal interaktioner">
                  <Users className="h-2.5 w-2.5" />
                  {message.interactionCount}x
                </span>
              )}

              {/* Duplicate Count */}
              {message.isDuplicate && message.duplicateCount && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700" title="Duplicate emails detected">
                  <Copy className="h-2.5 w-2.5" />
                  {message.duplicateCount} mail
                </span>
              )}

              {/* Time Since Last Visit */}
              {message.timeSinceLastVisit && message.timeSinceLastVisit !== 'Aldrig' && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700" title="Senaste besök">
                  <Clock className="h-2.5 w-2.5" />
                  {message.timeSinceLastVisit}
                </span>
              )}

              {/* Stagnation Warning */}
              {message.isStagnant && message.stagnantDays && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700" title="Konversation stagnerande">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {message.stagnantDays}d stagnant
                </span>
              )}

              {/* Avg Response Time - Performance indicator */}
              {message.avgResponseTime && message.avgResponseTime !== 'N/A' && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                  message.avgResponseTime.includes('min') && parseInt(message.avgResponseTime) < 30 ? 'bg-green-100 text-green-700' :
                  message.avgResponseTime.includes('h') ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`} title={`Genomsnittlig svarstid: ${message.avgResponseTime}`}>
                  ⚡ {message.avgResponseTime}
                </span>
              )}

              {/* Best Time to Reply */}
              {config.showAllBadges && message.bestTimeToReply && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700" title={`Bästa tid att svara: ${message.bestTimeToReply}`}>
                  ⏰ {message.bestTimeToReply}
                </span>
              )}
            </div>

            {/* Upsell Opportunity - Prominent display if exists */}
            {config.showAllBadges && message.upsellOpportunity && (
              <div className="mb-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`Upsell: ${message.upsellOpportunity}`);
                  }}
                  className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-purple-50 to-pink-50 px-2 py-1 text-[11px] font-semibold text-purple-700 border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {message.upsellOpportunity}
                </button>
              </div>
            )}

            {/* AI Suggested Reply - Click to use */}
            {config.showAllBadges && message.suggestedReply && (
              <div className="mb-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success('Föreslagt svar kopierat!');
                  }}
                  className="group/reply w-full text-left rounded-md bg-blue-50 px-2 py-1.5 text-[11px] text-blue-900 hover:bg-blue-100 border border-blue-200 transition-all"
                >
                  <div className="flex items-start gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-blue-700 mb-0.5">Föreslagen svar:</div>
                      <div className="line-clamp-2 opacity-90">{message.suggestedReply}</div>
                    </div>
                    <Copy className="h-1 w-1 text-blue-600 opacity-0 group-hover/reply:opacity-100 transition-opacity mt-0.5" />
                  </div>
                </button>
              </div>
            )}

            {/* Smart Scheduling - Available slots */}
            {message.suggestedSlots && message.suggestedSlots.length > 0 && (
              <div className="mb-1.5">
                <div className="flex items-center gap-1 flex-wrap">
                  <Calendar className="h-1 w-1 text-emerald-600" />
                  <span className="text-[10px] font-semibold text-emerald-700">Lediga tider:</span>
                  {message.suggestedSlots.slice(0, 3).map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`Tid vald: ${slot}`);
                      }}
                      className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Notes - Expandable */}
            {config.showInternalNotes && message.internalNotes && message.internalNotes.length > 0 && (
              <div className="mb-1">
                <details className="group/notes">
                  <summary className="cursor-pointer inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-800 border border-yellow-200 hover:bg-yellow-100 transition-colors">
                    <FileText className="h-2.5 w-2.5" />
                    {message.internalNotes.length} intern{message.internalNotes.length > 1 ? 'a' : ''} notering{message.internalNotes.length > 1 ? 'ar' : ''}
                    <ChevronDown className="h-2.5 w-2.5 group-open/notes:rotate-180 transition-transform" />
                  </summary>
                  <div className="mt-1 ml-4 space-y-0.5">
                    {message.internalNotes.map((note, idx) => (
                      <div key={idx} className="text-[10px] text-gray-600 flex items-start gap-1">
                        <span className="text-yellow-600">•</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}

            {/* Tags Row - Intent, Priority, SLA */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Intent Tag */}
              {message.intent && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${getIntentTag()}`}>
                  {message.intent}
                </span>
              )}

              {/* Priority Tag */}
              {priorityTag && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${priorityTag.class}`}>
                  <priorityTag.icon className="h-2.5 w-2.5" />
                  {priorityTag.label}
                </span>
              )}

              {/* SLA Tag */}
              {message.sla && (
                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                  message.slaStatus === 'breach' 
                    ? 'bg-red-100 text-red-800' 
                    : message.slaStatus === 'warning'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  <Clock className="h-2.5 w-2.5" />
                  {message.sla}
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions - Archive & Snooze Icons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.success(`Arkiverad: ${message.sender}`);
              }}
              className="rounded p-1.5 hover:bg-gray-100 transition-colors"
              title="Arkivera"
            >
              <Archive className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.success(`Snoozad: ${message.sender}`);
              }}
              className="rounded p-1.5 hover:bg-gray-100 transition-colors"
              title="Snooze"
            >
              <Clock className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 bg-white px-4 py-3">
          <h2 className="text-sm font-bold text-gray-900">Inkorg</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="large" text="Laddar meddelanden..." />
        </div>
      </div>
    );
  }

  // Empty state - Inga meddelanden
  if (allMessages.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 bg-white px-4 py-3">
          <h2 className="text-sm font-bold text-gray-900">Inkorg</h2>
        </div>
        <div className="flex-1">
          <EmptyState
            variant="inbox"
            title="Inga meddelanden"
            description="Du har inga meddelanden i din inkorg just nu"
            actionLabel="Uppdatera"
            onAction={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
          />
        </div>
      </div>
    );
  }

  // Get page title based on filterType
  const getPageTitle = () => {
    switch (filterType) {
      case "later":
        return "Senare";
      case "sent":
        return "Skickade";
      default:
        return t("nav.inbox");
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header - Med SEPARATA MODE-KNAPPAR */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        {/* Rad 1: Inkorg + Mailbox Dropdown + Actionknappar */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-gray-900">{getPageTitle()}</h2>
            {/* Mail Dropdown */}
            <MailboxDropdown
              mailboxes={mailboxes}
              currentMailbox={currentMailbox}
              onSelect={setCurrentMailbox}
              onAddNew={() => setShowAddMailbox(true)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            {ignoredTypes.length > 0 && (
              <button
                onClick={() => setShowRestoreIgnored(true)}
                className="flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-1 text-[10px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <RotateCcw className="h-1 w-1" />
                {ignoredTypes.length}
              </button>
            )}
            <button
              onClick={toggleMultiSelect}
              className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-all ${
                multiSelectMode
                  ? 'bg-gradient-to-r from-pink-100 to-pink-200 border-pink-300 text-pink-800 shadow-sm'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <CheckSquare className="h-1 w-1" />
              {multiSelectMode && selectedMessages.length > 0 ? selectedMessages.length : ""}
            </button>
            <button
              onClick={() => toast.info("Inkorg-alternativ")}
              className="rounded-md p-1.5 hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Rad 2: MODE-KNAPPAR (Fokus, Arbete, Översikt) + View Density */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* FOKUS MODE */}
            <button
              onClick={() => {
                setDensityMode('focus');
                toast.success('Fokusläge aktiverat');
              }}
              className={`flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[10px] font-semibold transition-all ${
                densityMode === 'focus'
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 text-emerald-900 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Target className="h-2.5 w-2.5" />
              Fokus
            </button>
            
            {/* ARBETE MODE */}
            <button
              onClick={() => {
                setDensityMode('work');
                toast.success('Arbetsläge aktiverat');
              }}
              className={`flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[10px] font-semibold transition-all ${
                densityMode === 'work'
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-900 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="h-2.5 w-2.5" />
              Arbete
            </button>
            
            {/* ÖVERSIKT MODE */}
            <button
              onClick={() => {
                setDensityMode('overview');
                toast.success('Översiktsläge aktiverat');
              }}
              className={`flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[10px] font-semibold transition-all ${
                densityMode === 'overview'
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 text-purple-900 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-2.5 w-2.5" />
              Översikt
            </button>
          </div>
          
          {/* VIEW DENSITY TOGGLE */}
          <ViewDensityToggle
            viewDensity={viewDensity}
            onViewDensityChange={setViewDensity}
          />
        </div>
      </div>

      {/* Messages - Progressive Disclosure */}
      <div className="flex-1 overflow-y-auto">
        {/* Sprint (Aktiva) */}
        <div>
          <div className="sticky top-0 z-10 bg-emerald-50 px-3 py-1 border-b border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="h-1 w-1 text-emerald-700" />
                <h3 className="text-[9px] font-semibold text-gray-900">Sprint · Fokus nu ({sprintMessages.length}/3)</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-emerald-700">Max 3 aktiva</span>
                <button
                  onClick={() => toggleCategoryExpand('sprint')}
                  className="rounded p-1 hover:bg-emerald-100 transition-colors"
                >
                  {expandedCategories.sprint ? (
                    <ChevronUp className="h-3.5 w-3.5 text-emerald-700" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-emerald-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
          {expandedCategories.sprint && sprintMessages.map((msg) => (
            <MinimalMessageItem
              key={msg.id}
              message={msg}
              isSelected={currentSelectedId === msg.id}
              onClick={() => handleMessageClick(msg)}
              multiSelectMode={multiSelectMode}
              isMultiSelected={selectedMessages.includes(msg.id)}
              onToggleMultiSelect={toggleMessageSelection}
              showReceivedAt={currentMailbox.id === "alla"}
            />
          ))}
          {!expandedCategories.sprint && sprintMessages.length > 0 && (
            <div className="px-4 py-2 bg-emerald-50/30 text-center">
              <button
                onClick={() => toggleCategoryExpand('sprint')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
              >
                Visa {sprintMessages.length} sprint →
              </button>
            </div>
          )}
        </div>

        {/* Kritiskt */}
        <div>
          <div className="sticky top-0 z-10 bg-rose-50 px-3 py-1 border-b border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-1 w-1 text-red-600" />
                <h3 className="text-[9px] font-semibold text-gray-900">Kritiskt · SLA-risk ({criticalMessages.length})</h3>
              </div>
              <button
                onClick={() => toggleCategoryExpand('critical')}
                className="rounded p-1 hover:bg-red-100 transition-colors"
              >
                {expandedCategories.critical ? (
                  <ChevronUp className="h-3.5 w-3.5 text-red-600" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-red-600" />
                )}
              </button>
            </div>
          </div>
          {expandedCategories.critical && criticalMessages.map((msg) => (
            <MinimalMessageItem
              key={msg.id}
              message={msg}
              isSelected={currentSelectedId === msg.id}
              onClick={() => handleMessageClick(msg)}
              multiSelectMode={multiSelectMode}
              isMultiSelected={selectedMessages.includes(msg.id)}
              onToggleMultiSelect={toggleMessageSelection}
              showReceivedAt={currentMailbox.id === "alla"}
            />
          ))}
          {!expandedCategories.critical && criticalMessages.length > 0 && (
            <div className="px-4 py-2 bg-red-50/30 text-center">
              <button
                onClick={() => toggleCategoryExpand('critical')}
                className="text-xs font-medium text-red-700 hover:text-red-900"
              >
                Visa {criticalMessages.length} kritiska →
              </button>
            </div>
          )}
        </div>

        {/* Kräver svar idag */}
        <div>
          <div className="sticky top-0 z-10 bg-amber-50 px-3 py-1 border-b border-amber-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="h-1 w-1 text-orange-600" />
                <h3 className="text-[9px] font-semibold text-gray-900">Kräver svar idag ({highMessages.length})</h3>
              </div>
              <button
                onClick={() => toggleCategoryExpand('urgent')}
                className="rounded p-1 hover:bg-amber-100 transition-colors"
              >
                {expandedCategories.urgent ? (
                  <ChevronUp className="h-3.5 w-3.5 text-orange-600" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-orange-600" />
                )}
              </button>
            </div>
          </div>
          {expandedCategories.urgent && highMessages.map((msg) => (
            <MinimalMessageItem
              key={msg.id}
              message={msg}
              isSelected={currentSelectedId === msg.id}
              onClick={() => handleMessageClick(msg)}
              multiSelectMode={multiSelectMode}
              isMultiSelected={selectedMessages.includes(msg.id)}
              showReceivedAt={currentMailbox.id === "alla"}
              onToggleMultiSelect={toggleMessageSelection}
            />
          ))}
          {!expandedCategories.urgent && highMessages.length > 0 && (
            <div className="px-4 py-2 bg-amber-50/30 text-center">
              <button
                onClick={() => toggleCategoryExpand('urgent')}
                className="text-xs font-medium text-amber-700 hover:text-amber-900"
              >
                Visa {highMessages.length} brådskande →
              </button>
            </div>
          )}
        </div>

        {/* Normal SECTION */}
        {showSections.normal && normalMessages.length > 0 && (
          <div>
            <button
              onClick={() => setShowNormal(!showNormal)}
              className="sticky top-0 z-10 w-full bg-gray-50 px-4 py-2 border-b border-gray-100 text-left hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-semibold text-gray-700">
                  <span>{t("messages.other")} ({normalMessages.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">
                    {showNormal ? t("messages.hide") : `${t("messages.show")} ${normalMessages.length} ${t("messages.more")}`}
                  </span>
                  {showNormal ? (
                    <ChevronUp className="h-3.5 w-3.5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
                  )}
                </div>
              </div>
            </button>
            {showNormal &&
              normalMessages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isSelected={selectedId === message.id}
                  onClick={() => handleMessageClick(message)}
                  compact={true}
                  densityMode={densityMode}
                  onIgnore={handleIgnoreType}
                  agingFade={true}
                  multiSelectMode={multiSelectMode}
                  isMultiSelected={selectedMessages.includes(message.id)}
                  onToggleMultiSelect={toggleMessageSelection}
                />
              ))}
          </div>
        )}

        {/* LOW PRIORITY SECTION */}
        {showSections.low && lowMessages.length > 0 && (
          <div>
            <button
              onClick={() => setShowLow(!showLow)}
              className="sticky top-0 z-10 w-full bg-gray-50 px-4 py-2 border-b border-gray-100 text-left hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-medium text-gray-600">
                  <span>{t("messages.lowPriority")} ({lowMessages.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">
                    {showLow ? t("messages.hide") : `${t("messages.show")} ${lowMessages.length}`}
                  </span>
                  {showLow ? (
                    <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  )}
                </div>
              </div>
            </button>
            {showLow &&
              lowMessages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isSelected={selectedId === message.id}
                  onClick={() => handleMessageClick(message)}
                  compact={true}
                  densityMode={densityMode}
                  agingFade={true}
                />
              ))}
          </div>
        )}
      </div>

      {/* Soft Break Modal */}
      {showSoftBreak && pendingMessage && (
        <SoftBreakModal
          onContinue={handleSoftBreakContinue}
          onCancel={handleSoftBreakCancel}
          messageSubject={pendingMessage.subject}
        />
      )}

      {/* Restore Ignored Modal */}
      {showRestoreIgnored && (
        <RestoreIgnoredModal
          onClose={() => setShowRestoreIgnored(false)}
          ignoredTypes={ignoredTypes}
          onRestore={handleRestoreIgnored}
          onRestoreAll={handleRestoreAllIgnored}
        />
      )}

      {/* Add Mailbox Modal */}
      {showAddMailbox && (
        <AddMailboxModal
          onClose={() => setShowAddMailbox(false)}
          onAdd={handleAddMailbox}
          availableSignatures={[
            { id: "fazli", name: "Fazli Krasniqi" },
            { id: "egzona", name: "Egzona Krasniqi" },
          ]}
        />
      )}

      {/* Multi-Select Toolbar */}
      <MultiSelectToolbar
        selectedCount={selectedMessages.length}
        onArchive={handleBulkArchive}
        onDelete={handleBulkDelete}
        onSnooze={handleBulkSnooze}
        onMarkHandled={handleBulkMarkHandled}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}

function MessageItem({
  message,
  isSelected,
  onClick,
  showDetails = false,
  compact = false,
  densityMode = "work",
  onIgnore,
  agingFade = false,
  multiSelectMode = false,
  isMultiSelected = false,
  onToggleMultiSelect,
}: {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
  showDetails?: boolean;
  compact?: boolean;
  densityMode?: DensityMode;
  onIgnore?: (messageId: string) => void;
  agingFade?: boolean;
  multiSelectMode?: boolean;
  isMultiSelected?: boolean;
  onToggleMultiSelect?: (messageId: string) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useLanguage();

  const handleClick = () => {
    if (multiSelectMode && onToggleMultiSelect) {
      onToggleMultiSelect(message.id);
    } else {
      onClick();
    }
  };
  
  const warmthConfig = {
    cold: { color: "bg-blue-400", label: "Kall" },
    warm: { color: "bg-amber-500", label: "Varm" },
    hot: { color: "bg-orange-600", label: "Het" },
  };

  const lifecycleConfig = {
    new: { icon: "🆕", label: "Ny" },
    active: { icon: "⚡", label: "Aktiv" },
    returning: { icon: "🔄", label: "Återkom" },
    dormant: { icon: "💤", label: "Vilande" },
  };

  const slaColor =
    message.slaStatus === "breach"
      ? "bg-red-100/70 text-red-900/80"
      : message.slaStatus === "warning"
      ? "bg-amber-100/70 text-amber-900/80"
      : "bg-green-100/70 text-green-900/80";

  const getSlaTooltip = () => {
    if (message.slaStatus === "breach") return t("tooltip.sla.breach");
    if (message.slaStatus === "warning") return t("tooltip.sla.warning");
    return t("tooltip.sla.safe");
  };

  // Adjust sizing based on density mode
  const isOverview = densityMode === "overview";
  const avatarSize = isOverview ? (compact ? "h-8 w-8" : "h-9 w-9") : (compact ? "h-9 w-9" : "h-10 w-10");
  const padding = isOverview ? "py-1.5" : (compact ? "py-2" : "py-2.5");
  
  // Aging fade for old, low priority messages
  const opacity = agingFade && message.priority === "low" ? "opacity-60" : "";

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer border-b border-gray-50 px-4 transition-all ${padding} ${message.unread ? "bg-rose-50/30" : ""} ${
        isSelected ? "bg-gray-50/70" : "hover:bg-gray-50/40"
      } ${opacity} ${isMultiSelected ? "bg-pink-100/50 border-l-4 border-l-pink-500" : ""}`}
    >
      <div className="flex gap-2.5">
        {/* Multi-select checkbox */}
        {multiSelectMode && (
          <div className="flex items-center pt-1.5">
            <input
              type="checkbox"
              checked={isMultiSelected}
              onChange={(e) => {
                e.stopPropagation();
                onToggleMultiSelect?.(message.id);
              }}
              className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
          </div>
        )}

        {/* Unread/Warmth Indicator */}
        <div className="flex items-start pt-1.5">
          {message.unread ? (
            <div className="h-1 w-1 rounded-full bg-emerald-400 shadow-sm" />
          ) : message.warmth ? (
            <div
              className={`h-1 w-1 rounded-full ${
                warmthConfig[message.warmth].color
              }`}
            />
          ) : (
            <div className="h-1 w-1" />
          )}
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0">
          {message.avatar ? (
            <img
              src={message.avatar}
              alt={message.sender}
              className={`rounded-full border border-gray-100 object-cover ${avatarSize}`}
            />
          ) : (
            <div
              className={`flex items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 border border-rose-200 ${avatarSize}`}
            >
              <Mail className="h-[16px] w-[16px] text-rose-700" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p
                  className={`truncate font-semibold text-gray-900 ${
                    isOverview ? "text-[11px]" : (compact ? "text-[12px]" : "text-[13px]")
                  }`}
                >
                  {message.sender}
                </p>
                {message.lifecycle && !compact && !isOverview && (
                  <span className="text-[10px]">
                    {lifecycleConfig[message.lifecycle].icon}
                  </span>
                )}
              </div>
              <p
                className={`truncate font-semibold text-gray-800 ${
                  isOverview ? "text-[10px]" : (compact ? "text-[11px]" : "text-[12px]")
                }`}
              >
                {message.subject}
              </p>
              {message.preview && !compact && !isOverview && (
                <p className="mt-0.5 truncate text-[11px] text-gray-500">
                  {message.preview}
                </p>
              )}

              {/* Details for Sprint/Critical */}
              {showDetails && !isOverview && (
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                  {message.intent && (
                    <span className="text-gray-600">
                      Intent: {message.intent} ({message.confidence}%)
                    </span>
                  )}
                  {message.warmth && (
                    <span className="text-gray-400">•</span>
                  )}
                  {message.warmth && (
                    <span className="text-gray-600">
                      {warmthConfig[message.warmth].label}
                    </span>
                  )}
                </div>
              )}

              {/* Recommended Action with Tooltip */}
              {message.recommendedAction && showDetails && !isOverview && (
                <div className="relative mt-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(`Åtgärd: ${message.recommendedAction}`);
                    }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    💡 {message.recommendedAction}
                  </button>
                  {showTooltip && (
                    <div className="absolute left-0 top-full mt-1 z-20 w-48 rounded-lg bg-gray-900 px-2.5 py-2 text-[10px] text-white shadow-lg">
                      {t("tooltip.action.why")}: intent ({message.confidence}%), warmth ({message.warmth}), lifecycle ({message.lifecycle})
                    </div>
                  )}
                </div>
              )}

              {/* Ignore button for low priority */}
              {onIgnore && (message.priority === "normal" || message.priority === "low") && !isOverview && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIgnore(message.id);
                  }}
                  className="mt-1.5 flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <XCircle className="h-1 w-1" />
                  Ignorera typ
                </button>
              )}
            </div>

            {/* Time & SLA */}
            <div className="flex flex-col items-end gap-1">
              <span className={isOverview ? "text-[10px] text-gray-500" : "text-[11px] text-gray-500"}>{message.time}</span>
              {message.sla && (
                <div className="relative group">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[9px] font-medium ${slaColor}`}
                  >
                    SLA {message.sla}
                  </span>
                  <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-20 w-48 rounded-lg bg-gray-900 px-2.5 py-2 text-[10px] text-white shadow-lg">
                    {getSlaTooltip()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}