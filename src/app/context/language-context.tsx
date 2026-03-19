import { createContext, useContext, useState, ReactNode } from "react";

type Language = "sv" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  sv: {
    // Header
    "header.search": "Sök kund, tråd eller ämne",
    "header.swedish": "Svenska",
    "header.changeClinic": "Byt klinik",
    "header.logout": "Logga ut",
    "header.sprintMode": "Snabbläge",
    "header.sprintModeOn": "Snabbläge påslaget",
    "header.sprintModeOff": "Snabbläge avstängt",
    "header.on": "På",
    "header.off": "Av",
    "header.left": "kvar",
    
    // Navigation
    "nav.inbox": "Inkorg",
    "nav.unanswered": "Obesvarade",
    "nav.snoozed": "Snoozed",
    "nav.drafts": "Utkast",
    "nav.archive": "Arkiv",
    
    // Message list
    "messages.newSince": "nya sedan",
    "messages.sprint": "Sprint · Fokus nu",
    "messages.maxActive": "Max 3 aktiva",
    "messages.critical": "Kritiskt · SLA-risk",
    "messages.needsReplyToday": "Kräver svar idag",
    "messages.other": "Övrigt",
    "messages.lowPriority": "Lågprioritet · Marketing & Notiser",
    "messages.show": "Visa",
    "messages.hide": "Dölj",
    "messages.more": "till",
    
    // Density modes
    "density.focus": "Fokus",
    "density.work": "Arbete",
    "density.overview": "Översikt",
    "density.focusDesc": "Sprint + Kritiskt endast",
    "density.workDesc": "Balanserad vy (standard)",
    "density.overviewDesc": "Kompakt, många synliga",
    
    // New: Global Density
    "density.compact": "Kompakt",
    "density.comfortable": "Bekväm",
    "density.spacious": "Rymlig",
    "density.compactDesc": "Mer synligt, mindre mellanrum",
    "density.comfortableDesc": "Balanserad (standard)",
    "density.spaciousDesc": "Mer mellanrum, lättare läsning",
    
    // Conversation
    "conversation.tabs.conversation": "Konversation",
    "conversation.tabs.customerHistory": "Kundhistorik",
    "conversation.tabs.history": "Historik",
    "conversation.sla": "SLA",
    "conversation.slaLeft": "kvar",
    "conversation.breach": "RISK!",
    "conversation.warning": "Varning",
    "conversation.ok": "OK",
    "conversation.breachAt": "Breach om",
    "conversation.businessHours": "Baserat på öppettider: Mån-Fre 08:00-20:00",
    "conversation.noActivity": "Ingen aktivitet på",
    "conversation.suggestFollowup": "Föreslå uppföljning för att hålla kontakten varm",
    "conversation.latestMessage": "Senaste meddelande",
    
    // Svarstudio
    "studio.title": "Svarstudio",
    "studio.risk": "Risknivå",
    "studio.high": "Hög",
    "studio.short": "Kort",
    "studio.warm": "Varm",
    "studio.professional": "Proffsig",
    "studio.recommendedMode": "Rekommenderat läge",
    "studio.why": "Varför",
    "studio.shorten": "Förkorta",
    "studio.warmer": "Varmare",
    "studio.moreProfessional": "Professionell",
    "studio.sharper": "Skarpare",
    "studio.copyReply": "Kopiera svar",
    "studio.copy": "Kopiera",
    "studio.returnLater": "Återkom senare",
    "studio.markHandled": "Markera hanterad",
    "studio.markHandledSuccess": "Markerad som hanterad · Flyttad till arkiv",
    "studio.saveDraft": "Spara utkast",
    "studio.delete": "Radera",
    "studio.sendReply": "Skicka svar",
    "studio.compliance": "Tillåtlista OK · Policy OK · Risk OK · Signatur OK",
    "studio.wordCount": "ord",
    "studio.recommended": "rekommenderat",
    "studio.options": "Svarstudio-alternativ",
    "studio.copiedToClipboard": "Kopierat till urklipp!",
    "studio.draftText": "Vid eventuella frågor är du välkommen att kontakta oss.",
    "studio.copiedToStudio": "Svar kopierat till Svarstudio!",
    "studio.copyToStudio": "Kopiera till Svarstudio",
    "studio.templateCopied": "Mall kopierad!",
    "studio.suggestedReplyCopied": "Föreslagt svar kopierat!",
    
    // Customer Intelligence
    "intelligence.title": "Kundöversikt",
    "intelligence.lifecycle": "Kundstatus",
    "intelligence.warmth": "Kundengagemang",
    "intelligence.intent": "Avsikt",
    
    // Actions
    "actions.archive": "Arkivera",
    "actions.archived": "Arkiverad",
    "actions.delete": "Radera",
    "actions.deleted": "Raderad",
    "actions.markHandled": "Markera hanterad",
    "actions.markedHandled": "Markerad som hanterad",
    "actions.snooze": "Snooze",
    "actions.reply": "Svara",
    "actions.forward": "Vidarebefordra",
    "actions.copy": "Kopiera",
    
    // Bulk actions
    "bulk.messagesArchived": "meddelanden arkiverade",
    "bulk.messagesDeleted": "meddelanden raderade",
    "bulk.messagesMarkedHandled": "meddelanden markerade som hanterade",
    "bulk.messagesSnoozed": "meddelanden snoozade",
    
    // Message actions
    "message.archived": "Arkiverad",
    "message.snoozed": "Snoozad",
    "message.typeIgnored": "Typ ignorerad · Framtida liknande mail hamnar i lågprioritet",
    "message.ignoreRestored": "Ignorering ångrad",
    "message.allIgnoresRestored": "Alla ignoreringar återställda",
    "message.multiSelectOn": "Multi-select påslaget",
    "message.multiSelectOff": "Multi-select avstängt",
    "message.aiSuggestion": "AI-föreslagen svar:",
    "message.mailboxAdded": "Mailbox tillagd!",
    
    // Delete modal
    "delete.title": "Radera meddelande?",
    "delete.subtitle": "Detta går att ångra inom 30 dagar",
    "delete.safeDeleteTitle": "Säker radering:",
    "delete.safeDeleteDesc": "Meddelandet flyttas till Papperskorg (inte permanent raderat). Du kan återställa det inom 30 dagar.",
    "delete.softBreakTitle": "Soft Break:",
    "delete.confirm": "Ja, radera",
    "delete.cancel": "Avbryt",
    
    // Tooltips
    "tooltip.sla.safe": "Tid kvar: Mycket tid · Ingen brådska",
    "tooltip.sla.warning": "Varning: Mindre än hälften av tiden kvar",
    "tooltip.sla.breach": "RISK: Mindre än 25% av tiden kvar · Svara omedelbart!",
    "tooltip.action.why": "AI rekommenderar detta baserat på",
    "tooltip.archive": "Arkivera",
    "tooltip.focusSearch": "Fokusera sökfält",
    
    // Soft break (Snabbläge)
    "softbreak.title": "Lämna Snabbläge?",
    "softbreak.activeThreads": "aktiva sprint-trådar",
    "softbreak.warning": "Du försöker öppna ett meddelande utanför sprint-zonen.",
    "softbreak.message": "Meddelande",
    "softbreak.helpsFocus": "Snabbläge hjälper dig fokusera",
    "softbreak.description": "Max 3 trådar i fokus → Färre samtidigt → Snabbare hantering",
    "softbreak.stay": "Stanna i Sprint",
    "softbreak.stayedInSprint": "Stannade i Snabbläge",
    "softbreak.continue": "Fortsätt ändå",
    
    // Onboarding
    "onboarding.welcome.title": "Välkommen till CCO!",
    "onboarding.welcome.desc": "Din intelligenta bokningshanterare. Låt oss visa dig de viktigaste funktionerna.",
    "onboarding.welcome.highlight": "Tar bara 60 sekunder",
    "onboarding.sprint.title": "Snabbläge",
    "onboarding.sprint.desc": "Fokusera på max 3 trådar åt gången för snabbare hantering. Perfekt för att komma ikapp!",
    "onboarding.sprint.highlight": "Aktiveras i header-menyn",
    "onboarding.progressive.title": "Progressive Disclosure",
    "onboarding.progressive.desc": "Meddelanden sorteras automatiskt: Sprint → Kritiskt → Behöver svar → Övrigt. Ingen overwhelm!",
    "onboarding.progressive.highlight": "Klicka för att expandera sektioner",
    "onboarding.density.title": "Density Modes",
    "onboarding.density.desc": "Välj mellan Fokus, Arbete eller Översikt för att anpassa hur mycket du ser samtidigt.",
    "onboarding.density.highlight": "Finns i inkorgen",
    "onboarding.ai.title": "AI-rekommendationer",
    "onboarding.ai.desc": "CCO föreslår nästa steg baserat på avsikt, kundengagemang och kundstatus. Bara följa förslag!",
    "onboarding.ai.highlight": "💡 ikon på varje meddelande",
    "onboarding.ready": "Redo att börja! 🚀",
    "onboarding.skipped": "Tutorial överhoppad",
    
    // Keyboard shortcuts
    "shortcuts.title": "Tangentbordsgenvägar",
    "shortcuts.navigation": "Navigering",
    "shortcuts.nextMessage": "Nästa meddelande",
    "shortcuts.prevMessage": "Föregående meddelande",
    "shortcuts.replyMessage": "Svara på meddelande",
    "shortcuts.archiveMessage": "Arkivera meddelande",
    "shortcuts.snoozeMessage": "Snooze meddelande",
    "shortcuts.actions": "Åtgärder",
    "shortcuts.toggleSprint": "Växla Snabbläge",
    "shortcuts.closeModal": "Stäng modal/dialog",
    "shortcuts.focusSearch": "Fokusera sökfält",
    "shortcuts.switchTab": "Byt flik (Inkorg, Obesvarade, etc.)",
    
    // Stats Dashboard
    "stats.title": "Statistik Dashboard",
    "stats.thisWeek": "Denna vecka",
    "stats.lastWeek": "Förra veckan",
    "stats.sprintUsage": "Snabbläge användning",
    "stats.messagesHandled": "Meddelanden hanterade",
    "stats.avgResponseTime": "Snitt svarstid",
    "stats.customerSatisfaction": "Kundnöjdhet",
    
    // Multi-select toolbar
    "multiselect.selected": "valda",
    "multiselect.deselectAll": "Avmarkera alla",
    
    // Progressive disclosure
    "progressive.expand": "Visa mer",
    "progressive.collapse": "Visa mindre",
    "progressive.intent": "Avsikt",
    "progressive.action": "Åtgärd",
    "progressive.tags": "Taggar",
    "progressive.journey": "Kundresa",
    "progressive.sentiment": "Sentiment",
    "progressive.conversion": "konvertering",
    
    // Focus mode
    "focus.mode": "Fokusläge",
    "focus.exitFocus": "Avsluta fokus",
    "focus.active": "Fokusläge aktivt",
    "focus.hiddenSidebars": "Sidopaneler dolda för distraheringsfritt arbete",
    "focus.pressToExit": "eller",
    "focus.toExit": "för att avsluta",
    
    // Customer panel tabs
    "customer.overview": "Översikt",
    "customer.journey": "Kundresa",
    "customer.insights": "Insikter",
    "customer.details": "Detaljer",
    "customer.selectConversation": "Välj en konversation för att visa kunddetaljer",
    "customer.lifetimeValue": "Livstidsvärde",
    "customer.engagement": "Engagemang",
    "customer.potential": "Potential",
    "customer.churnRisk": "Risk för bortfall",
    "customer.topInsights": "Viktigaste insikter",
    "customer.highChurnRisk": "Hög risk för bortfall",
    "customer.noEngagement": "Kunden har inte engagerat sig på 30 dagar. Överväg kontakt.",
    "customer.upsellOpportunity": "Merförsäljningsmöjlighet",
    "customer.highConversion": "Hög konverteringssannolikhet",
    "customer.likelyToConvert": "% sannolikhet att konvertera. Perfekt tillfälle för erbjudande!",
    "customer.quickActions": "Snabbåtgärder",
    "customer.sendFollowup": "Skicka uppföljning",
    "customer.scheduleCall": "Boka samtal",
    "customer.markVip": "Markera som VIP",
    "customer.customerJourney": "Kundresa",
    "customer.stage": "Steg",
    "customer.activityTimeline": "Aktivitetstidslinje",
    "customer.conversationStarted": "Konversation startad",
    "customer.bookingCompleted": "Bokning genomförd",
    "customer.initialConsultation": "Första konsultation",
    "customer.firstContact": "Första kontakt",
    "customer.treatmentHistory": "Behandlingshistorik",
    "customer.aiRecommendedAction": "AI-rekommenderad åtgärd",
    "customer.suggestedReply": "Föreslagit svar",
    "customer.useThisReply": "Använd detta svar",
    "customer.behavioralInsights": "Beteendeinsikter",
    "customer.avgResponseTime": "Snitt svarstid",
    "customer.preferredChannel": "Föredraget kanal",
    "customer.bestTimeToReply": "Bästa tid att svara",
    "customer.engagementScore": "Engagemangspoäng",
    "customer.contactInformation": "Kontaktinformation",
    "customer.email": "E-post",
    "customer.phone": "Telefon",
    "customer.location": "Plats",
    "customer.medicalFlags": "Medicinska flaggor",
    "customer.consentStatus": "Samtyckestatus",
    "customer.gdpr": "GDPR",
    "customer.photoUsage": "Fotoanvändning",
    "customer.marketing": "Marknadsföring",
    "customer.notGiven": "Ej givet",
    "customer.internalNotes": "Interna anteckningar",
    "customer.teamAssignment": "Teamtilldelning",
    "customer.unassigned": "Ej tilldelad",
    "customer.lead": "lead",
    "customer.consultation": "konsultation",
    "customer.customer": "kund",
    "customer.returning": "återkommande",
    "customer.vip": "vip",
    
    // Loading states
    "loading.loading": "Laddar",
    "loading.loadingMessages": "Laddar meddelanden...",
    "loading.loadingConversation": "Laddar konversation...",
    "loading.loadingCustomer": "Laddar kundinformation...",
  },
  en: {
    // Header
    "header.search": "Search customer, thread or topic",
    "header.swedish": "English",
    "header.changeClinic": "Change clinic",
    "header.logout": "Logout",
    "header.sprintMode": "Sprint mode",
    "header.sprintModeOn": "Sprint mode enabled",
    "header.sprintModeOff": "Sprint mode disabled",
    "header.on": "On",
    "header.off": "Off",
    "header.left": "left",
    
    // Navigation
    "nav.inbox": "Inbox",
    "nav.unanswered": "Unanswered",
    "nav.snoozed": "Snoozed",
    "nav.drafts": "Drafts",
    "nav.archive": "Archive",
    
    // Message list
    "messages.newSince": "new since",
    "messages.sprint": "Sprint · Focus now",
    "messages.maxActive": "Max 3 active",
    "messages.critical": "Critical · SLA risk",
    "messages.needsReplyToday": "Needs reply today",
    "messages.other": "Other",
    "messages.lowPriority": "Low priority · Marketing & Notifications",
    "messages.show": "Show",
    "messages.hide": "Hide",
    "messages.more": "more",
    
    // Density modes
    "density.focus": "Focus",
    "density.work": "Work",
    "density.overview": "Overview",
    "density.focusDesc": "Sprint + Critical only",
    "density.workDesc": "Balanced view (default)",
    "density.overviewDesc": "Compact, many visible",
    
    // New: Global Density
    "density.compact": "Compact",
    "density.comfortable": "Comfortable",
    "density.spacious": "Spacious",
    "density.compactDesc": "More visible, less spacing",
    "density.comfortableDesc": "Balanced (default)",
    "density.spaciousDesc": "More spacing, easier reading",
    
    // Conversation
    "conversation.tabs.conversation": "Conversation",
    "conversation.tabs.customerHistory": "Customer History",
    "conversation.tabs.history": "History",
    "conversation.sla": "SLA",
    "conversation.slaLeft": "left",
    "conversation.breach": "RISK!",
    "conversation.warning": "Warning",
    "conversation.ok": "OK",
    "conversation.breachAt": "Breach at",
    "conversation.businessHours": "Based on business hours: Mon-Fri 08:00-20:00",
    "conversation.noActivity": "No activity for",
    "conversation.suggestFollowup": "Suggest follow-up to keep the contact warm",
    "conversation.latestMessage": "Latest message",
    
    // Response studio
    "studio.title": "Response Studio",
    "studio.risk": "Risk level",
    "studio.high": "High",
    "studio.short": "Short",
    "studio.warm": "Warm",
    "studio.professional": "Professional",
    "studio.recommendedMode": "Recommended mode",
    "studio.why": "Why",
    "studio.shorten": "Shorten",
    "studio.warmer": "Warmer",
    "studio.moreProfessional": "Professional",
    "studio.sharper": "Sharper",
    "studio.copyReply": "Copy reply",
    "studio.copy": "Copy",
    "studio.returnLater": "Return later",
    "studio.markHandled": "Mark handled",
    "studio.markHandledSuccess": "Marked as handled · Moved to archive",
    "studio.saveDraft": "Save draft",
    "studio.delete": "Delete",
    "studio.sendReply": "Send reply",
    "studio.compliance": "Allowlist OK · Policy OK · Risk OK · Signature OK",
    "studio.wordCount": "words",
    "studio.recommended": "recommended",
    "studio.options": "Response Studio options",
    "studio.copiedToClipboard": "Copied to clipboard!",
    "studio.draftText": "If you have any questions, feel free to contact us.",
    "studio.copiedToStudio": "Reply copied to Response Studio!",
    "studio.copyToStudio": "Copy to Response Studio",
    "studio.templateCopied": "Template copied!",
    "studio.suggestedReplyCopied": "Suggested reply copied!",
    
    // Customer Intelligence
    "intelligence.title": "Customer Intelligence",
    "intelligence.lifecycle": "Lifecycle",
    "intelligence.warmth": "Warmth",
    "intelligence.intent": "Intent",
    
    // Actions
    "actions.archive": "Archive",
    "actions.archived": "Archived",
    "actions.delete": "Delete",
    "actions.deleted": "Deleted",
    "actions.markHandled": "Mark handled",
    "actions.markedHandled": "Marked as handled",
    "actions.snooze": "Snooze",
    "actions.reply": "Reply",
    "actions.forward": "Forward",
    "actions.copy": "Copy",
    
    // Bulk actions
    "bulk.messagesArchived": "messages archived",
    "bulk.messagesDeleted": "messages deleted",
    "bulk.messagesMarkedHandled": "messages marked as handled",
    "bulk.messagesSnoozed": "messages snoozed",
    
    // Message actions
    "message.archived": "Archived",
    "message.snoozed": "Snoozed",
    "message.typeIgnored": "Type ignored · Future similar emails will be in low priority",
    "message.ignoreRestored": "Ignore restored",
    "message.allIgnoresRestored": "All ignores restored",
    "message.multiSelectOn": "Multi-select enabled",
    "message.multiSelectOff": "Multi-select disabled",
    "message.aiSuggestion": "AI suggested reply:",
    "message.mailboxAdded": "Mailbox added!",
    
    // Delete modal
    "delete.title": "Delete message?",
    "delete.subtitle": "This can be undone within 30 days",
    "delete.safeDeleteTitle": "Safe delete:",
    "delete.safeDeleteDesc": "The message will be moved to Trash (not permanently deleted). You can restore it within 30 days.",
    "delete.softBreakTitle": "Soft Break:",
    "delete.confirm": "Yes, delete",
    "delete.cancel": "Cancel",
    
    // Tooltips
    "tooltip.sla.safe": "Time left: Plenty of time · No rush",
    "tooltip.sla.warning": "Warning: Less than half the time remaining",
    "tooltip.sla.breach": "RISK: Less than 25% time left · Reply immediately!",
    "tooltip.action.why": "AI recommends this based on",
    "tooltip.archive": "Archive",
    "tooltip.focusSearch": "Focus search field",
    
    // Soft break
    "softbreak.title": "Leave Sprint mode?",
    "softbreak.activeThreads": "active sprint threads",
    "softbreak.warning": "You're trying to open a message outside the sprint zone.",
    "softbreak.message": "Message",
    "softbreak.helpsFocus": "Sprint mode helps you focus",
    "softbreak.description": "Max 3 threads in focus → Fewer at once → Faster handling",
    "softbreak.stay": "Stay in Sprint",
    "softbreak.stayedInSprint": "Stayed in Sprint mode",
    "softbreak.continue": "Continue anyway",
    
    // Onboarding
    "onboarding.welcome.title": "Welcome to CCO!",
    "onboarding.welcome.desc": "Your intelligent booking manager. Let us show you the key features.",
    "onboarding.welcome.highlight": "Takes only 60 seconds",
    "onboarding.sprint.title": "Sprint Mode",
    "onboarding.sprint.desc": "Focus on max 3 threads at a time for faster handling. Perfect for catching up!",
    "onboarding.sprint.highlight": "Activate in header menu",
    "onboarding.progressive.title": "Progressive Disclosure",
    "onboarding.progressive.desc": "Messages are sorted automatically: Sprint → Critical → Needs Reply → Other. No overwhelm!",
    "onboarding.progressive.highlight": "Click to expand sections",
    "onboarding.density.title": "Density Modes",
    "onboarding.density.desc": "Choose between Focus, Work or Overview to customize how much you see at once.",
    "onboarding.density.highlight": "Found in inbox",
    "onboarding.ai.title": "AI recommendations",
    "onboarding.ai.desc": "CCO suggests next steps based on intent, warmth and lifecycle. Just follow suggestions!",
    "onboarding.ai.highlight": "💡 icon on each message",
    "onboarding.ready": "Ready to start! 🚀",
    "onboarding.skipped": "Tutorial skipped",
    
    // Keyboard shortcuts
    "shortcuts.title": "Keyboard Shortcuts",
    "shortcuts.navigation": "Navigation",
    "shortcuts.nextMessage": "Next message",
    "shortcuts.prevMessage": "Previous message",
    "shortcuts.replyMessage": "Reply to message",
    "shortcuts.archiveMessage": "Archive message",
    "shortcuts.snoozeMessage": "Snooze message",
    "shortcuts.actions": "Actions",
    "shortcuts.toggleSprint": "Toggle Sprint mode",
    "shortcuts.closeModal": "Close modal/dialog",
    "shortcuts.focusSearch": "Focus search field",
    "shortcuts.switchTab": "Switch tab (Inbox, Unanswered, etc.)",
    
    // Stats Dashboard
    "stats.title": "Statistics Dashboard",
    "stats.thisWeek": "This week",
    "stats.lastWeek": "Last week",
    "stats.sprintUsage": "Sprint mode usage",
    "stats.messagesHandled": "Messages handled",
    "stats.avgResponseTime": "Avg response time",
    "stats.customerSatisfaction": "Customer satisfaction",
    
    // Multi-select toolbar
    "multiselect.selected": "selected",
    "multiselect.deselectAll": "Deselect all",
    
    // Progressive disclosure
    "progressive.expand": "Show more",
    "progressive.collapse": "Show less",
    "progressive.intent": "Intent",
    "progressive.action": "Action",
    "progressive.tags": "Tags",
    "progressive.journey": "Journey",
    "progressive.sentiment": "Sentiment",
    "progressive.conversion": "conversion",
    
    // Focus mode
    "focus.mode": "Focus Mode",
    "focus.exitFocus": "Exit Focus",
    "focus.active": "Focus Mode Active",
    "focus.hiddenSidebars": "Sidebars hidden for distraction-free work",
    "focus.pressToExit": "or",
    "focus.toExit": "to exit",
    
    // Customer panel tabs
    "customer.overview": "Overview",
    "customer.journey": "Journey",
    "customer.insights": "Insights",
    "customer.details": "Details",
    "customer.selectConversation": "Select a conversation to view customer details",
    "customer.lifetimeValue": "Lifetime Value",
    "customer.engagement": "Engagement",
    "customer.potential": "Potential",
    "customer.churnRisk": "Churn Risk",
    "customer.topInsights": "Top Insights",
    "customer.highChurnRisk": "High Churn Risk",
    "customer.noEngagement": "Customer hasn't engaged in 30 days. Consider outreach.",
    "customer.upsellOpportunity": "Upsell Opportunity",
    "customer.highConversion": "High Conversion Probability",
    "customer.likelyToConvert": "% likely to convert. Great timing for offer!",
    "customer.quickActions": "Quick Actions",
    "customer.sendFollowup": "Send Follow-up",
    "customer.scheduleCall": "Schedule Call",
    "customer.markVip": "Mark as VIP",
    "customer.customerJourney": "Customer Journey",
    "customer.stage": "Stage",
    "customer.activityTimeline": "Activity Timeline",
    "customer.conversationStarted": "Conversation started",
    "customer.bookingCompleted": "Booking completed",
    "customer.initialConsultation": "Initial consultation",
    "customer.firstContact": "First contact",
    "customer.treatmentHistory": "Treatment History",
    "customer.aiRecommendedAction": "AI Recommended Action",
    "customer.suggestedReply": "Suggested Reply",
    "customer.useThisReply": "Use This Reply",
    "customer.behavioralInsights": "Behavioral Insights",
    "customer.avgResponseTime": "Avg Response Time",
    "customer.preferredChannel": "Preferred Channel",
    "customer.bestTimeToReply": "Best Time to Reply",
    "customer.engagementScore": "Engagement Score",
    "customer.contactInformation": "Contact Information",
    "customer.email": "Email",
    "customer.phone": "Phone",
    "customer.location": "Location",
    "customer.medicalFlags": "Medical Flags",
    "customer.consentStatus": "Consent Status",
    "customer.gdpr": "GDPR",
    "customer.photoUsage": "Photo Usage",
    "customer.marketing": "Marketing",
    "customer.notGiven": "Not given",
    "customer.internalNotes": "Internal Notes",
    "customer.teamAssignment": "Team Assignment",
    "customer.unassigned": "Unassigned",
    "customer.lead": "lead",
    "customer.consultation": "consultation",
    "customer.customer": "customer",
    "customer.returning": "returning",
    "customer.vip": "vip",
    
    // Loading states
    "loading.loading": "Loading",
    "loading.loadingMessages": "Loading messages...",
    "loading.loadingConversation": "Loading conversation...",
    "loading.loadingCustomer": "Loading customer information...",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("sv");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.sv] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}