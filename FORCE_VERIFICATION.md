# 🔥 TVINGANDE VERIFIERINGSCHECKLISTA - DUBBELKOLLA ALLT
## CCO Applikation - BEVISA att du har byggt det vi specificerade

---

## ⚠️ INSTRUKTIONER TILL CODEX

Du MÅSTE gå igenom denna checklista och för VARJE punkt:

1. **ÖPPNA filen** med `read` tool
2. **HITTA exakt kod** som bevisar funktionen finns
3. **KOPIERA radnummer och kod-snippet** som bevis
4. **FÖRKLARA** hur det fungerar
5. Svara **ENDAST** med:
   - ✅ **VERIFIERAD** - Filnamn, rad X-Y, kod-snippet
   - ⚠️ **DELVIS** - Vad finns, vad saknas, exakt rad
   - ❌ **SAKNAS** - Erkänn ärligt, ingen kod hittad

**INGEN GISSNING. INGEN "borde fungera". VISA MIG KODEN.**

---

## 🎯 SEKTION 1: LOGOTYPER & BRANDING

### 1.1 CCO-Logotyp i Header
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/header.tsx`
- **PÅ EXAKT VILKEN RAD** importeras CCO-logotypen?
- **KOPIERA** den exakta import-raden här
- **KOPIERA** den exakta JSX-raden där logotypen renderas
- **VAD ÄR** den exakta höjden? (Måste vara `h-[53px]`)
- Är höjden låst med brackets `[53px]` eller dynamisk med `-9` eller `-10`?

**BEVISKRAV:**
```
Rad ___: import ___
Rad ___: <img className="h-[___]" />
```

### 1.2 Animerad Logotyp-komponent
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/animated-signature-logo.tsx`
- **FINNS FILEN?** Om ja, kopiera rad 1-20
- **VILKEN ANIMATION** används? (keyframes namn)
- **ÄR DET EN LOOP?** Hitta `animation-iteration-count` eller `infinite`
- **KOPIERA** den exakta CSS/Tailwind-klassen för animation

**BEVISKRAV:**
```
Filnamn: ___
Rad ___: Animation definition
Loop: [ ] Ja [ ] Nej - Bevis: ___
```

### 1.3 Email-signatur Logo Upload
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/signature-editor-modal.tsx`
- **FINNS DET EN FILE INPUT?** Kopiera rad och kod
- **VILKA FILTYPER** accepteras? (Måste inkludera .png, .jpg, .svg)
- **VAD HÄNDER** när användaren laddar upp? Kopiera event handler-funktionen
- **ANVÄNDS EMOJI** i upload-knappen? Om ja, ÄR DET FEL (ska vara neutral ikon)

**BEVISKRAV:**
```
Rad ___: <input type="file" accept="___" />
Rad ___: Upload handler-funktion
Emoji används: [ ] Ja (FEL) [ ] Nej (BRA)
```

---

## 🚀 SEKTION 2: SNABBLÄGE (SPRINT MODE)

### 2.1 Sprint Mode Toggle
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/header.tsx`
- **FINNS DET EN `sprintMode` STATE?** Rad nummer?
- **KOPIERA** hela useState-raden
- **KOPIERA** toggle-funktionen (`toggleSprintMode`)
- **KOPIERA** knappen som visar Sprint Mode

**BEVISKRAV:**
```
Rad ___: const [sprintMode, setSprintMode] = useState(___)
Rad ___-___: toggleSprintMode function
Rad ___: <button> för Sprint Mode
```

### 2.2 Sprint Mode Räknare
❓ **TVINGANDE FRÅGA:**
- I samma fil, **FINNS `sprintCount` STATE?**
- **VISAR KNAPPEN** räknaren? Sök efter `{sprintCount}` i JSX
- **VAD ÄR MAX-VÄRDET?** (Ska vara 3)
- **KOPIERA** JSX där räknaren visas

**BEVISKRAV:**
```
Rad ___: const [sprintCount, ___] = useState(___)
Rad ___: Räknare visas i JSX: {___}
Max värde: ___
```

### 2.3 Sprint Mode Visuell Stil
❓ **TVINGANDE FRÅGA:**
- **VILKEN FÄRG** har Sprint Mode när AKTIV? (Måste vara grön/emerald/teal)
- **KOPIERA** den exakta className för aktiv state
- **FINNS DET EN GRADIENT?** från vilken färg till vilken?
- **FINNS DET EN ZAP-IKON?** (`<Zap />`)

**BEVISKRAV:**
```
Rad ___: className när aktiv: "___"
Gradient: from-___ to-___
Zap-ikon: [ ] Ja rad ___ [ ] Nej
```

---

## 📊 SEKTION 3: PROGRESSIVE DISCLOSURE

### 3.1 Minimize/Expand Funktionalitet
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/progressive-message-list.tsx`
- **FINNS DET ETT `minimizedMessages` STATE?** Eller liknande?
- **KOPIERA** state-definitionen
- **KOPIERA** funktionen som togglear minimize/expand
- **ANVÄNDS `Set` DATASTRUKTUR?** (Best practice)

**BEVISKRAV:**
```
Rad ___: State för minimized messages
Rad ___-___: Toggle-funktion
Datastruktur: [ ] Set [ ] Array [ ] Annat: ___
```

### 3.2 Olika Visningsnivåer
❓ **TVINGANDE FRÅGA:**
- **ÄNDRAS PADDING** beroende på minimize-state?
- **DÖLJS VISSA BADGES?** Vilka?
- **KOPIERA** conditional rendering-logiken
- **FINNS DET SMOOTH ANIMATION?** (`transition-all`?)

**BEVISKRAV:**
```
Rad ___: Conditional padding/height
Rad ___: Hidden badges när minimized
Animation class: "___"
```

---

## 🎚️ SEKTION 4: DENSITY MODES

### 4.1 Fyra Density Modes
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/combined-density-control.tsx` ELLER sök i progressive-message-list
- **LISTA ALLA 4 MODES:** ___, ___, ___, ___
- **MÅSTE VARA:** compact, normal, comfortable, overview
- **KOPIERA** state-definitionen
- **KOPIERA** selector-komponenten

