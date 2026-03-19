import { ConversationContext } from "../components/conversation-context-card";

export interface CustomerHistory {
  name: string;
  isVIP: boolean;
  totalBookings: number;
  lastBooking?: string;
  preferredTimes?: string[];
  medicalNotes?: string[];
  customerSince?: string;
}

export interface Message {
  from: "customer" | "staff";
  text: string;
  timestamp: string;
}

export interface AIReplyOptions {
  context: ConversationContext;
  customerHistory: CustomerHistory;
  latestMessage: Message;
  conversationMessages: Message[];
  tone?: "professional" | "friendly" | "empathetic" | "urgent";
  language?: "sv" | "en";
}

/**
 * AI-POWERED AUTO REPLY GENERATOR
 * 
 * Generates contextual, personalized replies based on:
 * - Service type & intent
 * - Customer history & VIP status
 * - Latest message content
 * - Conversation context
 * - Medical notes & special requests
 */
export function generateAIReply(options: AIReplyOptions): string {
  const {
    context,
    customerHistory,
    latestMessage,
    conversationMessages,
    tone = "friendly",
    language = "sv"
  } = options;

  // Extract key info
  const customerName = customerHistory.name.split(" ")[0]; // First name
  const isVIP = customerHistory.isVIP;

  // Generate reply based on intent & service type
  let baseReply = "";
  switch (context.intent) {
    case "booking":
      baseReply = generateBookingReply(context, customerHistory, customerName, latestMessage);
      break;
    
    case "question":
      baseReply = generateQuestionReply(context, customerHistory, customerName, latestMessage);
      break;
    
    case "follow-up":
      baseReply = generateFollowUpReply(context, customerHistory, customerName, latestMessage);
      break;
    
    case "reschedule":
      baseReply = generateRescheduleReply(context, customerHistory, customerName, latestMessage);
      break;
    
    case "complaint":
      baseReply = generateComplaintReply(context, customerHistory, customerName, latestMessage);
      break;
    
    case "cancellation":
      baseReply = generateCancellationReply(context, customerHistory, customerName, latestMessage);
      break;
    
    default:
      baseReply = generateGenericReply(customerName, isVIP);
      break;
  }
  
  // NO signature here - Svarsstudion adds it automatically!
  return baseReply;
}

function generateBookingReply(
  context: ConversationContext,
  history: CustomerHistory,
  customerName: string,
  latestMessage: Message
): string {
  const isVIP = history.isVIP;
  const greeting = `Hej ${customerName}!`;

  // If customer confirmed a time
  if (context.status === "awaiting-confirmation" && context.confirmedDate) {
    const lines: string[] = [greeting];
    
    lines.push("");
    lines.push(`Perfekt! Jag bekräftar din ${context.serviceName.toLowerCase()} för **${context.confirmedDate}**.`);
    lines.push("");
    
    // Add price if mentioned
    if (context.mentionedPrice) {
      lines.push(`Pris: ${context.mentionedPrice.toLocaleString("sv-SE")} kr`);
      lines.push("");
    }
    
    // Add special requests confirmation
    if (context.specialRequests && context.specialRequests.length > 0) {
      lines.push("Jag har noterat:");
      context.specialRequests.forEach(req => {
        lines.push(`- ${req}`);
      });
      lines.push("");
    }
    
    // Medical notes warning
    if (context.medicalNotes && context.medicalNotes.length > 0) {
      lines.push("OBS: Jag ser att du har medicinska noteringar. Vi går igenom dessa vid besöket.");
      lines.push("");
    }
    
    // VIP treatment
    if (isVIP) {
      lines.push("Som VIP-kund har vi reserverat extra tid för dig.");
      lines.push("");
    }
    
    lines.push("Du får en bekräftelse via email och SMS inom kort.");
    lines.push("");
    lines.push("Ser fram emot att träffa dig!");
    
    return lines.join("\n");
  }
  
  // If customer asked about availability
  if (context.proposedDates && context.proposedDates.length > 0) {
    const lines: string[] = [greeting];
    
    lines.push("");
    lines.push(`Självklart! Vi har följande tider lediga för ${context.serviceName.toLowerCase()}:`);
    lines.push("");
    
    context.proposedDates.forEach((date, idx) => {
      lines.push(`${idx + 1}. ${date}`);
    });
    
    lines.push("");
    lines.push("Vilken tid passar bäst för dig?");
    
    if (context.mentionedPrice) {
      lines.push("");
      lines.push(`Pris: ${context.mentionedPrice.toLocaleString("sv-SE")} kr`);
    }
    
    return lines.join("\n");
  }
  
  // Default booking response
  return `${greeting}\n\nTack för ditt meddelande! Jag kollar lediga tider för ${context.serviceName.toLowerCase()} och återkommer inom kort.`;
}

