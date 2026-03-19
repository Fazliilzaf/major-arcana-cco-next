import { useState } from "react";
import { X, FileText, Tag, Eye, Lock, Users, Sparkles, AlertCircle, Calendar, Heart, CreditCard, MessageSquare, User, Activity, TrendingUp, Clock, CheckCircle, ArrowRight, Brain } from "lucide-react";
import { toast } from "sonner";

interface NotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
  conversationContext?: string;
  onSave?: (note: NoteData) => void;
}

export interface NoteData {
  category: string;
  content: string;
  tags: string[];
  priority: "low" | "medium" | "high";
  visibility: "public" | "private" | "team";
  autoLinkedTo: {
    conversations?: string[];
    bookings?: string[];
    treatments?: string[];
    customers?: string[];
    teamMembers?: string[];
  };
  timestamp?: string;
  id?: string;
}

// Helper functions for localStorage persistence
const NOTES_STORAGE_KEY = 'hairtp_customer_notes';

export const saveNoteToStorage = (note: NoteData) => {
  try {
    const existingNotes = getAllNotesFromStorage();
    const noteWithMeta = {
      ...note,
      id: note.id || `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: note.timestamp || new Date().toISOString(),
    };
    existingNotes.push(noteWithMeta);
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(existingNotes));
    return noteWithMeta;
  } catch (error) {
    console.error('Failed to save note to localStorage:', error);
    return null;
  }
};

export const getAllNotesFromStorage = (): NoteData[] => {
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load notes from localStorage:', error);
    return [];
  }
};

export const getNotesByCustomer = (customerName: string): NoteData[] => {
  const allNotes = getAllNotesFromStorage();
  return allNotes.filter(note => 
    note.autoLinkedTo?.customers?.includes(customerName)
  );
};

export const getNotesByConversation = (conversationId: string): NoteData[] => {
  const allNotes = getAllNotesFromStorage();
  return allNotes.filter(note => 
    note.autoLinkedTo?.conversations?.includes(conversationId)
  );
};

// Enhanced intelligent note suggestions with category-specific context
const getSmartContextForCategory = (category: string) => {
  const contexts: Record<string, any> = {
    kundprofil: {
      icon: "👤",
      autoFetched: [
        { label: "VIP Status", value: "VIP-kund sedan 2024-01-15", source: "Kundprofil" },
        { label: "Engagement Score", value: "87% (Mycket hög)", source: "Beteendeanalys" },
        { label: "Lifetime Value", value: "142,500 kr", source: "Ekonomisystem" },
        { label: "Kommunikationspref.", value: "E-post föredraget, svar inom 2h", source: "Historik" },
      ],
      suggestedContent: "VIP-kund med högt engagemang. Föredrar snabb e-postkommunikation. Total investering i klinik: 142,500 kr över 8 behandlingar.",
      suggestedTags: ["vip", "högt-engagemang", "premium-kund"],
      linkedTo: { customers: ["Anna Karlsson"] },
      saveLocation: "Permanent kundprofil • Synlig i alla framtida interaktioner",
    },
    konversation: {
      icon: "💬",
      autoFetched: [
        { label: "Konversation ID", value: "#CONV-2847", source: "Nuvarande tråd" },
        { label: "Sentiment", value: "Positiv (92%)", source: "Sentimentanalys" },
        { label: "Intent", value: "Ombokning + Uppföljning", source: "Intent Detection" },
        { label: "Response Time", value: "Svarade inom 45 min", source: "SLA-system" },
      ],
      suggestedContent: "Kunden önskar ombokning av PRP 2/3 behandling. Föredrar fredagar 09:00-12:00 med Dr. Eriksson. Mycket nöjd med senaste behandlingen.",
      suggestedTags: ["ombokning", "prp-serie", "nöjd-kund"],
      linkedTo: { conversations: ["#CONV-2847"], teamMembers: ["Dr. Eriksson"] },
      saveLocation: "Konversationstråd • Synlig när denna konversation öppnas",
    },
    medicinsk: {
      icon: "🏥",
      autoFetched: [
        { label: "Aktiv behandling", value: "PRP Håravfall - Session 1/3 genomförd", source: "Behandlingssystem" },
        { label: "Senaste behandling", value: "2025-02-28 med Dr. Eriksson", source: "Medicinsk journal" },
        { label: "Allergier", value: "Inga kända allergier", source: "Hälsoformulär" },
        { label: "Compliance", value: "95% (Följer rekommendationer)", source: "Behandlingsuppföljning" },
      ],
      suggestedContent: "⚕️ PRP Håravfall - Session 1/3 genomförd 2025-02-28. Patient följer eftervårdsinstruktioner väl. Inga biverkningar rapporterade. Nästa session planerad vecka 12.",
      suggestedTags: ["prp-behandling", "håravfall", "pågående-serie"],
      linkedTo: { treatments: ["PRP-Serie-2025-02"], customers: ["Anna Karlsson"], teamMembers: ["Dr. Eriksson"] },
      saveLocation: "Medicinsk journal • GDPR-skyddad • Endast behörig personal",
    },
    betalning: {
      icon: "💰",
      autoFetched: [
        { label: "Outstanding Balance", value: "0 kr (Allt betalt)", source: "Ekonomisystem" },
        { label: "Betalningshistorik", value: "100% i tid (8/8 betalningar)", source: "Fakturahistorik" },
        { label: "Aktiv betalningsplan", value: "PRP-paket 3x25,000 kr", source: "Avtal" },
        { label: "Payment Method", value: "Kort slutar på 4523", source: "Betalningsmetoder" },
      ],
      suggestedContent: "💳 Betalningsplan för PRP-serie (3x25,000 kr). Första betalningen mottagen 2025-02-28. Nästa faktura skickas efter session 2/3.",
      suggestedTags: ["betalningsplan", "prp-paket", "klarna"],
      linkedTo: { bookings: ["Booking-2025-02-28"], customers: ["Anna Karlsson"] },
      saveLocation: "Ekonomisystem • Synlig i faktura & bokföring",
    },
    sla: {
      icon: "🚨",
      autoFetched: [
        { label: "SLA Status", value: "✅ Within SLA (2h 15min kvar)", source: "SLA-system" },
        { label: "Priority Score", value: "Medel (VIP = Auto-Hög)", source: "Smart scoring" },
        { label: "Escalation Risk", value: "Låg (15% risk)", source: "Prediktiv analys" },
        { label: "Response History", value: "Genomsnitt 1h 23min", source: "Historisk data" },
      ],
      suggestedContent: "🚨 VIP-kund behöver ombokning inom 24h. Eskalera till Dr. Eriksson om ej löst inom 2h. Kundens SLA-förväntan: Svar inom 1h.",
      suggestedTags: ["urgent", "vip-prioritet", "ombokning"],
      linkedTo: { conversations: ["#CONV-2847"], teamMembers: ["Dr. Eriksson", "Sarah - Reception"] },
      saveLocation: "SLA-system • Skapar automatisk uppföljning & notifikation",
    },
    intern: {
      icon: "🔒",
      autoFetched: [
        { label: "Team Context", value: "Sarah hanterar, Dr. Eriksson cc:ad", source: "Team-system" },
        { label: "Internal Notes", value: "3 tidigare interna noter", source: "Internloggen" },
        { label: "Customer History", value: "Aldrig klagomål, alltid positiv", source: "Feedback-system" },
        { label: "Special Requests", value: "Föredrar rum 3 (lugnast)", source: "Preferenser" },
      ],
      suggestedContent: "🔒 INTERNT: Kunden föredrar rum 3 (lugnare miljö). Erbjud alltid kaffe vid ankomst. Dr. Eriksson har bäst relation - prioritera vid ombokning.",
      suggestedTags: ["intern-info", "preferenser", "team-only"],
      linkedTo: { customers: ["Anna Karlsson"], teamMembers: ["Sarah - Reception", "Dr. Eriksson"] },
      saveLocation: "Intern databas • ENDAST synlig för teamet • Ej kund",
    },
    uppfoljning: {
      icon: "📅",
      autoFetched: [
        { label: "Nästa behandling", value: "PRP 2/3 - Vecka 12 (Mars 19-25)", source: "Behandlingsschema" },
        { label: "Auto-reminder", value: "SMS skickas 48h innan", source: "Notifikationssystem" },
        { label: "Föreslagen tid", value: "Fredag 09:00 med Dr. Eriksson", source: "Smart schemaläggning" },
        { label: "Follow-up trigger", value: "Ring om ej bokat inom 5 dagar", source: "Retention-system" },
      ],
      suggestedContent: "📅 Uppföljning: Kontakta kunden vecka 11 för att boka PRP 2/3. Föreslå fredag 09:00-12:00 med Dr. Eriksson. SMS-reminder aktiveras vid bokning.",
      suggestedTags: ["uppföljning", "prp-2/3", "schemaläggning"],
      linkedTo: { bookings: ["Future-Booking-PRP-2"], customers: ["Anna Karlsson"], teamMembers: ["Sarah - Reception"] },
      saveLocation: "Uppföljnings-queue • Skapar automatisk påminnelse i CRM",
    },
  };

  return contexts[category] || contexts.konversation;
};

// Note categories mapped to CCO locations
const NOTE_CATEGORIES = [
  { value: "kundprofil", label: "Kundprofil", icon: "👤", description: "Allmänna kundnoter" },
  { value: "konversation", label: "Konversation", icon: "💬", description: "Specifikt för detta samtal" },
  { value: "medicinsk", label: "Medicinsk", icon: "🏥", description: "Behandling & hälsa" },
  { value: "betalning", label: "Betalning", icon: "💰", description: "Ekonomi & faktura" },
  { value: "sla", label: "SLA/Eskalering", icon: "🚨", description: "Urgent uppföljning" },
  { value: "intern", label: "Intern", icon: "🔒", description: "Bara för teamet" },
  { value: "uppfoljning", label: "Uppföljning", icon: "📅", description: "Framtida actions" },
];

// Quick templates
const QUICK_TEMPLATES = [
  { label: "Ombokning begärd", content: "Kunden önskar ombokning från [datum]. Föredrar [tidsönskemål]." },
  { label: "Allergier/Kontraindikationer", content: "⚠️ Allergier: [specificera]. Kontraindikationer: [specificera]." },
  { label: "Betalningsplan", content: "Överenskommelse: [detaljer]. Nästa betalning: [datum]." },
  { label: "Följ upp efter behandling", content: "Kontakta kunden [datum] för att följa upp behandlingsresultat." },
  { label: "VIP-special request", content: "VIP-önskemål: [detaljer]. Prioritera vid bokning." },
  { label: "Klagomål/Problem", content: "🚨 Problem rapporterat: [beskrivning]. Action: [åtgärd]." },
];

export function NotesDialog({
  isOpen,
  onClose,
  customerName = "Anna Karlsson",
  conversationContext,
  onSave,
}: NotesDialogProps) {
  const [category, setCategory] = useState("konversation");
  const smartContext = getSmartContextForCategory(category);
  
  const [content, setContent] = useState(smartContext.suggestedContent);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [visibility, setVisibility] = useState<"public" | "private" | "team">("team");
  const [tags, setTags] = useState<string[]>(smartContext.suggestedTags);
  const [newTag, setNewTag] = useState("");

  console.log("📝 NotesDialog render - isOpen:", isOpen);

  if (!isOpen) return null;

  // Update content when category changes
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const newContext = getSmartContextForCategory(newCategory);
    setContent(newContext.suggestedContent);
    setTags(newContext.suggestedTags);
  };

  const handleSaveNote = () => {
    if (!content.trim()) {
      toast.error("Anteckningen kan inte vara tom");
      return;
    }

    const noteData: NoteData = {
      category,
      content,
      tags,
      priority,
      visibility,
      autoLinkedTo: smartContext.linkedTo,
    };

    const savedNote = saveNoteToStorage(noteData);
    if (savedNote) {
      onSave?.(savedNote);
    }
    
    const categoryLabel = NOTE_CATEGORIES.find(c => c.value === category)?.label || category;
    toast.success(`✅ Anteckning sparad i ${categoryLabel}`, {
      description: smartContext.saveLocation,
    });
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleApplyTemplate = (templateContent: string) => {
    setContent(templateContent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
            <h3 className="text-[11px] font-bold text-gray-900 dark:text-gray-100">
              Smart Anteckning • Intelligensassisterad
            </h3>
            <span className="text-[9px] text-gray-500 dark:text-gray-400">• {customerName}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-3 p-3">
            
            {/* LEFT COLUMN: Category Selection */}
            <div className="space-y-2">
              <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block">
                Var ska anteckningen sparas?
              </label>
              <div className="space-y-1.5">
                {NOTE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`w-full flex items-start gap-1.5 p-2 rounded border-2 text-left transition-all ${
                      category === cat.value
                        ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-950/30 shadow-sm ring-2 ring-purple-200 dark:ring-purple-800"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600"
                    }`}
                  >
                    <span className="text-base leading-none">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-bold leading-tight ${
                        category === cat.value ? "text-purple-700 dark:text-purple-300" : "text-gray-900 dark:text-gray-100"
                      }`}>
                        {cat.label}
                      </p>
                      <p className="text-[8px] text-gray-600 dark:text-gray-400 leading-tight">{cat.description}</p>
                    </div>
                    {category === cat.value && (
                      <CheckCircle className="h-3 w-3 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Live Preview Box */}
              <div className="mt-3 rounded-lg border-2 border-pink-200 dark:border-pink-700 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 p-2">
                <h4 className="text-[8px] font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Eye className="h-2.5 w-2.5" />
                  Live Preview
                </h4>
                <p className="text-[9px] text-pink-900 dark:text-pink-100 leading-tight">
                  {smartContext.saveLocation}
                </p>
              </div>
            </div>

            {/* MIDDLE COLUMN: Auto-Fetched Context */}
            <div className="space-y-2">
              <label className="text-[8px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" />
                Auto-hämtad data från system
              </label>
              
              <div className="space-y-1.5">
                {smartContext.autoFetched.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded border border-blue-200 dark:border-blue-700 p-2"
                  >
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <span className="text-[8px] font-bold text-blue-900 dark:text-blue-100">{item.label}</span>
                      <span className="text-[7px] text-blue-600 dark:text-blue-400 font-medium px-1 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded">
                        {item.source}
                      </span>
                    </div>
                    <p className="text-[9px] text-blue-800 dark:text-blue-200 font-medium">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Auto-Linking Preview */}
              <div className="mt-2 rounded-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-950/20 p-2">
                <h4 className="text-[8px] font-bold text-green-700 dark:text-green-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <ArrowRight className="h-2.5 w-2.5" />
                  Auto-kopplas till
                </h4>
                <div className="space-y-0.5">
                  {smartContext.linkedTo.conversations && (
                    <div className="text-[9px] text-green-800 dark:text-green-200">
                      💬 {smartContext.linkedTo.conversations.join(", ")}
                    </div>
                  )}
                  {smartContext.linkedTo.bookings && (
                    <div className="text-[9px] text-green-800 dark:text-green-200">
                      📅 {smartContext.linkedTo.bookings.join(", ")}
                    </div>
                  )}
                  {smartContext.linkedTo.treatments && (
                    <div className="text-[9px] text-green-800 dark:text-green-200">
                      🏥 {smartContext.linkedTo.treatments.join(", ")}
                    </div>
                  )}
                  {smartContext.linkedTo.customers && (
                    <div className="text-[9px] text-green-800 dark:text-green-200">
                      👤 {smartContext.linkedTo.customers.join(", ")}
                    </div>
                  )}
                  {smartContext.linkedTo.teamMembers && (
                    <div className="text-[9px] text-green-800 dark:text-green-200">
                      👥 {smartContext.linkedTo.teamMembers.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Content & Settings */}
            <div className="space-y-2">
              {/* Quick Templates */}
              <div>
                <label className="text-[8px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block mb-1">
                  Snabbmallar
                </label>
                <div className="flex flex-wrap gap-1">
                  {QUICK_TEMPLATES.slice(0, 3).map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyTemplate(template.content)}
                      className="px-2 py-1 text-[8px] font-medium bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 rounded border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block mb-0.5">
                  <FileText className="h-2.5 w-2.5 inline mr-0.5" />
                  Anteckning
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Skriv din anteckning här..."
                  rows={6}
                  className="w-full px-2 py-1.5 text-[10px] border-2 border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="text-[7px] text-purple-600 dark:text-purple-400 mt-0.5 font-semibold">
                  Auto-genererat • {content.length} tecken
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block mb-0.5">
                  <Tag className="h-2.5 w-2.5 inline mr-0.5" />
                  Taggar
                </label>
                <div className="flex flex-wrap gap-1 mb-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-[9px] font-medium border border-purple-200 dark:border-purple-700"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-purple-900 dark:hover:text-purple-100"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    placeholder="Lägg till tagg..."
                    className="flex-1 px-2 py-1 text-[9px] border-2 border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-2 py-1 text-[9px] font-bold text-white bg-purple-500 hover:bg-purple-600 rounded transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Priority & Visibility */}
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block mb-0.5">
                    Prioritet
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                    className="w-full px-2 py-1 text-[9px] border-2 border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">🟢 Låg</option>
                    <option value="medium">🟡 Medel</option>
                    <option value="high">🔴 Hög</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide block mb-0.5">
                    Synlighet
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as "public" | "private" | "team")}
                    className="w-full px-2 py-1 text-[9px] border-2 border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="public">👁️ Publik</option>
                    <option value="team">👥 Team</option>
                    <option value="private">🔒 Privat</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-[8px] text-gray-600 dark:text-gray-400">
            Sparas i: <span className="font-bold text-pink-600 dark:text-pink-400">
              {NOTE_CATEGORIES.find(c => c.value === category)?.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-[10px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleSaveNote}
              className="px-3 py-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded shadow-sm hover:shadow transition-all"
            >
              Spara anteckning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}