**BEVISKRAV:**
```
Rad ___: type DensityMode = "___" | "___" | "___" | "___"
Rad ___: const [densityMode, ___] = useState(___)
Alla 4 modes finns: [ ] Ja [ ] Nej
```

### 4.2 Visuella Skillnader
❓ **TVINGANDE FRÅGA:**
- **HUR ÄNDRAS PADDING?** Kopiera conditional logic
- **VILKET MODE** visar MEST info? (Ska vara 'overview')
- **VILKET MODE** visar MINST info? (Ska vara 'compact')
- **FINNS DET EN SWITCH/MAPPING** för padding-värden?

**BEVISKRAV:**
```
Rad ___-___: Padding-mapping/switch
Compact padding: py-___
Normal padding: py-___
Comfortable padding: py-___
Overview: Visar [ ] alla badges [ ] endast vissa
```

---

## ⏰ SEKTION 5: SLA-HANTERING

### 5.1 SLA-Status Typer
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/progressive-message-list.tsx`
- **SÖK EFTER** `slaStatus` type definition
- **KOPIERA** type definition (måste ha: safe, warning, breach)
- **FINNS DET FÄRGMAPPING?** Grön, Gul, Röd?

**BEVISKRAV:**
```
Rad ___: slaStatus?: "___" | "___" | "___"
Rad ___: Färgmapping safe=___, warning=___, breach=___
```

### 5.2 SLA Countdown Timer
❓ **TVINGANDE FRÅGA:**
- **VISAS `slaMinutesLeft`** någonstans i UI?
- **KOPIERA** JSX där countdown visas
- **FORMAT:** Visas som "1m", "30m", "2h"?
- **FINNS DET LOGIC** för att konvertera minuter till h/m?

**BEVISKRAV:**
```
Rad ___: {message.slaMinutesLeft} eller sla-display
Format-funktion: [ ] Ja rad ___ [ ] Nej
```

### 5.3 SLA Prediction
❓ **TVINGANDE FRÅGA:**
- **FINNS `slaPrediction` FIELD?** (will-breach, at-risk, safe)
- **KOPIERA** type definition
- **ANVÄNDS DET I UI?** Kopiera JSX
- **FINNS DET VISUELL INDIKATOR?** (ikon, färg, badge)

**BEVISKRAV:**
```
Rad ___: slaPrediction?: "___" | "___" | "___"
Används i UI: [ ] Ja rad ___ [ ] Nej (betyder att det INTE fungerar!)
```

---

## 🤖 SEKTION 6: AI-FUNKTIONER

### 6.1 Recommended Actions
❓ **TVINGANDE FRÅGA:**
- **FINNS `recommendedAction` FIELD** på Message type?
- **VISAS DET** i meddelandelistan? Kopiera JSX
- **FINNS DET EN KLICKBAR KNAPP?** Vad händer vid klick?
- **KOPIERA** onClick-handler

**BEVISKRAV:**
```
Rad ___: recommendedAction?: string
Rad ___: Visas i UI
Rad ___: onClick-handler
```

### 6.2 AI-genererade Svar
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/enhanced-conversation-detail.tsx`
- **FINNS `handleAIReply` FUNKTION?** Kopiera hela funktionen
- **SÄTTER DEN `draftMessage`?** Med vilket värde?
- **FINNS `suggestedReply` FIELD** på Message?

**BEVISKRAV:**
```
Rad ___-___: handleAIReply funktion
Rad ___: setDraftMessage(message.suggestedReply || "___")
suggestedReply finns: [ ] Ja [ ] Nej
```

### 6.3 Intent Detection
❓ **TVINGANDE FRÅGA:**
- **FINNS `intent` FIELD?** (t.ex. "Bokning", "Omboka", "Fråga")
- **VISAS DET** i UI? Kopiera JSX
- **FINNS `confidence` FIELD?** Visas som %?

**BEVISKRAV:**
```
Rad ___: intent?: string
Rad ___: confidence?: number
Rad ___: Visas som badge/text i UI
```

### 6.4 Sentiment Analysis
❓ **TVINGANDE FRÅGA:**
- **FINNS `sentiment` TYPE?** (happy, frustrated, neutral, excited, worried)
- **KOPIERA** type definition
- **FINNS DET EMOJI/IKONER** för olika sentiments?
- **VISAS DET I UI?**

**BEVISKRAV:**
```
Rad ___: sentiment?: 'happy' | 'frustrated' | '___' | '___' | '___'
Rad ___: Sentiment mapping med emoji/ikoner
Visas: [ ] Ja [ ] Nej
```

---

## 🔥 SEKTION 7: CUSTOMER ENGAGEMENT INDICATORS

