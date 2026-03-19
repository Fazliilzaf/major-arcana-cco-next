# 💬 Hur Förklara Design till Andra Projekt

## Guide: "Vi vill ha samma känsla som HairTP Clinic"

---

## 🎯 OLIKA MÅLGRUPPER

### 1️⃣ **Till DESIGNERS (Figma/Sketch)**

#### **Kort version (Email):**
```
Hej!

Vi vill ha samma visuella språk som HairTP Clinic projektet.

Nyckelpunkter:
• Primary: Pink/Rose gradient (#ec4899 → #f43f5e)
• Neutrals: Warm grays (inte blå-grå)
• Spacing: 8px grid system
• Radius: 4-12px (mjukt men inte överdrivet)
• Shadows: Subtila (max 12% opacity)
• Typography: System fonts, 13px base size
• Status: Pastell badges (ljus bakgrund + mörk text)

Se bifogat: DESIGN-LANGUAGE-SPECIFICATION.md för alla detaljer.

Referens Figma: [länk till HairTP projekt]
```

#### **Lång version (Kickoff meeting):**
```
DESIGNFILOSOFI:
"Luftig men kompakt, premium men inte flashig, mjukt men distinkt"

VISUELLT SPRÅK:
1. FÄRGER
   - Primary: Pink (#ec4899) + Rose (#f43f5e) gradient
   - Använd som accent, inte överallt
   - Neutrals: Warm gray palette (#f9fafb → #111827)
   - Status: Pastell badges (ex: #fdf2f8 bg + #be185d text)

2. SPACING & LAYOUT
   - Allt baserat på 8px grid
   - Kompakta komponenter men aldrig trångt
   - Header: 40px, Tabs: 32px, Buttons: 28-36px
   - Padding i cards: 16px
   - Gap mellan element: 8-12px

3. FORMER & EFFEKTER
   - Border radius: 4px (små), 6-8px (default), 12px (stora)
   - Shadows: Mycket subtila (rgba(0,0,0,0.08-0.12))
   - Inga hårda borders, använd shadows för djup

4. TYPOGRAFI
   - System fonts (-apple-system, Segoe UI, etc.)
   - Base size: 13px (kompakt men läsbart)
   - Weights: 400 (body), 500 (buttons), 600 (headings)
   - Line height: 1.5 för body text

5. KOMPONENTER
   - Buttons: Gradient för primary, outline för secondary
   - Badges: Pastell med border (ljus bg + mörk text)
   - Cards: White bg, gray border, subtle shadow
   - Icons: Lucide library, 14-16px storlek

REFERENSMATERIAL:
- DESIGN-LANGUAGE-SPECIFICATION.md (full spec)
- DESIGN-QUICK-REFERENCE.md (cheat sheet)
- HairTP Clinic live preview

MOODBOARD KEYWORDS:
"Premium healthcare app, Scandinavian minimalism, 
Warm pastels, Subtle depth, Compact efficiency"
```

---

### 2️⃣ **Till UTVECKLARE (React/CSS)**

#### **Kort version (Slack/Teams):**
```
Vi ska använda samma design tokens som HairTP Clinic.

Setup:
1. Kopiera /src/styles/theme.css (CSS variables)
2. Importera i din main.css
3. Använd tokens istället för hardcoded värden

Exempel:
✅ padding: var(--space-4);
❌ padding: 16px;

✅ color: var(--pink-500);
❌ color: #ec4899;

✅ border-radius: var(--radius-md);
❌ border-radius: 8px;

Docs: DESIGN-LANGUAGE-SPECIFICATION.md
Quick ref: DESIGN-QUICK-REFERENCE.md
```

#### **Lång version (Tech doc):**
```markdown
# Design System Implementation

## 1. Setup

### Install dependencies:
```bash
npm install tailwindcss@4.1.12
npm install lucide-react@0.487.0
```

### Import base styles:
```css
/* main.css */
@import './theme.css';
```

## 2. CSS Variables (Design Tokens)

Alla värden finns som CSS variables i theme.css:

```css
/* Spacing */
--space-1: 4px;
--space-2: 8px;
--space-4: 16px;