function generateQuestionReply(
  context: ConversationContext,
  history: CustomerHistory,
  customerName: string,
  latestMessage: Message
): string {
  const greeting = `Hej ${customerName}!`;
  
  const lines: string[] = [greeting];
  lines.push("");
  
  // Service-specific answers
  if (context.serviceType === "prp") {
    lines.push("Tack för din fråga om PRP-behandling!");
    lines.push("");
    lines.push("**PRP (Platelet-Rich Plasma)** är en naturlig behandling som:");
    lines.push("- Stimulerar hårväxt");
    lines.push("- Stärker hårsäckarna");
    lines.push("- Ger synliga resultat efter 3-6 månader");
    lines.push("");
    lines.push("Pris: 8,500 kr per behandling");
    lines.push("Behandlingstid: ca 60 min");
    lines.push("Rekommenderat: 3-4 behandlingar");
  } else if (context.serviceType === "hair-transplant") {
    lines.push("Tack för din fråga om hårtransplantation!");
    lines.push("");
    lines.push("**Vi erbjuder både FUE och DHI:**");
    lines.push("");
    lines.push("**FUE (Follicular Unit Extraction):**");
    lines.push("- Minimal ärrbildning");
    lines.push("- Naturligt resultat");
    lines.push("Från 30,000 kr");
    lines.push("");
    lines.push("**DHI (Direct Hair Implantation):**");
    lines.push("- Mer precision");
    lines.push("- Snabbare läkning");
    lines.push("Från 45,000 kr");
    lines.push("");
    lines.push("Vill du boka en kostnadsfri konsultation?");
  } else if (context.serviceType === "consultation") {
    lines.push("Tack för ditt intresse!");
    lines.push("");
    lines.push("**Kostnadsfri konsultation inkluderar:**");
    lines.push("- Håranalys");
    lines.push("- Behandlingsplan");
    lines.push("- Prisuppskattning");
    lines.push("- Före/efter-bilder");
    lines.push("");
    lines.push("När passar det bäst för dig?");
  }
  
  // Add budget info if mentioned
  if (context.budget) {
    lines.push("");
    lines.push(`Jag ser att din budget är ${context.budget.min.toLocaleString("sv-SE")}-${context.budget.max.toLocaleString("sv-SE")} kr. Vi kan absolut hitta en lösning inom denna ram!`);
  }
  
  // Special requests
  if (context.specialRequests) {
    lines.push("");
    context.specialRequests.forEach(req => {
      if (req.includes("före/efter")) {
        lines.push("Jag bifogar före/efter-bilder från tidigare patienter.");
      } else if (req.includes("finansiering")) {
        lines.push("Vi erbjuder delbetalning via Klarna (0% ränta i 12 månader).");
      }
    });
  }
  
  lines.push("");
  lines.push("Har du fler frågor?");
  
  return lines.join("\n");
}

function generateFollowUpReply(
  context: ConversationContext,
  history: CustomerHistory,
  customerName: string,
  latestMessage: Message
): string {
  const greeting = `Hej ${customerName}!`;
  
  const lines: string[] = [greeting];
  lines.push("");
  lines.push("Tack för att du hör av dig!");
  lines.push("");
  
  if (history.lastBooking) {
    lines.push(`Jag ser att du hade din senaste behandling ${history.lastBooking}.`);
    lines.push("");
  }
  
  lines.push("Hur känner du dig efter behandlingen? Är du nöjd med resultatet?");
  lines.push("");
  
  if (context.serviceType === "prp") {
    lines.push("För bästa resultat rekommenderar vi en uppföljning efter 3 månader.");
  }
  
  lines.push("");
  lines.push("Låt mig veta om du vill boka en uppföljning eller har några frågor!");
  
  return lines.join("\n");
}