### 7.1 Warmth Indicator
❓ **TVINGANDE FRÅGA:**
- **FINNS `warmth` FIELD?** (cold, warm, hot)
- **FINNS DET 🔥 EMOJI** för "hot"?
- **KOPIERA** rendering-logiken
- **VILKA FÄRGER** används? cold=?, warm=?, hot=?

**BEVISKRAV:**
```
Rad ___: warmth?: "cold" | "warm" | "hot"
Rad ___: Flame emoji för "hot"
Färger: cold=___, warm=___, hot=___
```

### 7.2 Lifecycle Stage
❓ **TVINGANDE FRÅGA:**
- **FINNS `lifecycle` eller `journeyStage` FIELD?**
- **VILKA STAGES FINNS?** (lead, consultation, customer, returning, vip)
- **KOPIERA** type definition
- **VISAS DET SOM BADGE?** Kopiera JSX

**BEVISKRAV:**
```
Rad ___: lifecycle?: "___" | "___" | "___" | "___" | "___"
Eller: journeyStage?: "___" | "___" | "___" | "___" | "___"
Badge-rendering: Rad ___
```

### 7.3 Interaction Count
❓ **TVINGANDE FRÅGA:**
- **FINNS `interactionCount` FIELD?**
- **VISAS DET I UI?** Som nummer? Med ikon?
- **KOPIERA** visningen

**BEVISKRAV:**
```
Rad ___: interactionCount?: number
Rad ___: Visas i UI
```

### 7.4 "Is Typing" Indicator
❓ **TVINGANDE FRÅGA:**
- **FINNS `isTyping` BOOLEAN?**
- **VISAS "..." ANIMATION** när true?
- **KOPIERA** conditional rendering

**BEVISKRAV:**
```
Rad ___: isTyping?: boolean
Rad ___: {isTyping && <div>...</div>} eller liknande
```

---

## 👑 SEKTION 8: VIP & REVENUE TRACKING

### 8.1 VIP Status
❓ **TVINGANDE FRÅGA:**
- **FINNS `isVIP` BOOLEAN?**
- **FINNS EN VIP-BADGE** i UI? Med 👑 eller ⭐?
- **KOPIERA** badge-komponenten
- **VILKEN FÄRG** har VIP-badge? (Ska vara guld/amber/yellow)

**BEVISKRAV:**
```
Rad ___: isVIP?: boolean
Rad ___: VIP badge rendering
Färg/stil: bg-___ text-___
```

### 8.2 Revenue Potential
❓ **TVINGANDE FRÅGA:**
- **FINNS `revenuePotential` FIELD?** (low, medium, high, premium)
- **VISAS DET SOM €-SYMBOLER?** €€€€?
- **KOPIERA** mapping-logiken
- **VILKEN FÄRG** för "premium"? (Ska vara guld/amber gradient)

**BEVISKRAV:**
```
Rad ___: revenuePotential?: 'low' | 'medium' | 'high' | 'premium'
Rad ___-___: Mapping med €-symboler
Premium färg: bg-gradient-___ eller bg-___
```

### 8.3 Lifetime Value (LTV)
❓ **TVINGANDE FRÅGA:**
- **FINNS `lifetimeValue` FIELD?** (number)
- **VISAS DET I KRONOR?** Format: "48 500 kr" eller "48K"?
- **FINNS DET GRADIENT** för höga LTV? (>100K)
- **KOPIERA** formatting-logiken

**BEVISKRAV:**
```
Rad ___: lifetimeValue?: number
Rad ___: Format-funktion eller display
Gradient för >100K: [ ] Ja bg-gradient-___ [ ] Nej
```

---

## 🚨 SEKTION 9: STAGNATION DETECTION

### 9.1 Stagnation Flagging
❓ **TVINGANDE FRÅGA:**
- **FINNS `isStagnant` BOOLEAN?**
- **FINNS `timeSinceLastVisit` FIELD?**
- **VISAS VARNING** för stagnerande konversationer?
- **KOPIERA** warning-rendering

**BEVISKRAV:**
```
Rad ___: isStagnant?: boolean
Rad ___: timeSinceLastVisit?: string
Rad ___: Stagnation warning i UI
```

### 9.2 Follow-up Indicator
❓ **TVINGANDE FRÅGA:**
- **FINNS `needsFollowup` BOOLEAN?**
- **VISAS DET SOM BADGE/IKON?**
- **VILKEN FÄRG?** (orange/amber för varning?)

**BEVISKRAV:**
```
Rad ___: needsFollowup?: boolean
Rad ___: Follow-up badge
Färg: bg-___
```

---

## 🗑️ SEKTION 10: SAFE DELETE