/* Colors */
--pink-500: #ec4899;
--gray-200: #e5e7eb;

/* Radius */
--radius-sm: 6px;
--radius-md: 8px;

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
```

**Använd ALLTID tokens:**
```css
/* ✅ CORRECT */
.card {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* ❌ WRONG */
.card {
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
```

## 3. Component Patterns

### Button (Primary)
```tsx
<button className="
  bg-gradient-to-br from-pink-500 to-rose-500
  text-white
  h-9 px-4
  rounded-lg
  font-medium
  shadow-sm
  hover:shadow-md
  hover:-translate-y-px
  transition-all duration-200
">
  Click me
</button>
```

### Badge (Pastell)
```tsx
<span className="
  inline-flex items-center
  h-5 px-2
  text-xs font-medium
  bg-pink-50 text-pink-700
  border border-pink-200
  rounded
">
  Active
</span>
```

### Card
```tsx
<div className="
  bg-white
  border border-gray-200
  rounded-xl
  p-4
  shadow-sm
  hover:shadow-md
  transition-shadow
">
  Content
</div>
```

## 4. Dark Mode

Använd `dark:` prefix för dark mode:

```tsx
<div className="
  bg-white dark:bg-gray-800
  border-gray-200 dark:border-gray-700
  text-gray-900 dark:text-gray-100
">
  Content
</div>
```

## 5. Icons

```tsx
import { Mail, User, Settings } from 'lucide-react';

<Mail className="h-4 w-4" />  {/* 16px */}
```

## 6. Spacing

Använd Tailwind spacing eller våra tokens:

```tsx
<div className="space-y-2">  {/* 8px gap */}
<div className="gap-4">      {/* 16px gap */}
<div className="p-4">        {/* 16px padding */}
```

## References
- Full spec: DESIGN-LANGUAGE-SPECIFICATION.md
- Quick ref: DESIGN-QUICK-REFERENCE.md
- Theme file: /src/styles/theme.css
```

---

### 3️⃣ **Till PRODUKTÄGARE/STAKEHOLDERS**

#### **Executive summary:**
```
DESIGNMÅL FÖR [DITT PROJEKT]:
Samma premium-känsla som HairTP Clinic

VAD DET INNEBÄR:
✓ Professionell, modern design
✓ Rosa/grå färgpalett (brand consistency)
✓ Kompakt layout (mer på skärmen)
✓ Smooth animationer (premium feel)
✓ Mobilvänlig (touch-friendly)
✓ Tillgänglig (WCAG AA)

VISUELL REFERENS:
[Screenshot från HairTP Clinic]

IMPLEMENTATION:
Vi återanvänder designsystemet från HairTP:
- Färger, typografi, komponenter
- Testat och beprövat
- Snabbare development (färre beslut)
- Konsistent brand experience

TIMELINE:
Design phase: 1-2 veckor (snabbare med templates)
Development: Följer samma patterns (effektivare)

BUDGET:
Design costs ↓ (återanvänder system)
Development velocity ↑ (färre custom komponenter)
```

---

### 4️⃣ **Till UX RESEARCHERS**

```
DESIGNSYSTEM ATT TESTA:
HairTP Clinic visual language

NYCKELELEMENT ATT VALIDERA:

1. FÄRGER
   - Är pink/rose för "feminint"? 
   - Funkar pastell-badges för status?
   - Läsbarhet i olika ljusförhållanden?

2. KOMPAKTHET
   - Känns 13px text för liten?
   - Är 40px header för tight?
   - Kan användare hitta information snabbt?

3. INTERAKTIONER
   - Är hover-effekter tydliga nog?
   - Fungerar expand/collapse intuitivt?
   - Dark mode preference?

4. MOBILE
   - Touch targets tillräckligt stora (44px)?
   - Scrolling smooth?
   - Text läsbar på små skärmar?

TESTMATERIAL:
- Interactive prototype
- DESIGN-LANGUAGE-SPECIFICATION.md
- Mobile vs Desktop comparison

METRICS:
- Task completion time
- Error rate
- Satisfaction score (SUS)
- Accessibility compliance
```

---

## 📋 TEMPLATES FÖR OLIKA SITUATIONER

### **Scenario 1: "Vi vill ha exakt samma design"**

```
Kopiera HELA designsystemet:

1. Design tokens:
   ✓ Kopiera /src/styles/theme.css
   ✓ Importera i ditt projekt
   ✓ Använd CSS variables överallt

2. Komponenter:
   ✓ Kopiera /src/app/components/ui/*
   ✓ Anpassa funktionalitet (behåll stil)

3. Färger:
   ✓ Pink (#ec4899) som primary
   ✓ Warm grays som neutrals
   ✓ Pastell status badges

4. Proportioner:
   ✓ Header: 40px
   ✓ Tabs: 32px
   ✓ Buttons: 28-36px
   ✓ Spacing: 8px grid

Referens: HairTP Clinic
Dokument: DESIGN-LANGUAGE-SPECIFICATION.md
```

---

### **Scenario 2: "Vi vill ha liknande känsla, inte exakt kopia"**

```
Adaptera PRINCIPERNA, inte pixel-for-pixel:

BIBEHÅLL:
✓ Kompakt men luftig känsla (8px spacing grid)
✓ Mjuka former (border-radius 4-12px)
✓ Subtila effekter (shadows < 15% opacity)
✓ Pastell status colors
✓ System fonts (13px base)

ANPASSA:
→ Primary color (din brand color istället för pink)
→ Specifika komponentstorleker (men behåll proportioner)
→ Färgpalett (men behåll pastell-approach)

EXEMPEL:
Om din brand är blå:
- Primary: #3b82f6 (istället för #ec4899)
- Men samma pastell-badges approach
- Samma spacing grid
- Samma shadow subtlety

Referens: DESIGN-LANGUAGE-SPECIFICATION.md
Anpassa: Primary colors, keep proportions
```

---

### **Scenario 3: "Visa detta för kund/extern part"**

```
PRESENTATION DECK OUTLINE:

Slide 1: Visual Reference
[Screenshot från HairTP Clinic]
"Detta är designspråket vi föreslår"

Slide 2: Design Principles
• Luftig men kompakt
• Premium men inte flashig
• Mjukt men distinkt
• Accessible & responsive

Slide 3: Color Palette
[Färgcirklar: Pink-500, Rose-500, Gray toner]
"Rosa accent + varma grå toner"

Slide 4: Component Examples
[Button, Badge, Card side-by-side]
"Konsistenta komponenter"

Slide 5: Mobile vs Desktop
[Responsive examples]
"Fungerar på alla enheter"

Slide 6: Benefits
• Snabbare development (färdigt system)
• Proven design (testat i HairTP)
• Consistent brand experience
• WCAG AA compliant

LEAVE-BEHIND:
PDF export av DESIGN-QUICK-REFERENCE.md
```

---

## 🎨 VISUELLA REFERENSER ATT DELA

### **Moodboard Keywords:**
```
"Premium healthcare app"
"Scandinavian minimalism"
"Warm pastels"
"Subtle depth"
"Compact efficiency"
"Soft gradients"
"Modern professional"
```

### **Similar Apps (för kontext):**
```
Linear (compact, clean)
Intercom (pastels, rounded)
Notion (subtle shadows)
Stripe (system fonts, simplicity)

Men med:
+ Rosa accent (vårt brand)
+ Tightare spacing (efficiency)
+ Pastell status (softer)
```

---

## 📦 DELIVERABLES CHECKLIST

När du ska dela designen:

### **För Designers:**
- [ ] DESIGN-LANGUAGE-SPECIFICATION.md
- [ ] DESIGN-QUICK-REFERENCE.md
- [ ] Figma file (om tillgänglig)
- [ ] Color palette (Figma styles)
- [ ] Component library (Figma)

### **För Developers:**
- [ ] /src/styles/theme.css (tokens)
- [ ] /src/app/components/ui/* (components)
- [ ] DESIGN-LANGUAGE-SPECIFICATION.md
- [ ] Code examples (från spec)

### **För Stakeholders:**
- [ ] Screenshots (key screens)
- [ ] DESIGN-QUICK-REFERENCE.md (one-pager)
- [ ] Benefits summary
- [ ] Timeline estimate

### **För Kund/Partner:**
- [ ] Visual presentation (PDF/slides)
- [ ] Live demo (om möjligt)
- [ ] Moodboard
- [ ] Comparison (before/after)

---

## 💡 EXAMPLE PITCHES

### **Pitch 1: Internal Team**
```
"Vi ska återanvända designsystemet från HairTP Clinic.

Varför?
• Snabbare (färdigt system)
• Beprövat (redan testat)
• Konsistent (samma brand feel)

Vad betyder det?
• Samma pink/gray palette
• Samma kompakta layout
• Samma komponenter

Nästa steg?
• Review DESIGN-LANGUAGE-SPECIFICATION.md
• Diskutera anpassningar (om några)
• Kickoff med designers nästa vecka"
```

### **Pitch 2: External Client**
```
"Vi föreslår ett designsystem baserat på vår beprövade HairTP Clinic design.

Fördelar för er:
✓ Snabbare time-to-market
✓ Premium, modern design
✓ Mobilvänlig & tillgänglig
✓ Testad på riktiga användare

Vad ni får:
• Professionell rosa/grå färgpalett
• Kompakt, effektiv layout
• Smooth animationer
• Alla standardkomponenter

Anpassningar:
→ Er logotyp & brand assets
→ Specifika funktioner ni behöver
→ Custom komponenter vid behov

Timeline:
Design: 1-2 veckor (istället för 4-6)
Development: Följer beprövade patterns"
```

---

## 🎯 KEY PHRASES ATT ANVÄNDA

När du beskriver designen:

### **Visuella egenskaper:**
- "Kompakt men aldrig trångt"
- "Premium utan att vara flashig"
- "Mjuka former med subtil depth"
- "Pastell accent colors"
- "Varma, professionella grå toner"

### **Tekniska egenskaper:**
- "8px spacing grid för konsistens"
- "System fonts för native feel"
- "Subtila skuggor (max 12% opacity)"
- "Rundade hörn (4-12px)"
- "Smooth transitions (0.2s)"

### **UX egenskaper:**
- "Progressive disclosure"
- "Touch-friendly (44px targets)"
- "WCAG AA compliant"
- "Dark mode support"
- "Responsive design"

---

## ✅ FINAL CHECKLIST

Innan du kommunicerar designen:

- [ ] Förstår målgruppen (designer/dev/stakeholder)
- [ ] Har rätt dokument (spec/quick-ref)
- [ ] Kan visa live demo eller screenshots
- [ ] Kan förklara "varför" (benefits)
- [ ] Kan visa exempel (före/efter)
- [ ] Kan svara på "hur lång tid?" (timeline)
- [ ] Har färdiga templates (komponenter)
- [ ] Kan demonstrera dark mode
- [ ] Kan visa mobile version
- [ ] Har backup plan (ifall motstånd)

---

## 🎊 SUMMARY

**"Den här känslan" sammanfattat i EN MENING:**

> "Ett premium designsystem med rosa accent och varma grå toner, byggt på 8px spacing grid, med mjuka former (4-12px radius), subtila skuggor (max 12% opacity), och kompakt typografi (13px base), som skapar en luftig men effektiv känsla genom att balansera tighthet med perfekt whitespace."

**Eller kortare:**

> "Premium rosa/grå design. Kompakt men luftig. Mjukt men professionellt. Pastell accents. 8px grid. System fonts."

---

**Nu kan du förklara designen till vem som helst!** 💬✨

*Communication Guide v1.0 - 2026-03-16*
