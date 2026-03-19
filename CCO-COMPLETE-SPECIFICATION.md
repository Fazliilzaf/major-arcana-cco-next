# 📋 CCO - Complete Specification
## Customer Conversation Operations - Fullständig Funktionsspecifikation

**Version:** 2.0  
**Datum:** 2026-03-16  
**Projekt:** HairTP Clinic CRM  
**Typ:** Premium bokningshantering och kundkommunikation  

---

## 📑 INNEHÅLLSFÖRTECKNING

1. [Översikt](#översikt)
2. [CCO Helhetsfunktioner](#cco-helhetsfunktioner)
3. [UI/UX Design Principer](#uiux-design-principer)
4. [Implementerade Funktioner](#implementerade-funktioner)
5. [Teknisk Specifikation](#teknisk-specifikation)
6. [Workflows & Användarscenarion](#workflows--användarscenarion)

---

## 📊 ÖVERSIKT

### Vad är CCO?

**CCO (Customer Conversation Operations)** är ett komplett system för att hantera kundkonversationer med fokus på:

- **Effektivitet**: Minska tid per kundinteraktion
- **Kvalitet**: Säkerställ konsekvent, professionell kommunikation
- **Skalning**: Hantera 200+ mail dagligen utan stress
- **Intelligens**: AI-driven triage, drafting och uppföljning
- **Kontroll**: Du behåller full kontroll över alla beslut

### Kärnprinciper

1. **Progressive Disclosure** - Visa bara vad som är relevant nu
2. **Fail-Closed** - Säkerhet först, automation där det är säkert
3. **Audit Everything** - Full spårbarhet på alla åtgärder
4. **Snabbläge** - Max 3 aktiva beslut samtidigt
5. **SLA-driven** - Aldrig missa en deadline

---

## 🔧 CCO HELHETSFUNKTIONER

### F1. Data-Ingest och "Har jag svarat?"

#### Graph API Integration (76-90)

**76.** CCO ska läsa mail via Microsoft 365 / Exchange Online (Graph)

**77.** CCO ska kunna köras på vald mailbox-allowlist (inte "läcka" andra)
- Konfigurerbar whitelist per tenant
- Ingen access till obehöriga mailboxes

**78.** CCO ska kunna köras i full-tenant mode om ni vill (men med caps + budget)
- Configurable tenant-wide mode
- Budget limits per run
- Resource caps

**79.** CCO ska ha kill switch: Graph Read ON/OFF
- Global toggle för att stänga av läsning
- Emergency shutdown capability

**80.** CCO ska ha separat kill switch: Graph Send ON/OFF
- Oberoende kontroll för sändning
- Fail-safe mechanism

**81.** CCO ska läsa både Inbox och Sent (för att se svar du skickat i Outlook)
- Synkronisering av skickade mail
- Cross-platform reply detection

**82.** "True unanswered" = senaste riktning inbound utan ny outbound
- Smart detection av obesvarade trådar
- Inte förvirras av automatiska replies

**83.** Om du svarar via Outlook ska Arcana upptäcka det nästa run
- Sync Sent folder i samma tidsfönster
- Markera som hanterad automatiskt

**84.** CCO ska logga audit: mailbox.read.start/complete/error per run
```typescript
{
  event: 'mailbox.read.start',
  mailbox: 'info@hairtp.se',
  timestamp: '2026-03-16T10:00:00Z',
  runId: 'run_abc123'
}
```

**85.** Pagination måste loopa @odata.nextLink med loop-guard + page-limit
- Max 100 pages per run
- Loop detection
- Timeout efter 50 nextLink följningar

**86.** Retry/backoff måste hantera 429/5xx/timeout
```typescript
exponentialBackoff({
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  factor: 2
})
```

**87.** Timeout måste finnas per mailbox och per run
- Mailbox timeout: 60s
- Total run timeout: 5 min

**88.** Error budget: ett mailbox-fel får inte krascha hela run
- Continue on error (inom budget)
- Max 10% failure rate

**89.** Idempotency på send måste förhindra dubbelsend
- Message-ID tracking
- Deduplication window: 24h

**90.** Send får bara ske vid beslut allow/allow_flag (fail-closed annars)
- Explicit approval required
- No automatic sending

---

### F2. Triage-Modellen (Inboxen)

#### Smart Beslutsstöd (91-100)

**91.** CCO ska alltid koka ner många mail till tydliga beslut
- Visa actionable items
- Dölj irrelevant information

**92.** CCO ska visa dominantRisk (en huvudsignal) per tråd
```typescript
type DominantRisk = 
  | 'sla_breach'      // Röd - akut
  | 'sla_warning'     // Orange - snart
  | 'high_priority'   // Gul - viktigt
  | 'stagnant'        // Grå - ingen rörelse
  | 'safe'            // Grön - lugnt
```

**93.** CCO ska visa recommendedAction (en konkret rad: vad du ska göra)
```typescript
recommendedAction: {
  text: "Bekräfta bokning",
  confidence: 0.92,
  reason: "Kunden väntar på bekräftelse sedan 3h"
}
```

**94.** CCO ska visa intent + tone + priorityLevel + confidence
```typescript
{
  intent: 'booking_request',
  tone: 'neutral',
  priorityLevel: 'high',
  confidence: 0.87
}
```

**95.** CCO ska visa SLA-status (safe/warning/breach) och återstående tid
```typescript
sla: {
  status: 'warning',
  hoursRemaining: 2.5,
  dueAt: '2026-03-16T18:00:00Z'
}
```

**96.** CCO ska ha lifecycle-status (new/active/returning/dormant)
```typescript
lifecycle: 'returning', // Återkom efter 1 vecka
lastActivity: '2026-03-09T14:30:00Z'
```

**97.** CCO ska visa "Nya sedan sist" (lastSeen) för att minska scanning
- Badge på nya konversationer
- Timestamp på senaste besök

**98.** CCO ska ha Sprint-läge: max 3 aktiva beslut
- Fokusera på det viktigaste
- Dölj resten tills sprint är klar
- Current count: 2/3

**99.** CCO ska ha "Soft Break" om du klickar utanför sprint när sprint är aktiv
```typescript
// Modal visas:
"Du har 2 pågående i sprint. 
Vill du pausa dessa eller avsluta sprint?"
[Pausa] [Avsluta sprint]
```

**100.** CCO ska ha "Selected thread stability": vald tråd ska inte försvinna
- Sticky selection
- Clear warning om filter skulle dölja den

---

### F3. Drafting - AI-Driven Svarsgenerering

#### Smart Reply Generation (101-110)

**101.** CCO ska generera 3 draft modes: kort / varm / professionell

```typescript
drafts: {
  short: {
    mode: 'short',
    wordCount: 30,
    text: "Hej! Din bokning är bekräftad för fredag kl 09:00. Välkommen!"
  },
  warm: {
    mode: 'warm', 
    wordCount: 60,
    text: "Hej Anna! 😊 Vad kul att du vill boka en PRP-behandling hos oss! Din tid är bekräftad för fredag den 21/3 kl 09:00. Vi ser fram emot att träffa dig!"
  },
  professional: {
    mode: 'professional',
    wordCount: 80,
    text: "Hej Anna, Tack för din bokningsförfrågan. Vi bekräftar härmed din bokning för PRP-behandling fredagen den 21 mars kl 09:00. Vänligen meddela oss om du har några frågor. Med vänliga hälsningar, HairTP Clinic"
  }
}
```

**102.** CCO ska välja recommendedMode, men aldrig overridea ditt val
```typescript
recommendedMode: 'warm',
selectedMode: 'professional', // User override
```

**103.** Drafting ska vara context-aware
- Customer intent
- Previous tone
- Priority level
- Tenant tone style (varumärke)

**104.** Drafting ska följa hårda begränsningar
```typescript
constraints: {
  maxWords: 100,
  maxParagraphs: 3,
  requiredElements: ['greeting', 'confirmation', 'closing']
}
```

**105.** Drafting ska undvika förbjudna kategorier (policy floor)
```typescript
forbidden: [
  'medical_advice',
  'pricing_guarantees',
  'off_brand_tone',
  'personal_opinions'
]
```

**106.** Alla drafts ska gå genom outputRisk + policyFloor
```typescript
if (outputRisk > 0.3 || violatesPolicyFloor) {
  return { 
    status: 'blocked',
    reason: 'Risk threshold exceeded'
  }
}
```

**107.** UI ska låta dig toggla mode och se rekommendation tydligt
```
┌─────────────────────────────────────┐
│ 📝 Svarsstudio                      │
├─────────────────────────────────────┤
│ [Kort] [Varm ⭐] [Professionell]    │
│                  ↑                   │
│            Rekommenderad            │
└─────────────────────────────────────┘
```

**108.** UI ska ge knappar för snabbjusteringar
```
[Förkorta] [Varmare] [Mer professionell] [Skarpare]
```

**109.** UI ska ha tydlig "Kopiera svar" och "Markera hanterad"
```
[📋 Kopiera svar]  [✅ Skicka & Markera hanterad]
```

**110.** UI ska ha "Återkom senare" (påminnelse)
```
[⏰ Påminn mig om...]
  ├─ 1 timme
  ├─ 3 timmar
  ├─ Imorgon
  └─ Anpassad tid
```

---

### F4. Writing Identity (Rätt Ton per Mailbox)

#### Personaliserad Kommunikationsstil (111-117)

**111.** CCO ska kunna ha writing profiles per mailbox

```typescript
writingProfiles: {
  'info@hairtp.se': {
    tone: 'professional',
    warmth: 0.5,
    formalityLevel: 0.7,
    signatureStyle: 'full_team'
  },
  'bokning@hairtp.se': {
    tone: 'warm',
    warmth: 0.8,
    formalityLevel: 0.4,
    signatureStyle: 'friendly'
  },
  'anna.svensson@hairtp.se': {
    tone: 'personal',
    warmth: 0.9,
    formalityLevel: 0.3,
    signatureStyle: 'casual'
  }
}
```

**112.** Profile lookup ska använda mailboxAddress/UPN, aldrig GUID-fallback
```typescript
// ✅ CORRECT
const profile = getProfile(mailbox.userPrincipalName);

// ❌ WRONG
const profile = getProfile(mailbox.id); // GUID inte tillåtet
```

**113.** Writing identity ska kunna auto-extraheras från historik (minst v1)
```typescript
// Analysera senaste 50 skickade mail
const historicalStyle = analyzeWritingStyle({
  mailbox: 'info@hairtp.se',
  sentItems: last50Emails,
  extractors: ['tone', 'warmth', 'formality', 'vocabulary']
});
```

**114.** Writing identity ska kunna manuellt justeras i UI (admin override)
```
Settings → Writing Profiles → info@hairtp.se
  Tone: [Professional ▼]
  Warmth: ━━━●━━━━━ (0.5)
  Formality: ━━━━━━●━━ (0.7)
```

**115.** Writing identity får påverka draft och ev. confidence-viktning
- Anpassa drafts efter mailbox-stil
- Inte påverka policy/risk decisions

**116.** All uppdatering av writing profile ska audit-loggas
```typescript
{
  event: 'writing.profile.updated',
  mailbox: 'info@hairtp.se',
  changes: {
    warmth: { from: 0.5, to: 0.7 }
  },
  updatedBy: 'admin@hairtp.se',
  timestamp: '2026-03-16T14:30:00Z'
}
```

**117.** Writing profile ska versionsbumpas vid ändring
```typescript
profile: {
  version: 3,
  lastUpdated: '2026-03-16T14:30:00Z',
  history: [/* previous versions */]
}
```

---

### F5. SLA, Öppettider och Stress-avlastning

#### Smart Deadline Management (118-123)

**118.** SLA ska ta hänsyn till öppettider

```typescript
businessHours: {
  monday: { start: '08:00', end: '20:00' },
  tuesday: { start: '08:00', end: '20:00' },
  wednesday: { start: '08:00', end: '20:00' },
  thursday: { start: '08:00', end: '20:00' },
  friday: { start: '08:00', end: '20:00' },
  saturday: { start: '08:00', end: '18:00' },
  sunday: null // Stängt
}

// Mail inkommer fredag 19:30
// SLA: 24h business hours
// Due: Måndag 17:30 (inte lördag 19:30)
```

**119.** SLA ska visa hoursRemaining och status med begriplig text

```typescript
sla: {
  hoursRemaining: 2.5,
  status: 'warning',
  displayText: '2,5h kvar',
  tooltip: 'Deadline: Idag 18:00'
}
```

**120.** SLA breach ska prioriteras före allt annat i triage
```typescript
// Prioritetsordning:
1. SLA Breach (röd)
2. SLA Warning (orange, <3h)
3. High Priority + Stagnant
4. Normal
```

**121.** SLA warning ska vara tydlig men inte skrikig
```css
/* ❌ BAD: Neon colors */
background: #ff0000;

/* ✅ GOOD: Pastell + text */
background: #fef3c7; /* Amber 100 */
border-left: 3px solid #f59e0b; /* Amber 500 */
```

**122.** Stagnation ska upptäckas (ingen rörelse på X timmar)
```typescript
if (hoursSinceLastActivity > 48 && !hasOutboundReply) {
  stagnationDetected = true;
  recommendedAction = 'followUpSuggested';
}
```

**123.** "FollowUpSuggested" ska vara en tydlig recommendedAction
```typescript
{
  action: 'followUpSuggested',
  reason: 'Ingen rörelse på 48h',
  suggestions: [
    { time: '24h', text: 'Följ upp imorgon' },
    { time: '72h', text: 'Följ upp i slutet av veckan' }
  ]
}
```

---

### F6. Relation och Kundengagemang

#### Customer Warmth & Follow-up (124-128)

**124.** CCO ska visa en enkel "temperature/warmth"-signal

```typescript
type CustomerWarmth = {
  score: number;        // 0.0 - 1.0
  level: 'cold' | 'neutral' | 'warm' | 'hot';
  indicator: string;    // Visual representation
}

// Exempel:
{
  score: 0.75,
  level: 'warm',
  indicator: '🔥🔥🔥○○' // 3/5
}
```

**125.** CCO ska koppla warmth till strategi
```typescript
if (warmth.level === 'hot') {
  strategy = 'soft_followup'; // Kunden är engagerad, lite push
} else if (warmth.level === 'cold') {
  strategy = 'active_chase'; // Behöver mer engagemang
}
```

**126.** CCO ska kunna föreslå 2-3 uppföljningspunkter med manual approve
```typescript
followUpSuggestions: [
  {
    time: '24h',
    message: 'Hej! Har du hunnit fundera på bokningen?',
    autoApprove: false // Kräver manual godkännande
  },
  {
    time: '72h',
    message: 'Vi vill påminna om vårt erbjudande...',
    autoApprove: false
  }
]
```

**127.** Du ska kunna stänga av uppföljningsautomation per kund/tråd
```typescript
thread.followUpAutomation = false; // Manual override
```

**128.** Systemet ska tydligt markera "kunden återkom efter 1 vecka"
```typescript
lifecycle: 'returning',
badge: '↩️ Återkom efter 7 dagar',
warmth: 0.6 // Återaktiverad
```

---

### F7. Skalning: 200+ Mail (Lugnt UX)

#### Progressive Disclosure & Density (129-140)

**129.** Inboxen ska ha Progressive Disclosure
```
┌─────────────────────────────────┐
│ 🔥 Sprint (2)                   │  ← Max 3
├─────────────────────────────────┤
│ 🚨 High/Critical (5)            │  ← Max 7
├─────────────────────────────────┤
│ ⏰ Needs Reply Today (8)        │  ← Max 12
├─────────────────────────────────┤
│ 📦 Rest (185)  [Visa fler ▼]   │  ← Collapsed by default
└─────────────────────────────────┘
```

**130.** "Rest" ska vara kollapsad by default med CTA
```
📦 Rest (185 mail)
[Visa 20 till ▼]
```

**131.** Density modes: Fokus / Arbete / Översikt

```typescript
type DensityMode = 'focus' | 'work' | 'overview';

densitySettings: {
  focus: {
    rowHeight: 80,
    showPreview: false,
    showTags: false,
    maxVisible: 5
  },
  work: {
    rowHeight: 60,
    showPreview: true,
    showTags: true,
    maxVisible: 15
  },
  overview: {
    rowHeight: 40,
    showPreview: false,
    showTags: true,
    maxVisible: 50
  }
}
```

**132.** Aging fade: låg prio + gammalt tonas ned subtilt
```css
/* Inga blur/animations */
.aged-message {
  opacity: 0.6; /* Subtilt */
  transition: opacity 0.2s;
}
.aged-message:hover {
  opacity: 1.0;
}
```

**133.** Dominant risk accent styr raden (sekundär risk diskret)
```typescript
// Dominant risk = primary color
// Secondary risk = small badge
dominantRisk: 'sla_breach',     // Röd border
secondaryRisks: ['stagnant']    // Grå chip
```

**134.** Performance guardrails: lazy/virtual render
```typescript
// Använd @tanstack/react-virtual
const rowVirtualizer = useVirtualizer({
  count: 200,
  estimateSize: () => 60,
  overscan: 5
});
```

**135.** Section headers visar count + risk + CTA
```
🚨 High/Critical (5) • 2 SLA breach
                                [Hantera alla →]
```

**136.** Auto-reorder: om High/Critical är tom → Needs Reply Today blir sektion 2
```typescript
const visibleSections = sections.filter(s => s.count > 0);
```

**137.** Psychology rule: vid 200+ mail → max 15 synliga rader samtidigt
```typescript
if (totalCount > 200) {
  maxVisibleRows = 15;
}
```

**138.** No Cognitive Overflow
```typescript
limits: {
  sprint: 3,
  highCritical: 7,
  needsReply: 12,
  rest: Infinity // but collapsed
}
```

**139.** Overflow indicator: "7 av 11 visas"
```
🚨 High/Critical
Visar 7 av 11    [Visa alla ▼]
```

**140.** Density mode är endast visningslager
- Får ALDRIG ändra prioritering
- Får ALDRIG ändra sortering
- Får ALDRIG ändra urval
- Endast visual presentation

---

### F8. Språk och UI-Polish

#### Swedish-First, Professional Design (141-152)

**141.** All text i CCO ska vara svenska som standard
```typescript
defaultLanguage: 'sv'
```

**142.** Engelska ska vara ett val (språk-toggle)
```
[🇸🇪 Svenska ▼]
  ├─ Svenska
  └─ English
```

**143.** Inga engelska termer ska ligga kvar i UI
```
❌ "Sprint / High / Needs Reply"
✅ "Snabbläge / Kritisk / Kräver svar"
```

**144.** Pastellpalett ska vara konsekvent
```css
/* Mjuka, professionella färger */
--pink-50: #fdf2f8;
--pink-100: #fce7f3;
--pink-500: #ec4899;

--gray-50: #f9fafb;
--gray-100: #f3f4f6;
```

**145.** Mer kontrast via skuggning och block, inte aggressiva färger
```css
/* ✅ GOOD */
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
border: 1px solid #e5e7eb;

/* ❌ BAD */
background: linear-gradient(to right, #ff0000, #00ff00);
```

**146.** Större block i Reply Studio: gruppera fält
```
┌────────────────────────────────┐
│ SVARSLÄGE                      │
│ [Kort] [Varm] [Professionell] │
├────────────────────────────────┤
│ SVAR                           │
│ [Stort textfält här...]        │
├────────────────────────────────┤
│ ÅTGÄRDER                       │
│ [Kopiera] [Skicka]             │
└────────────────────────────────┘
```

**147.** Logga/signatur ska inte "ta över" visuellt
```css
.email-signature {
  opacity: 0.7;
  font-size: 0.85em;
  margin-top: 2rem;
}
```

**148.** "Rekommenderad åtgärd" ska vara klickbar och tooltip-förklarad
```html
<button 
  title="Kunden väntar på bekräftelse sedan 3h"
  onClick={handleRecommendedAction}
>
  💡 Bekräfta bokning
</button>
```

**149.** SLA-komponenter ska ha tydlig legend
```
┌─────────────────┐
│ SLA Status      │
├─────────────────┤
│ 🟢 Safe         │ > 6h kvar
│ 🟡 Warning      │ 1-6h kvar
│ 🔴 Breach       │ Försenad
└─────────────────┘
```

**150.** UI ska ha tydlig sök-ruta
```
🔍 Sök namn, email, nyckelord...
```

**151.** UI ska ha mailbox-väljare
```
📧 Arbetar från:
[info@hairtp.se ▼]
  ├─ info@hairtp.se
  ├─ bokning@hairtp.se
  └─ anna.svensson@hairtp.se
```

**152.** UI ska kunna visa "alla mail per mailbox" i separat vy
```
[Alla mailboxes] [info@hairtp.se] [bokning@hairtp.se]
```

---

### F9. Skräpmail och Lågprioriterade Typer

#### Smart Filtering (153-156)

**153.** CCO ska kunna känna igen "lågvärdigt" mail

```typescript
const lowValueCategories = [
  'order_confirmation',
  'marketing_newsletter',
  'no_reply_automated',
  'social_media_notification',
  'shipping_update',
  'password_reset'
];

if (isLowValue(email)) {
  email.category = 'low_priority';
  email.hideFromSprint = true;
}
```

**154.** Dessa ska inte hamna i Sprint/High/Needs Reply
```
📦 Lågprioritet / Ignorera (23)
[Visa ▼]
```

**155.** Du ska kunna manuellt markera en tråd som "ignorera typ framöver"
```
[Mer ▼]
  └─ ❌ Ignorera liknande mail framöver
```

**156.** Det ska finnas en tydlig "Ångra/Restore" för misstag
```typescript
// Toast notification
toast.info(
  'Mail ignorerat. Ångra?',
  {
    action: {
      label: 'Ångra',
      onClick: () => restoreEmail(emailId)
    },
    duration: 10000 // 10s to undo
  }
);
```

---

### F10. "Radera Mail" - Säker Version

#### Safe Delete Functionality (157-162)

**157.** "Radera" ska i v1 betyda Flytta till papperskorg/Deleted Items
```typescript
// Inte permanent delete
moveToFolder(email, 'deleteditems');
```

**158.** Radera ska kräva explicit bekräftelse
```
┌───────────────────────────────────┐
│ 🗑️ Radera mail?                   │
├───────────────────────────────────┤
│ Detta flyttar mailet till         │
│ papperskorgen. Du kan ångra det   │
│ från papperskorgen inom 30 dagar. │
├───────────────────────────────────┤
│ [Avbryt]            [Radera] ✓    │
└───────────────────────────────────┘
```

**159.** Radera ska vara allowlist-styrt per mailbox + ha kill switch
```typescript
deletePermissions: {
  'info@hairtp.se': true,
  'bokning@hairtp.se': false,
  globalKillSwitch: false
}
```

**160.** Radera ska audit-loggas
```typescript
{
  event: 'email.deleted',
  emailId: 'msg_abc123',
  subject: 'Re: Bokning PRP-behandling',
  from: 'anna@example.com',
  mailbox: 'info@hairtp.se',
  deletedBy: 'admin@hairtp.se',
  timestamp: '2026-03-16T15:00:00Z',
  recoverable: true,
  recoverableUntil: '2026-04-15T15:00:00Z'
}
```

**161.** Radera ska vara idempotent
```typescript
// Dubbelklick får inte radera två gånger
if (email.isDeleted) {
  return { status: 'already_deleted' };
}
```

**162.** Radera ska inte vara default-primärknapp
```html
<!-- ❌ BAD -->
<button className="btn-primary">Radera</button>

<!-- ✅ GOOD -->
<button className="btn-secondary text-red-600">
  🗑️ Radera
</button>
```

---

## 🎨 UI/UX DESIGN PRINCIPER

### Kompakthet & Effektivitet

#### 1. Systemomfattande Kompakthet

**Principen:**
Prioritera vertikal effektivitet för att maximera synlig information.

```css
/* Före komprimering */
.header { height: 80px; }
.message-row { height: 100px; padding: 24px; }

/* Efter komprimering (-30%) */
.header { height: 56px; }
.message-row { height: 70px; padding: 16px; }
```

**Regler:**
- Tätare vertical spacing
- Intelligent horizontal layout
- Gruppera relaterad information
- Minimal dödyta
- Snabb scanning

#### 2. Progressive Disclosure

**Visa bara vad som behövs nu:**

```
Default view (collapsed):
┌────────────────────────────┐
│ PRP-behandling             │
│ Bekräftad · Fredag 09:00   │
└────────────────────────────┘

Expanded view (on demand):
┌────────────────────────────┐
│ PRP-behandling             │
│ Bekräftad · Fredag 09:00   │
├────────────────────────────┤
│ Pris: 2,500 kr            │
│ Kund: Anna Svensson       │
│ Email: anna@example.com   │
│ Tel: 070-123 45 67        │
│                            │
│ [Ändra tid] [Avboka]      │
└────────────────────────────┘
```

#### 3. Svarsstudio - On Demand

**Före:**
```
Permanent reply studio tar 300px i höjd
↓
Mindre plats för konversation
```

**Efter:**
```
[📝 Öppna Svarstudio] knapp (40px)
↓
Click → Drawer/Modal öppnas (full workspace)
```

#### 4. Writing Surface Prioritering

```
┌─────────────────────────────────────┐
│ Skriv ditt svar här...              │
│                                     │
│                                     │  ← Stort textfält
│                                     │
│                                     │
├─────────────────────────────────────┤
│ [B] [I] [U] ... (små ikoner)        │  ← Kompakta verktyg
├─────────────────────────────────────┤
│              [Skicka →]             │  ← Under, inte bredvid
└─────────────────────────────────────┘
```

---

## 🔨 IMPLEMENTERADE FUNKTIONER

### Aktuell Implementation (HairTP Clinic CRM)

#### ✅ Kärnfunktionalitet

1. **Inbox Management**
   - Progressive message list
   - SLA badges (safe/warning/breach)
   - Sprint mode (max 3)
   - Density modes (Focus/Work/Overview)

2. **Conversation View**
   - Reversed chronology (nyaste först)
   - Compact booking cards
   - Customer intelligence sidebar
   - Collision warnings

3. **Response Studio**
   - 3 draft modes (Kort/Varm/Professionell)
   - AI-generated suggestions
   - Template library
   - Email signatures

4. **Customer Intelligence**
   - Identity resolution
   - Journey timeline
   - Engagement indicators
   - Lifecycle status

5. **Workflow Automation**
   - Canvas-based builder
   - Drag & drop nodes
   - AI suggestions
   - Testing & versions

6. **Smart Features**
   - Snooze/Later functionality
   - Safe delete with undo
   - Bulk operations
   - Keyboard shortcuts

#### ✅ Advanced Features (Nyligen Tillagda)

7. **Dark Mode**
   - Light/Dark/System themes
   - Smooth transitions
   - Persistent storage

8. **PWA Support**
   - Installationsbar app
   - Offline funktionalitet
   - Service Worker caching

9. **Performance**
   - Virtual scrolling
   - Lazy loading
   - Code splitting

10. **Accessibility**
    - WCAG 2.1 AA compliance
    - Keyboard navigation
    - Screen reader support

---

## 💻 TEKNISK SPECIFIKATION

### Tech Stack

```typescript
{
  framework: 'React 18.3.1',
  routing: 'React Router 7.13.0',
  styling: 'Tailwind CSS 4.1.12',
  animations: 'Motion 12.23.24',
  state: 'Context API',
  forms: 'React Hook Form 7.55.0',
  ui: 'Radix UI',
  charts: 'Recharts 2.15.2',
  icons: 'Lucide React 0.487.0',
  notifications: 'Sonner 2.0.3',
  virtualization: '@tanstack/react-virtual 3.13.22',
  testing: 'Vitest 4.1.0 + Testing Library',
  build: 'Vite 6.3.5'
}
```

### Project Structure

```
/src
  /app
    /components       # UI komponenter
      /ui            # Radix UI wrappers
      /workflow      # Workflow builder
    /context         # React Context providers
    /hooks           # Custom hooks
    /layouts         # Layout komponenter
    /pages           # Route pages
    /utils           # Utility functions
    /data            # Mock data
  /styles
    fonts.css        # Font imports
    globals.css      # Global styles
    theme.css        # Theme variables
    tailwind.css     # Tailwind base
  /imports           # Figma assets
```

### API Integration (Planerad)

```typescript
// Microsoft Graph API
interface GraphConfig {
  clientId: string;
  tenantId: string;
  scopes: [
    'Mail.Read',
    'Mail.Send',
    'Mail.ReadWrite',
    'User.Read'
  ];
}

// Mailbox operations
async function readMailbox(mailbox: string) {
  const messages = await graphClient
    .api(`/users/${mailbox}/messages`)
    .select('subject,from,receivedDateTime,body')
    .top(50)
    .get();
  
  return messages;
}
```

### Database Schema (Planerad)

```sql
-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  thread_id VARCHAR(255) UNIQUE,
  subject TEXT,
  customer_id UUID REFERENCES customers(id),
  mailbox VARCHAR(255),
  status VARCHAR(50), -- new, active, snoozed, done
  priority VARCHAR(50), -- sprint, high, normal, low
  sla_due_at TIMESTAMP,
  sla_status VARCHAR(50), -- safe, warning, breach
  lifecycle VARCHAR(50), -- new, active, returning, dormant
  warmth_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  graph_message_id VARCHAR(255) UNIQUE,
  direction VARCHAR(10), -- inbound, outbound
  from_address VARCHAR(255),
  to_address VARCHAR(255),
  subject TEXT,
  body TEXT,
  received_at TIMESTAMP,
  intent VARCHAR(100),
  tone VARCHAR(50),
  confidence DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Drafts
CREATE TABLE drafts (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  mode VARCHAR(50), -- short, warm, professional
  content TEXT,
  recommended BOOLEAN,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  event_type VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id UUID,
  user_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📖 WORKFLOWS & ANVÄNDARSCENARION

### Scenario 1: Hantera 200+ Mail på Morgonen

**Användare:** Kundtjänstmedarbetare på HairTP Clinic  
**Kontext:** Måndag morgon, 200+ nya mail över helgen

**Workflow:**

1. **Öppna applikationen**
   - Sprint-läge aktivt (default)
   - Ser 3 mest kritiska mail

2. **Sprint Section (3 mail)**
   ```
   🔥 Sprint (3)
   ├─ SLA Breach - Anna (Bokning bekräftelse)
   ├─ SLA Warning - Erik (Fråga om behandling)
   └─ High Priority - Lisa (Avbokning)
   ```

3. **Hantera första mailet (Anna)**
   - Klicka → Conversation öppnas
   - AI visar: "💡 Rekommenderad åtgärd: Bekräfta bokning"
   - Klicka "Öppna Svarstudio"
   - Välj "Varm" draft (rekommenderad)
   - Läs igenom, justera om behövs
   - Klicka "Skicka & Markera hanterad"
   - **Tid:** 45 sekunder

4. **Hantera andra mailet (Erik)**
   - Similar process
   - **Tid:** 60 sekunder

5. **Hantera tredje mailet (Lisa)**
   - Avbokning kräver mer reflektion
   - Klicka "Återkom senare → 1 timme"
   - Mail flyttas till "Senare"
   - **Tid:** 15 sekunder

6. **Sprint klar**
   - System visar: "Sprint klar! 🎉"
   - Laddar nästa 3 mail automatiskt

7. **Efter 30 min:**
   - 18 mail hanterade (3 per sprint × 6 sprints)
   - Inga SLA breaches kvar
   - Stress-nivå: Låg
   - Fokuserad, inte överväldigad

### Scenario 2: Upptäcka Glömd Kund

**Användare:** Bokningsansvarig  
**Kontext:** Kund som inte fått svar på 48h

**Workflow:**

1. **System Detection**
   ```typescript
   // Stagnation upptäckt
   {
     customer: 'Maria Johansson',
     lastInbound: '2026-03-14T09:00:00Z',
     hoursSinceLastActivity: 52,
     stagnationDetected: true
   }
   ```

2. **Inbox Notification**
   ```
   ⚠️ Stagnation Detected (1)
   └─ Maria - Ingen rörelse på 52h
      💡 Föreslå uppföljning
   ```

3. **Öppna Konversation**
   - Ser conversation history
   - Maria frågade om PRP-behandling
   - Ingen har svarat

4. **AI Suggestion**
   ```
   💡 Rekommenderad åtgärd: Följ upp med mjuk påminnelse
   
   Suggested draft (Varm):
   "Hej Maria! Tack för din förfrågan om PRP-behandling.
   Har du hunnit fundera på om du vill boka en tid? 
   Vi har lediga tider nästa vecka! 😊"
   ```

5. **Skicka Uppföljning**
   - Använd suggested draft
   - Markera: "Uppföljning skickad"
   - **Resultat:** Ingen kund glöms bort

### Scenario 3: Mailbox Identity Management

**Användare:** Admin  
**Kontext:** Sätta upp olika toner för olika mailboxes

**Workflow:**

1. **Settings → Writing Profiles**
   ```
   📧 Mailboxes:
   ├─ info@hairtp.se
   ├─ bokning@hairtp.se
   └─ anna.svensson@hairtp.se
   ```

2. **Konfigurera info@hairtp.se**
   ```
   Tone: Professional
   Warmth: ━━━●━━━━━ (0.5)
   Formality: ━━━━━━●━━ (0.7)
   
   Exempel:
   "Hej, 
   Tack för din förfrågan om behandling.
   Vi återkommer inom 24 timmar.
   
   Med vänliga hälsningar,
   HairTP Clinic"
   ```

3. **Konfigurera bokning@hairtp.se**
   ```
   Tone: Warm
   Warmth: ━━━━━━━●━ (0.8)
   Formality: ━━━●━━━━━ (0.4)
   
   Exempel:
   "Hej! 😊
   Vad kul att du vill boka hos oss!
   Din bokning är bekräftad.
   Vi ser fram emot att träffa dig!
   
   Varma hälsningar,
   Anna på HairTP"
   ```

4. **Auto-Apply**
   - När användare svarar från info@ → Professional drafts
   - När användare svarar från bokning@ → Warm drafts
   - Konsistent brand voice per kanal

---

## 📋 CHECKLISTA FÖR IMPLEMENTATION

### Phase 1: Core CCO (✅ Klart)
- [x] Inbox med Progressive Disclosure
- [x] SLA management
- [x] Sprint mode (max 3)
- [x] Density modes
- [x] Response Studio med AI drafts
- [x] Customer Intelligence
- [x] Safe delete

### Phase 2: Advanced Features (✅ Klart)
- [x] Dark mode
- [x] PWA support
- [x] Offline functionality
- [x] Performance optimization
- [x] Accessibility (WCAG AA)
- [x] Animations & transitions

### Phase 3: Integration (🚧 Planerat)
- [ ] Microsoft Graph API integration
- [ ] Mailbox read/write
- [ ] Real-time sync
- [ ] Send functionality
- [ ] Database persistence
- [ ] Audit logging

### Phase 4: Intelligence (🚧 Planerat)
- [ ] Writing Profile extraction
- [ ] Customer warmth scoring
- [ ] Stagnation detection
- [ ] Auto-categorization
- [ ] Smart follow-up suggestions

### Phase 5: Enterprise (🚧 Planerat)
- [ ] Multi-tenant support
- [ ] Role-based access control
- [ ] Advanced analytics
- [ ] Workflow automation
- [ ] Integration marketplace

---

## 📖 APPENDIX

### A. Terminology

```typescript
// Svenska termer (primära)
const terminology = {
  sprint: 'Snabbläge',
  high: 'Kritisk',
  needsReply: 'Kräver svar',
  safe: 'Säker',
  warning: 'Varning',
  breach: 'Försening',
  stagnant: 'Ingen rörelse',
  followUp: 'Uppföljning',
  snooze: 'Senare',
  draft: 'Utkast',
  warmth: 'Engagemang',
  lifecycle: 'Livscykel'
};
```

### B. Color Palette

```css
/* Primary - Pink/Rose */
--pink-50: #fdf2f8;
--pink-100: #fce7f3;
--pink-500: #ec4899;
--pink-600: #db2777;
--rose-500: #f43f5e;

/* Neutral - Grays */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;

/* Status Colors */
--green-500: #10b981;  /* SLA Safe */
--amber-500: #f59e0b;  /* SLA Warning */
--red-500: #ef4444;    /* SLA Breach */
```

### C. Keyboard Shortcuts

```typescript
const shortcuts = {
  'cmd+k': 'Open Command Palette',
  'cmd+/': 'Toggle Shortcuts Help',
  'j': 'Next conversation',
  'k': 'Previous conversation',
  'r': 'Open Response Studio',
  'e': 'Archive',
  's': 'Snooze',
  'shift+s': 'Sprint mode toggle',
  'esc': 'Close modal/drawer',
  '?': 'Show help'
};
```

---

## 📝 SLUTSATS

Denna specifikation beskriver ett **komplett CCO-system** för:

✅ **Skalbar kundkommunikation** (200+ mail/dag)  
✅ **AI-driven effektivitet** (draft generation, triage)  
✅ **Stress-reduktion** (Sprint mode, Progressive Disclosure)  
✅ **Professionell kvalitet** (Writing Profiles, SLA management)  
✅ **Full kontroll** (Manual approval, Audit logging)  

**Status HairTP Clinic CRM:**
- Phase 1-2: ✅ Implementerat
- Phase 3-5: 🚧 Planerat

**Nästa Steg:**
1. Microsoft Graph API integration
2. Database persistence
3. Production deployment

---

**Dokumentversion:** 2.0  
**Senast uppdaterad:** 2026-03-16  
**Författare:** CCO Team  
**Kontakt:** info@hairtp.se  

---

*Denna specifikation är ett levande dokument och uppdateras kontinuerligt när nya funktioner implementeras.*