### 10.1 Safe Delete Toast
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/safe-delete-toast.tsx`
- **FINNS FILEN?** Om nej, var är funktionen?
- **KOPIERA** export-raden (showSafeDeleteToast function)
- **FINNS `onUndo` CALLBACK?**
- **HUR LÅNG TID** för undo? (5-10 sekunder)

**BEVISKRAV:**
```
Fil: ___ (MÅSTE finnas)
Rad ___: export function showSafeDeleteToast
Rad ___: onUndo callback parameter
Timeout: ___ millisekunder
```

### 10.2 Restore Ignored Modal
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/restore-ignored-modal.tsx`
- **FINNS FILEN?**
- **KOPIERA** component signature
- **FINNS `onRestoreAll` FUNCTION?**
- **VISAS LISTA** av ignorerade items?

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: interface Props { onRestoreAll, ... }
Rad ___: Lista rendering
```

---

## 💬 SEKTION 11: RESPONSE STUDIO

### 11.1 Response Studio Modal
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/response-studio-modal.tsx`
- **FINNS FILEN?**
- **KOPIERA** interface ResponseStudioModalProps
- **FINNS `initialDraft` PROP?**
- **ÄR DET EN FULLSCREEN MODAL?** (fixed inset-0?)

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: interface ResponseStudioModalProps
Rad ___: initialDraft prop
Fullscreen: [ ] Ja className="___" [ ] Nej
```

### 11.2 AI Filter Toggles
❓ **TVINGANDE FRÅGA:**
- **FINNS `selectedFilters` STATE?**
- **VILKA FILTER FINNS?** (kort, varm, proffsig)
- **KOPIERA** state definition
- **ÄR DE TOGGLEBARA?** Kopiera toggle-funktionen

**BEVISKRAV:**
```
Rad ___: const [selectedFilters, ___] = useState({ kort: ___, varm: ___, proffsig: ___ })
Rad ___: toggleFilter function
```

### 11.3 Word Count & Validation
❓ **TVINGANDE FRÅGA:**
- **FINNS `wordCount` CALCULATION?**
- **VAD ÄR RECOMMENDED MAX?** (Ska vara 150-200)
- **KOPIERA** word count-beräkningen
- **FINNS POLICY VIOLATION CHECK?** ("gratis", "garanti")

**BEVISKRAV:**
```
Rad ___: const wordCount = draftText.split(___).length
Recommended max: ___
Rad ___: hasViolation = draftText.includes("gratis") || ...
```

### 11.4 Signature Integration
❓ **TVINGANDE FRÅGA:**
- **ÖPPNAS SIGNATURE EDITOR** från Response Studio?
- **KOPIERA** button onClick som öppnar signature editor
- **FINNS `showSignatureEditor` STATE?**
- **IMPORTERAS SignatureEditorModal?**

**BEVISKRAV:**
```
Rad ___: import { SignatureEditorModal } from "___"
Rad ___: const [showSignatureEditor, ___] = useState(false)
Rad ___: Button onClick={() => setShowSignatureEditor(true)}
```

---

## ✉️ SEKTION 12: EMAIL-SIGNATUR

### 12.1 Signature Editor Modal
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/signature-editor-modal.tsx`
- **FINNS FILEN?**
- **KOPIERA** Signature interface (måste ha: name, title, phone, email, logo, etc.)
- **HUR MÅNGA FÄLT?** (Minst 8: name, title, phone, email, address, website, instagram, facebook, greeting, logo)

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___-___: interface Signature { ... }
Antal fält: ___ (måste vara ≥10)
```

### 12.2 Default Signaturer
❓ **TVINGANDE FRÅGA:**
- **FINNS `defaultSignatures` EXPORT?**
- **VILKA PERSONER FINNS?** (Fazli, Sara, Egzona, etc.)
- **KOPIERA** defaultSignatures-objektet (första 10 rader)
- **HUR MÅNGA DEFAULT SIGNATURER?** (Minst 3)

**BEVISKRAV:**
```
Rad ___: export const defaultSignatures = { ... }
Personer: ___, ___, ___
Antal: ___
```

### 12.3 Logo Upload Funktion
❓ **TVINGANDE FRÅGA:**
- **FINNS EN `handleLogoUpload` FUNCTION?**
- **KOPIERA** hela funktionen
- **ANVÄNDS FileReader?** (för att läsa filen)
- **SÄTTER DEN BASE64** till state?

**BEVISKRAV:**
```
Rad ___-___: handleLogoUpload function
FileReader: [ ] Ja rad ___ [ ] Nej (betyder att upload INTE fungerar!)
Base64 conversion: [ ] Ja [ ] Nej
```

### 12.4 Animerad Logo i Signatur
❓ **TVINGANDE FRÅGA:**
- **ANVÄNDS `<AnimatedSignatureLogo />`** i signaturen?
- **KOPIERA** raden där den används
- **ELLER används `<img src={signature.logo} />`?**

**BEVISKRAV:**
```
Rad ___: <AnimatedSignatureLogo /> eller <img src={___} />
Används animerad komponent: [ ] Ja [ ] Nej
```

---

## 🧠 SEKTION 13: CUSTOMER INTELLIGENCE SIDEBAR

### 13.1 Fyra Tabs
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/customer-intelligence-sidebar-optimized.tsx`
- **FINNS FILEN?**
- **KOPIERA** type TabType definition
- **MÅSTE INNEHÅLLA:** 'oversikt', 'ai', 'medical', 'team'

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: type TabType = '___' | '___' | '___' | '___'
Alla 4 tabs: [ ] Ja [ ] Nej
```

### 13.2 Medical Tab Content
❓ **TVINGANDE FRÅGA:**
- **VISAS `treatmentHistory` ARRAY?** Kopiera rendering
- **VISAS `medicalFlags` ARRAY?** Kopiera rendering
- **FINNS `consentStatus` OBJECT?** (gdpr, photos, marketing)
- **VISAS CHECKBOXES** för consents?

**BEVISKRAV:**
```
Rad ___: treatmentHistory rendering
Rad ___: medicalFlags rendering
Rad ___: consentStatus checkboxes (gdpr, photos, marketing)
```

### 13.3 Team Tab Content
❓ **TVINGANDE FRÅGA:**
- **VISAS `assignedTo` FIELD?**
- **FINNS `internalNotes` ARRAY?**
- **FINNS "ADD NOTE" FUNKTION?** Med Ctrl+N shortcut?
- **KOPIERA** add note-funktionen

**BEVISKRAV:**
```
Rad ___: assignedTo display
Rad ___: internalNotes lista
Rad ___: Add note function
Keyboard shortcut Ctrl+N: [ ] Ja rad ___ [ ] Nej
```

### 13.4 Collapsible Sections
❓ **TVINGANDE FRÅGA:**
- **FINNS `collapsedSections` STATE?** (Set<string>)
- **KOPIERA** toggleSection-funktionen
- **ANVÄNDS ChevronDown/Up** ikoner?
- **VILKA SECTIONS** är collapsed by default?

**BEVISKRAV:**
```
Rad ___: const [collapsedSections, ___] = useState<Set<string>>(new Set([___]))
Rad ___: toggleSection function
Default collapsed: [___]
```

---

## 🎛️ SEKTION 14: HEADER FUNKTIONER

### 14.1 Search Bar
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/header.tsx`
- **FINNS `searchQuery` STATE?**
- **KOPIERA** input-elementet
- **ÖPPNAS ADVANCED SEARCH** om query är tom?
- **FINNS Search-ikon** (från lucide-react)?

