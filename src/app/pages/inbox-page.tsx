import { ProgressiveMessageList } from "../components/progressive-message-list";
import { ReversedConversationDetailCompact } from "../components/reversed-conversation-detail-compact";
import { CustomerPanelTabs } from "../components/customer-panel-tabs";
import { ResizableLayout } from "../components/resizable-layout";
import { OnboardingTutorial } from "../components/onboarding-tutorial";
import { FocusModeToggle, useFocusMode, FocusModeBanner } from "../components/focus-mode-toggle";
import { MessageListSkeleton, ConversationSkeleton, CustomerPanelSkeleton } from "../components/skeleton-loaders";
import { useState, useEffect } from "react";
import { MessageSquare, User } from "lucide-react";

export function InboxPage() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { isFocusMode, setIsFocusMode } = useFocusMode();

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock messages data (same as in InboxWithSidebar)
  const allMessages = [
    {
      id: "1",
      sender: "Johan Lagerström",
      subject: "Bokning av tid",
      preview: "Hej, jag vill boka en tid...",
      time: "19:22",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      unread: true,
      sla: "1m",
      slaStatus: "breach" as const,
      slaMinutesLeft: 1,
      priority: "sprint" as const,
      warmth: "hot" as const,
      lifecycle: "active" as const,
      intent: "Bokning",
      confidence: 98,
      recommendedAction: "Bekräfta tid",
      tags: ["Bokning", "Sprint"],
      slaRisk: "breach" as const,
      slaTime: "1m",
      sentiment: "excited" as const,
      isVIP: false,
      revenuePotential: "high" as const,
      journeyStage: "lead" as const,
      isDuplicate: false,
      timeSinceLastVisit: "Aldrig",
      interactionCount: 1,
      conversionProbability: 85,
      referralSource: "instagram" as const,
      isRead: false,
      isStagnant: false,
      suggestedReply: "Hej Johan! Självklart! Vi har lediga tider på torsdag 14:00 eller fredag 10:30. Vilken passar bäst?",
      suggestedSlots: ["Torsdag 14:00", "Fredag 10:30", "Måndag 13:00"],
      detectedLanguage: "sv" as const,
      upsellOpportunity: "Kunden frågade om fillers → föreslå konsultation paket",
      lifetimeValue: 0,
      needsFollowup: true,
      avgResponseTime: "N/A",
      bestTimeToReply: "18:00-20:00",
      assignedTo: "Sara Lindberg",
      internalNotes: ["Första kontakten", "Verkar mycket intresserad"],
      handoffStatus: "in-progress" as const,
      churnRisk: "low" as const,
      treatmentHistory: [] as string[],
      medicalFlags: [] as string[],
      consentStatus: { gdpr: false, photos: false, marketing: false },
      insurance: undefined,
      isTyping: false,
      reactions: [] as string[],
      hasVoiceNote: false,
      slaPrediction: "will-breach" as const,
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
      slaStatus: "breach" as const,
      slaMinutesLeft: 30,
      priority: "sprint" as const,
      warmth: "warm" as const,
      lifecycle: "active" as const,
      intent: "Omboka",
      confidence: 95,
      recommendedAction: "Föreslå ny tid",
      tags: ["Omboka", "Sprint"],
      slaRisk: "breach" as const,
      slaTime: "30m",
      sentiment: "worried" as const,
      isVIP: true,
      revenuePotential: "premium" as const,
      journeyStage: "customer" as const,
      isDuplicate: false,
      timeSinceLastVisit: "2 veckor",
      interactionCount: 8,
      conversionProbability: 95,
      referralSource: "referral" as const,
      isRead: true,
      isStagnant: false,
      suggestedReply: "Hej Anna! Inga problem, jag förstår. Vad sägs om onsdag 15:00 eller torsdag 11:00?",
      suggestedSlots: ["Onsdag 15:00", "Torsdag 11:00", "Fredag 14:00"],
      detectedLanguage: "sv" as const,
      upsellOpportunity: "Återkommande VIP → erbjud premium membership",
      lifetimeValue: 127500,
      needsFollowup: false,
      avgResponseTime: "12 min",
      bestTimeToReply: "17:00-19:00",
      assignedTo: "Dr. Eriksson",
      internalNotes: ["VIP-kund sedan 2 år", "Alltid mycket nöjd", "Prefererar Dr. Eriksson"],
      handoffStatus: "in-progress" as const,
      churnRisk: "low" as const,
      treatmentHistory: ["Fillers (2024-02)", "Botox (2024-01)", "Konsultation (2023-11)"],
      medicalFlags: ["Allergi: Latex"],
      consentStatus: { gdpr: true, photos: true, marketing: true },
      insurance: "Folksam Premium",
      isTyping: true,
      reactions: ["👍", "❤️"],
      hasVoiceNote: false,
      slaPrediction: "at-risk" as const,
    },
    // Add more messages if needed...
  ];

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem("cco-onboarding-completed");
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("cco-onboarding-completed", "true");
    setShowOnboarding(false);
  };

  // Get the actual message object from ID
  const currentMessage = selectedMessage 
    ? allMessages.find(m => m.id === selectedMessage) || allMessages[0]
    : allMessages[0];

  return (
    <>
      {/* Focus Mode Banner */}
      {isFocusMode && <FocusModeBanner />}

      <div className={`flex h-screen flex-col bg-gray-50 ${isFocusMode ? 'pt-10' : ''}`}>
        {/* Focus Mode Toggle - Fixed position */}
        <div className="absolute top-20 right-6 z-40">
          <FocusModeToggle 
            isFocusMode={isFocusMode} 
            onToggle={() => setIsFocusMode(!isFocusMode)} 
          />
        </div>

        {/* Resizable Three-Column Layout */}
        {isFocusMode ? (
          // Focus Mode: Only conversation
          <div className="flex-1 flex">
            <div className="flex-1 bg-white">
              {isLoading ? <ConversationSkeleton /> : <ReversedConversationDetailCompact />}
            </div>
          </div>
        ) : (
          // Normal Mode: Three columns
          <ResizableLayout
            leftColumn={
              isLoading ? <MessageListSkeleton /> : (
                <ProgressiveMessageList
                  selectedMessage={selectedMessage}
                  onSelectMessage={setSelectedMessage}
                />
              )
            }
            centerColumn={isLoading ? <ConversationSkeleton /> : <ReversedConversationDetailCompact />}
            rightColumn={isLoading ? <CustomerPanelSkeleton /> : <CustomerPanelTabs message={currentMessage} />}
          />
        )}
      </div>

      {/* Onboarding Tutorial */}
      {showOnboarding && !isFocusMode && (
        <OnboardingTutorial onComplete={handleOnboardingComplete} />
      )}
    </>
  );
}