function generateRescheduleReply(
  context: ConversationContext,
  history: CustomerHistory,
  customerName: string,
  latestMessage: Message
): string {
  const greeting = `Hej ${customerName}!`;
  
  const lines: string[] = [greeting];
  lines.push("");
  lines.push("Inga problem! Jag hjälper dig att omboka.");
  lines.push("");
  
  if (context.proposedDates && context.proposedDates.length > 0) {
    lines.push("Vi har följande tider lediga:");
    lines.push("");
    context.proposedDates.forEach((date, idx) => {
      lines.push(`${idx + 1}. ${date}`);
    });
    lines.push("");
    lines.push("Vilken passar bäst?");
  } else {
    lines.push("Vilka tider passar dig bättre? Jag kollar vår kalender.");
  }
  
  return lines.join("\n");
}

function generateComplaintReply(
  context: ConversationContext,
  history: CustomerHistory,
  customerName: string,
  latestMessage: Message
): string {
  const greeting = `Hej ${customerName},`;
  
  const lines: string[] = [greeting];
  lines.push("");
  lines.push("Tack för att du hör av dig. Jag beklagar att du inte är nöjd.");
  lines.push("");
  lines.push("Din feedback är mycket viktig för oss. Vi vill självklart göra allt rätt.");
  lines.push("");
  lines.push("Kan du berätta mer om vad som hänt? Jag vill förstå situationen bättre så vi kan hitta en lösning.");
  lines.push("");
  
  if (history.isVIP) {
    lines.push("Som vår värdefulla VIP-kund är det extra viktigt för oss att du är helt nöjd.");
    lines.push("");
  }
  
  lines.push("Jag är här för att hjälpa dig.");
  
  return lines.join("\n");
}

function generateCancellationReply(
  context: ConversationContext,
  history: CustomerHistory,
  customerName: string,
  latestMessage: Message
): string {
  const greeting = `Hej ${customerName}!`;
  
  const lines: string[] = [greeting];
  lines.push("");
  lines.push("Tack för att du meddelar oss i tid.");
  lines.push("");
  
  if (context.confirmedDate) {
    lines.push(`Jag har avbokat din tid ${context.confirmedDate}.`);
    lines.push("");
  }
  
  lines.push("Vill du boka en ny tid längre fram, eller ska vi avvakta?");
  lines.push("");
  lines.push("Hör av dig när det passar dig!");
  
  return lines.join("\n");
}

function generateGenericReply(customerName: string, isVIP: boolean): string {
  const greeting = `Hej ${customerName}!`;
  
  return `${greeting}\n\nTack för ditt meddelande! Jag återkommer till dig så snart som möjligt.`;
}

/**
 * Generate multiple reply variations for agent to choose from
 */
export function generateReplyVariations(options: AIReplyOptions): string[] {
  const variations: string[] = [];
  
  // Version 1: Standard (friendly & professional)
  variations.push(generateAIReply({ ...options, tone: "friendly" }));
  
  // Version 2: More professional
  variations.push(generateAIReply({ ...options, tone: "professional" }));
  
  // Version 3: More empathetic (if complaint or sensitive)
  if (options.context.intent === "complaint" || options.context.medicalNotes) {
    variations.push(generateAIReply({ ...options, tone: "empathetic" }));
  }
  
  return variations;
}

/**
 * Mock customer history for testing
 */
export function getMockCustomerHistory(): CustomerHistory {
  return {
    name: "Johan Lagerström",
    isVIP: true,
    totalBookings: 3,
    lastBooking: "2025-01-14",
    preferredTimes: ["Morgon (09:00-11:00)"],
    customerSince: "2023",
  };
}