**BEVISKRAV:**
```
Rad ___: const [searchQuery, ___] = useState("")
Rad ___: <input type="text" value={searchQuery} ... />
Rad ___: Advanced search trigger
Search-ikon: [ ] Ja [ ] Nej
```

### 14.2 Sprint Mode Button
❓ **TVINGANDE FRÅGA:**
- **KOPIERADE VI REDAN DETTA I SEKTION 2?** Om nej, gör det nu!
- **VISAS KNAPPEN I HEADER?** (inte i navigation)
- **LIGGER DEN TILL HÖGER** om search bar?

**BEVISKRAV:**
```
Sprint-knapp i header.tsx: [ ] Ja rad ___ [ ] Nej (FEL!)
Position: [ ] Höger om search [ ] Annat: ___
```

### 14.3 Language Toggle
❓ **TVINGANDE FRÅGA:**
- **FINNS `handleLanguageChange` FUNCTION?**
- **KOPIERA** funktionen
- **ANVÄNDS Globe-ikon?** (från lucide-react)
- **TOAST VISAS** vid språkbyte?

**BEVISKRAV:**
```
Rad ___-___: handleLanguageChange function
Rad ___: <Globe className="___" />
Toast: [ ] Ja [ ] Nej
```

### 14.4 Notifications Bell
❓ **TVINGANDE FRÅGA:**
- **FINNS Bell-ikon?**
- **FINNS BADGE MED NUMMER?** (t.ex. "1")
- **KOPIERA** badge-rendering
- **VILKEN FÄRG** för badge? (Ska vara röd)

**BEVISKRAV:**
```
Rad ___: <Bell className="___" />
Rad ___: Badge med nummer
Badge färg: bg-___
```

### 14.5 Profile Avatar
❓ **TVINGANDE FRÅGA:**
- **FINNS AVATAR-IMG?**
- **FRÅN UNSPLASH?** Kopiera src URL
- **ÄR DET CIRCULAR?** (rounded-full)
- **ÄR DET CLICKABLE?** onClick-handler?

**BEVISKRAV:**
```
Rad ___: <img src="https://images.unsplash.com/___" />
Rad ___: className="___" (måste innehålla rounded-full)
onClick: [ ] Ja rad ___ [ ] Nej
```

---

## 🗂️ SEKTION 15: NAVIGATION TABS

