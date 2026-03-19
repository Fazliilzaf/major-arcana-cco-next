/**
 * CCO TERMBANK - Svenska företagstermer
 * 
 * Denna fil innehåller alla officiella svenska termer för CCO-systemet.
 * Använd alltid dessa termer för konsekvens i hela applikationen.
 */

export const TERMINOLOGY = {
  // Huvudfunktioner
  responseStudio: "Svarstudio",
  customerIntelligence: "Kundöversikt",
  sprintMode: "Snabbläge",
  
  // AI & Rekommendationer
  recommendedActions: "Rekommenderade åtgärder",
  aiGenerated: "AI-genererat",
  aiSuggestion: "AI-förslag",
  confidence: "Tillförlitlighet",
  
  // Kundstatus
  warmthIndicator: "Kundengagemang",
  lifecycle: "Kundstatus",
  lifecycleStatus: "Kundstatus",
  
  // Warmth-nivåer
  warmth: {
    cold: "Kall",
    warm: "Varm",
    hot: "Het"
  },
  
  // Lifecycle-status
  lifecycleStages: {
    new: "Ny",
    active: "Aktiv",
    returning: "Återkommande",
    dormant: "Vilande"
  },
  
  // Prioritet
  priority: {
    sprint: "Sprint",
    critical: "Kritisk",
    high: "Hög",
    normal: "Normal",
    low: "Låg"
  },
  
  // SLA
  sla: "SLA",
  slaStatus: {
    safe: "Säker",
    warning: "Varning",
    breach: "Överskriden"
  },
  
  // Actions
  allowlist: "Tillåtlista",
  delete: "Radera",
  archive: "Arkivera",
  snooze: "Snooza",
  draft: "Utkast",
  
  // Mailbox
  inbox: "Inkorg",
  mailbox: "Brevlåda",
  allMailboxes: "Alla brevlådor",
  
  // Misc
  unread: "Oläst",
  read: "Läst",
  handled: "Hanterad",
  intent: "Avsikt",
  sentiment: "Känsla"
} as const;

// Type för autocomplete
export type Terminology = typeof TERMINOLOGY;