### 15.1 Fem Tabs
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/navigation-tabs.tsx`
- **LISTA ALLA TAB-NAMN:** ___, ___, ___, ___, ___
- **MÅSTE VARA:** Inkorg, Obesvarade, Snoozed, Utkast, Arkiv
- **KOPIERA** tabs array (rad X-Y)

**BEVISKRAV:**
```
Rad ___-___: const tabs = [...]
Tab 1: ___ (Inkorg)
Tab 2: ___ (Obesvarade)
Tab 3: ___ (Snoozed)
Tab 4: ___ (Utkast)
Tab 5: ___ (Arkiv)
```

### 15.2 Gradient Colors
❓ **TVINGANDE FRÅGA:**
- **VILKEN GRADIENT** för Inkorg? (Ska vara rosa: pink-500 to rose-500)
- **VILKEN GRADIENT** för Obesvarade? (Ska vara amber)
- **KOPIERA** gradient-klasserna för ALLA tabs

**BEVISKRAV:**
```
Inkorg: gradient: "from-___ to-___" (MÅSTE vara pink/rose)
Obesvarade: "from-___ to-___" (MÅSTE vara amber/orange)
Snoozed: "from-___ to-___"
Utkast: "from-___ to-___"
Arkiv: "from-___ to-___"
```

### 15.3 Active State
❓ **TVINGANDE FRÅGA:**
- **ANVÄNDS `useLocation` HOOK?** (från react-router)
- **KOPIERA** active state check-logiken
- **FINNS GRADIENT** på active tab?
- **FINNS ANIMATION** på active tab? (pulse, glow, etc.)

**BEVISKRAV:**
```
Rad ___: const location = useLocation()
Rad ___: const isActive = location.pathname === tab.path
Active gradient: [ ] Ja className="bg-gradient-___" [ ] Nej
Animation: [ ] Ja className="animate-___" [ ] Nej
```

---

## 📱 SEKTION 16: RESIZABLE LAYOUT

### 16.1 Resizable Component
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/resizable-layout.tsx`
- **FINNS FILEN?**
- **KOPIERA** component signature med props
- **ANVÄNDS re-resizable LIBRARY?** (INTE react-resizable)
- **KOPIERA** import-raden

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: interface ResizableLayoutProps { leftColumn, centerColumn, rightColumn }
Rad ___: import { ___ } from "re-resizable" eller annat
Library: ___
```

### 16.2 Tre Kolumner
❓ **TVINGANDE FRÅGA:**
- **RENDERAS ALLA TRE KOLUMNER?**
- **KOPIERA** JSX för tre kolumner
- **VILKA ÄR DEFAULT WIDTHS?** (px eller %)
- **KAN ALLA KOLUMNER RESIZE?** Eller bara vissa?

**BEVISKRAV:**
```
Rad ___-___: Tre kolumner rendering
Left width: ___
Center width: ___
Right width: ___
Resizable: [ ] Alla [ ] Bara vissa: ___
```

---

## 🎓 SEKTION 17: ONBOARDING TUTORIAL

### 17.1 Five Steps
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/onboarding-tutorial.tsx`
- **FINNS FILEN?**
- **KOPIERA** steps array
- **HUR MÅNGA STEPS?** (MÅSTE vara 5)
- **VILKA ÄMNEN?** (Välkommen, Sprint, Progressive, Density, AI)

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___-___: const steps = [...]
Antal steps: ___ (MÅSTE vara 5)
Step 1: ___ (Välkommen)
Step 2: ___ (Sprint Mode)
Step 3: ___ (Progressive Disclosure)
Step 4: ___ (Density Modes)
Step 5: ___ (AI Features)
```

### 17.2 LocalStorage Save
❓ **TVINGANDE FRÅGA:**
- **SPARAS "onboarding-completed" I LOCALSTORAGE?**
- **KOPIERA** localStorage.setItem-raden
- **KOPIERA** useEffect som checkar localStorage
- **VISAS ONBOARDING** endast första gången?

**BEVISKRAV:**
```
Rad ___: localStorage.setItem("cco-onboarding-completed", "___")
Rad ___: localStorage.getItem("___")
Visas bara första gången: [ ] Ja [ ] Nej
```

### 17.3 Navigation & Skip
❓ **TVINGANDE FRÅGA:**
- **FINNS "Nästa" BUTTON?**
- **FINNS "Föregående" BUTTON?**
- **FINNS "Hoppa över" BUTTON?**
- **KOPIERA** button onClick handlers

**BEVISKRAV:**
```
Rad ___: Nästa-button onClick={handleNext}
Rad ___: Föregående-button onClick={handlePrev}
Rad ___: Skip-button onClick={handleSkip}
```

---

## 📊 SEKTION 18: STATS DASHBOARD

### 18.1 Dashboard Modal
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/stats-dashboard-modal.tsx`
- **FINNS FILEN?**
- **KOPIERA** component signature
- **FINNS `onClose` PROP?**
- **ÄR DET EN MODAL?** (fixed, inset-0, bg-black/50?)

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: interface StatsDashboardModalProps
Modal overlay: [ ] Ja className="fixed inset-0___" [ ] Nej
```

### 18.2 Stats Metrics
❓ **TVINGANDE FRÅGA:**
- **VILKA METRICS VISAS?**
  - [ ] Total messages
  - [ ] Average response time
  - [ ] SLA compliance
  - [ ] Customer satisfaction
- **KOPIERA** metrics rendering

**BEVISKRAV:**
```
Rad ___-___: Metrics display
Metrics som visas: ___, ___, ___, ___
```

---

## 🌐 SEKTION 19: INTERNATIONALISERING

### 19.1 Language Context
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/context/language-context.tsx`
- **FINNS FILEN?**
- **KOPIERA** type Language definition (måste vara "sv" | "en")
- **KOPIERA** translations object (första 20 rader)
- **FINNS SVENSKA OCH ENGELSKA ÖVERSÄTTNINGAR?**

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: type Language = "___" | "___"
Rad ___: const translations = { sv: {...}, en: {...} }
Både SV och EN: [ ] Ja [ ] Nej
```

### 19.2 Translation Keys
❓ **TVINGANDE FRÅGA:**
- **FINNS `t()` FUNCTION?** (translation helper)
- **KOPIERA** t-funktionen
- **ANVÄNDS t() I KOMPONENTER?** Sök i header.tsx
- **EXEMPEL:** Kopiera `t("header.search")` usage

**BEVISKRAV:**
```
Rad ___: const t = (key: string) => ___
Rad ___ (header.tsx): placeholder={t("___")}
Används i minst 5 komponenter: [ ] Ja [ ] Nej
```

---

## 🔧 SEKTION 20: ROUTING & PAGES

### 20.1 Router Configuration
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/routes.tsx`
- **FINNS FILEN?**
- **KOPIERA** router creation (createBrowserRouter)
- **HUR MÅNGA ROUTES?** (Minst 5: /, /unanswered, /snoozed, /drafts, /archive)

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: export const router = createBrowserRouter([...])
Antal routes: ___
```

### 20.2 Page Components
❓ **TVINGANDE FRÅGA:**
- **FINNS `/src/app/pages/inbox-page.tsx`?** Öppna och kopiera rad 1-20
- **FINNS `/src/app/pages/unanswered-page.tsx`?**
- **FINNS `/src/app/pages/snoozed-page.tsx`?**
- **FINNS `/src/app/pages/drafts-page.tsx`?**
- **FINNS `/src/app/pages/archive-page.tsx`?**

**BEVISKRAV:**
```
inbox-page.tsx: [ ] Finns [ ] Saknas
unanswered-page.tsx: [ ] Finns [ ] Saknas
snoozed-page.tsx: [ ] Finns [ ] Saknas
drafts-page.tsx: [ ] Finns [ ] Saknas
archive-page.tsx: [ ] Finns [ ] Saknas
```

### 20.3 Main Layout
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/layouts/main-layout.tsx`
- **FINNS FILEN?**
- **ANVÄNDS `<Outlet />` FRÅN react-router?**
- **INKLUDERAS Header och NavigationTabs?**
- **KOPIERA** hela komponenten (om <30 rader)

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: import { Outlet } from "react-router"
Rad ___: <Header />
Rad ___: <NavigationTabs />
Rad ___: <Outlet />
```

---

## ⚡ SEKTION 21: MULTI-SELECT & BULK OPERATIONS

### 21.1 Multi-Select Mode
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/progressive-message-list.tsx`
- **FINNS `multiSelectMode` STATE?**
- **KOPIERA** state definition
- **FINNS TOGGLE-KNAPP** för multi-select mode?
- **VISAS CHECKBOXES** när mode är aktiv?

**BEVISKRAV:**
```
Rad ___: const [multiSelectMode, ___] = useState(false)
Rad ___: Toggle button för multi-select
Rad ___: Checkboxes conditional rendering
```

### 21.2 Selected Messages Tracking
❓ **TVINGANDE FRÅGA:**
- **FINNS `selectedMessages` STATE?** (Array<string>)
- **KOPIERA** state definition
- **FINNS `toggleMessageSelection` FUNCTION?**
- **KOPIERA** toggle-funktionen

**BEVISKRAV:**
```
Rad ___: const [selectedMessages, ___] = useState<string[]>([])
Rad ___-___: toggleMessageSelection function
```

### 21.3 Bulk Operations Toolbar
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/multi-select-toolbar.tsx`
- **FINNS FILEN?**
- **VILKA ACTIONS FINNS?** (Archive, Delete, Assign, Mark as Read, etc.)
- **KOPIERA** actions array eller buttons

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___-___: Actions (Archive, Delete, Assign, ...)
Actions som finns: ___, ___, ___
```

---

## 🔍 SEKTION 22: ADVANCED SEARCH

### 22.1 Advanced Search Modal
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/advanced-search-modal.tsx`
- **FINNS FILEN?**
- **KOPIERA** component signature
- **VILKA FILTER-ALTERNATIV FINNS?**
  - [ ] SLA status
  - [ ] Priority
  - [ ] Assigned to
  - [ ] Date range
  - [ ] Customer status

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: interface AdvancedSearchModalProps
Filter-alternativ: ___, ___, ___, ___
```

### 22.2 Search Handler
❓ **TVINGANDE FRÅGA:**
- **FINNS `onSearch` CALLBACK PROP?**
- **KOPIERA** onSearch usage
- **SKICKAS QUERY OCH FILTERS** till callback?

**BEVISKRAV:**
```
Rad ___: onSearch: (query: string, filters: any) => void
Rad ___: onSearch(query, filters) call
```

---

## 🎨 SEKTION 23: PREMIUM DESIGN VERIFICATION

### 23.1 Rosa Färgschema
❓ **TVINGANDE FRÅGA:**
- **SÖK I HELA PROJEKTET** efter "pink", "rose", "#ec4899", "#f472b6"
- **KOPIERA 5 EXEMPEL** där rosa färg används
- **ANVÄNDS ROSA PÅ:**
  - [ ] Inkorg-tab
  - [ ] Send-knappar
  - [ ] VIP-relaterade element
  - [ ] Hover-effekter
  - [ ] Focus states

**BEVISKRAV:**
```
Exempel 1: Fil ___, Rad ___, Kod: ___
Exempel 2: Fil ___, Rad ___, Kod: ___
Exempel 3: Fil ___, Rad ___, Kod: ___
Exempel 4: Fil ___, Rad ___, Kod: ___
Exempel 5: Fil ___, Rad ___, Kod: ___
```

### 23.2 Grå Toner
❓ **TVINGANDE FRÅGA:**
- **ANVÄNDS gray-50 FÖR BAKGRUND?**
- **ANVÄNDS gray-900 FÖR TEXT?**
- **KOPIERA** className-exempel

**BEVISKRAV:**
```
gray-50: Fil ___, Rad ___, className="bg-gray-50___"
gray-900: Fil ___, Rad ___, className="text-gray-900___"
```

### 23.3 Gradients
❓ **TVINGANDE FRÅGA:**
- **SÖK EFTER** "bg-gradient-to-r", "from-", "to-"
- **HITTA 3 OLIKA GRADIENTS** i projektet
- **KOPIERA** alla tre

**BEVISKRAV:**
```
Gradient 1: Fil ___, Rad ___, className="bg-gradient-to-r from-___ to-___"
Gradient 2: Fil ___, Rad ___, className="___"
Gradient 3: Fil ___, Rad ___, className="___"
```

### 23.4 Shadows & Transitions
❓ **TVINGANDE FRÅGA:**
- **ANVÄNDS `shadow-sm`, `shadow-md`, `shadow-2xl`?**
- **ANVÄNDS `transition-all` PÅ INTERAKTIVA ELEMENT?**
- **KOPIERA 3 EXEMPEL**

**BEVISKRAV:**
```
Shadow exempel: Fil ___, Rad ___, className="shadow-___"
Transition exempel 1: Fil ___, Rad ___, className="transition-___"
Transition exempel 2: Fil ___, Rad ___, className="transition-___"
```

---

## 🚨 SEKTION 24: KRITISKA EDGE CASES

### 24.1 Empty States
❓ **TVINGANDE FRÅGA:**
- **VAD VISAS NÄR INGA MEDDELANDEN FINNS?**
- Öppna `/src/app/components/empty-states.tsx` (om finns)
- **KOPIERA** empty state-komponenten
- **FINNS ILLUSTRATIONER/IKONER?**

**BEVISKRAV:**
```
Fil: ___
Rad ___-___: Empty state rendering
Ikon/illustration: [ ] Ja [ ] Nej
```

### 24.2 Loading States
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/loading-states.tsx` (om finns)
- **FINNS SKELETON LOADERS?**
- **FINNS SPINNER COMPONENT?**
- **KOPIERA** LoadingSpinner export

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: export function LoadingSpinner
Skeleton loaders: [ ] Ja [ ] Nej
```

### 24.3 Error Boundaries
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/error-boundary.tsx`
- **FINNS FILEN?**
- **ANVÄNDS componentDidCatch?** (Class component)
- **ELLER error boundary library?**

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Implementation: [ ] Class component [ ] Library: ___ [ ] Saknas
```

### 24.4 Offline Handling
❓ **TVINGANDE FRÅGA:**
- Öppna `/src/app/components/offline-banner.tsx`
- **FINNS FILEN?**
- **LYSSNAR PÅ `navigator.onLine`?**
- **VISAS BANNER** när offline?

**BEVISKRAV:**
```
Fil finns: [ ] Ja [ ] Nej
Rad ___: navigator.onLine check
Rad ___: Offline banner rendering
```

---

## 🎯 SEKTION 25: FINAL SHOWDOWN - BEVISA ALLT FUNGERAR

### 25.1 Kan användare faktiskt...
❓ **TVINGANDE FRÅGOR:**

**1. Öppna inbox och se meddelanden?**
- [ ] Ja - Bevis: InboxPage renderar ProgressiveMessageList på rad ___
- [ ] Nej - Varför inte? ___

**2. Klicka på ett meddelande och se konversation?**
- [ ] Ja - Bevis: onSelectMessage callback på rad ___, uppdaterar selectedMessage state
- [ ] Nej - Varför inte? ___

**3. Skriva snabbt svar och skicka?**
- [ ] Ja - Bevis: Quick Response bar på rad ___, handleSendQuick function på rad ___
- [ ] Nej - Varför inte? ___

**4. Öppna Response Studio och redigera?**
- [ ] Ja - Bevis: Response Studio modal på rad ___, showResponseStudio state
- [ ] Nej - Varför inte? ___

**5. Ändra email-signatur och ladda upp logo?**
- [ ] Ja - Bevis: Signature Editor på rad ___, handleLogoUpload på rad ___
- [ ] Nej - Varför inte? ___

**6. Aktivera Sprint Mode?**
- [ ] Ja - Bevis: toggleSprintMode på rad ___, sprintMode state
- [ ] Nej - Varför inte? ___

**7. Multi-select meddelanden och bulk archive?**
- [ ] Ja - Bevis: multiSelectMode på rad ___, MultiSelectToolbar på rad ___
- [ ] Nej - Varför inte? ___

**8. Se Customer Intelligence för vald kund?**
- [ ] Ja - Bevis: CustomerIntelligenceSidebar renderas med message prop
- [ ] Nej - Varför inte? ___

**9. Byta språk SV/EN?**
- [ ] Ja - Bevis: handleLanguageChange på rad ___, LanguageContext
- [ ] Nej - Varför inte? ___

**10. Första besök: Se onboarding tutorial?**
- [ ] Ja - Bevis: OnboardingTutorial visas när showOnboarding === true
- [ ] Nej - Varför inte? ___

---

## 📊 FINAL SCORE

Efter att ha gått igenom ALLA sektioner:

### Sammanfattning:
- **✅ Helt implementerat och verifierat:** ___ / 25 sektioner
- **⚠️ Delvis implementerat (saknar detaljer):** ___ / 25 sektioner
- **❌ Saknas helt:** ___ / 25 sektioner

### Specifika brister som hittats:
1. ___
2. ___
3. ___

### Kritiska funktioner som MÅSTE fixas:
1. ___
2. ___
3. ___

### Mindre issues som kan fixas senare:
1. ___
2. ___
3. ___

---

## ✍️ CODEX SIGNATUR

Jag, Codex, har granskat denna applikation punkt för punkt och bekräftar:

**Övergripande bedömning:** [ ] Produktionsklar [ ] Behöver fixes [ ] Saknar kritiska delar

**Datum:** ___________
**Tid spenderad på granskning:** ___ minuter
**Antal filer öppnade:** ___
**Antal rader kod granskade:** ___

**Ärlighetsgaranti:** Jag har FAKTISKT öppnat filerna och läst koden, inte bara gissat.

---

## 🎯 TILL ANVÄNDAREN

När Codex har fyllt i denna checklista, du kommer ha:

1. ✅ **Komplett bevis** på vad som fungerar
2. ⚠️ **Lista på vad som saknas** (om något)
3. 🔧 **Konkreta radnummer** att fixa
4. 📁 **Exakta filer** som behöver uppdateras
5. 💯 **Full transparens** - inga gissningar

**Tvinga Codex att vara ärlig. Acceptera inte vaga svar.**
