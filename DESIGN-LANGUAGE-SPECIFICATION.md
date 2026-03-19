# 🎨 HairTP Clinic - Design Language Specification

## "Det här känslan" - Komplett Visual Design System

**Version:** 1.0  
**Datum:** 2026-03-16  
**Syfte:** Återskapa samma visuella känsla, proportioner och polish i andra projekt  

---

## 🌟 DESIGNFILOSOFI

### Vad gör denna design speciell?

#### **Kärnprinciper:**

1. **"Luftig men kompakt"**
   - Allt ska synas utan scrollning
   - Men det ska inte kännas trångt
   - Perfekt balans mellan whitespace och information density

2. **"Premium men inte flashig"**
   - Elegant, professionell
   - Subtila effekter istället för aggressiva
   - Kvalitet över kvantitet

3. **"Mjukt men distinkt"**
   - Pastellfärger med hög läsbarhet
   - Rundade hörn överallt (men inte överdrivet)
   - Skuggor istället för hårda linjer

4. **"Smart progressivitet"**
   - Information visas när du behöver den
   - Expandera/kollaps känns naturligt
   - Aldrig överväldigt

---

## 📐 DIMENSIONER & PROPORTIONER

### 1. Spacing System (8px-grid)

**Grundregel:** Allt är multiplar av 4px eller 8px

```css
/* Spacing tokens */
--space-0: 0;
--space-1: 4px;   /* Minimal gap */
--space-2: 8px;   /* Small gap */
--space-3: 12px;  /* Medium gap */
--space-4: 16px;  /* Standard gap */
--space-5: 20px;  /* Large gap */
--space-6: 24px;  /* XL gap */
--space-8: 32px;  /* Section gap */
--space-10: 40px; /* Page gap */
--space-12: 48px; /* Major section */
```

**Användning:**
```css
/* Card padding */
padding: var(--space-4);  /* 16px */

/* Gap mellan element */
gap: var(--space-2);      /* 8px */

/* Section spacing */
margin-bottom: var(--space-6); /* 24px */
```

---

### 2. Komponentstorleker

#### **Header - Kompakt (40px höjd)**
```css
.header {
  height: 40px;
  padding: 8px 24px;
  border-bottom: 1px solid var(--border);
}

.header-logo {
  height: 40px;  /* Logga tar full höjd */
}

.header-search {
  width: 300px;
  height: 32px;   /* Mindre än header */
  border-radius: 16px; /* Pill-shape */
}

.header-button {
  width: 28px;
  height: 28px;
  padding: 6px;
  border-radius: 6px;
}

.header-icon {
  width: 14px;
  height: 14px;
}
```

#### **Navigation Tabs - Kompakt (32px höjd)**
```css
.nav-tabs {
  height: 32px;
  padding: 0 24px;
  gap: 2px;       /* Minimal gap mellan tabs */
}

.nav-tab {
  height: 32px;
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 6px;
  gap: 6px;       /* Icon till text */
}

.nav-tab-icon {
  width: 14px;
  height: 14px;
}
```

#### **Message List Item - Medium (60px höjd)**
```css
.message-item {
  height: 60px;
  padding: 12px 16px;
  gap: 12px;
  border-radius: 8px;
}

.message-item-avatar {
  width: 36px;
  height: 36px;
  border-radius: 18px; /* Perfectly round */
}

.message-item-badge {
  height: 20px;
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 10px;
}
```

#### **Buttons - Tre storlekar**
```css
/* Small button (Compact UI) */
.button-sm {
  height: 28px;
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 6px;
  gap: 4px;
}

/* Medium button (Default) */
.button-md {
  height: 36px;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  gap: 6px;
}

/* Large button (Primary actions) */
.button-lg {
  height: 44px;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 10px;
  gap: 8px;
}
```

#### **Cards - Varierar med innehåll**
```css
.card {
  padding: 16px;
  border-radius: 12px;
  gap: 12px;
}

.card-compact {
  padding: 12px;
  border-radius: 8px;
  gap: 8px;
}

.card-header {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
}
```

---

### 3. Border Radius System

**Filosofi:** Mjukt men inte överdrivet rundat

```css
/* Border radius tokens */
--radius-xs: 4px;   /* Små badges */
--radius-sm: 6px;   /* Buttons, tabs */
--radius-md: 8px;   /* Cards, inputs */
--radius-lg: 12px;  /* Modal, panels */
--radius-xl: 16px;  /* Hero sections */
--radius-full: 9999px; /* Avatars, pills */
```

**Användning per komponent:**
```css
.badge          { border-radius: var(--radius-xs); }   /* 4px */
.button         { border-radius: var(--radius-sm); }   /* 6px */
.input          { border-radius: var(--radius-md); }   /* 8px */
.card           { border-radius: var(--radius-lg); }   /* 12px */
.modal          { border-radius: var(--radius-xl); }   /* 16px */
.avatar         { border-radius: var(--radius-full); } /* Rund */
.search-pill    { border-radius: var(--radius-full); } /* Pill */
```

---

### 4. Shadow System (Subtilt!)

**Filosofi:** Skuggor ger djup, inte hårda borders

```css
/* Shadow tokens - MYCKET SUBTILA */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-md: 0 2px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.15);

/* Dark mode shadows - Använd ljusare färg */
.dark {
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 2px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.6);
}
```

**Användning:**
```css
.card               { box-shadow: var(--shadow-sm); }
.button:hover       { box-shadow: var(--shadow-md); }
.dropdown           { box-shadow: var(--shadow-lg); }
.modal              { box-shadow: var(--shadow-xl); }
```

---

## 🎨 FÄRGSYSTEM

### 1. Primary Colors - Rosa/Rose Palette

**Filosofi:** Premium rosa, inte neon, inte barnslig

```css
/* Pink/Rose - Primary brand colors */
--pink-50:  #fdf2f8;   /* Mycket ljus bakgrund */
--pink-100: #fce7f3;   /* Ljus bakgrund */
--pink-200: #fbcfe8;   /* Subtil accent */
--pink-300: #f9a8d4;   /* Hover states */
--pink-400: #f472b6;   /* Active states */
--pink-500: #ec4899;   /* Primary (Brand color) ⭐ */
--pink-600: #db2777;   /* Darker primary */
--pink-700: #be185d;   /* Strong accent */
--pink-800: #9d174d;   /* Very dark */
--pink-900: #831843;   /* Almost black */

/* Rose - Complementary */
--rose-500: #f43f5e;   /* Warmer accent */
--rose-600: #e11d48;   /* CTA buttons */
```

**Användning:**
```css
/* Brand elements */
.logo-accent        { color: var(--pink-500); }
.primary-button     { background: linear-gradient(to br, var(--pink-500), var(--rose-500)); }

/* Hover states */
.button:hover       { background: var(--pink-600); }

/* Backgrounds */
.highlight-bg       { background: var(--pink-50); }

/* Badges */
.badge-primary      { 
  background: var(--pink-100); 
  color: var(--pink-700);
  border: 1px solid var(--pink-200);
}
```

---

### 2. Neutral Colors - Grays Palette

**Filosofi:** Varma grå toner, inte kalla blå-grå

```css
/* Warm grays - Main neutral palette */
--gray-50:  #f9fafb;   /* Nästan vit bakgrund */
--gray-100: #f3f4f6;   /* Ljus bakgrund */
--gray-200: #e5e7eb;   /* Borders, dividers */
--gray-300: #d1d5db;   /* Disabled states */
--gray-400: #9ca3af;   /* Placeholders */
--gray-500: #6b7280;   /* Secondary text */
--gray-600: #4b5563;   /* Body text (light mode) */
--gray-700: #374151;   /* Headings */
--gray-800: #1f2937;   /* Dark headings */
--gray-900: #111827;   /* Almost black */
--gray-950: #030712;   /* True black */
```

**Dark Mode - Inverterade värden:**
```css
.dark {
  --gray-50:  #030712;   /* Mörk bakgrund */
  --gray-100: #111827;   /* Nästan svart */
  --gray-800: #f3f4f6;   /* Ljus text */
  --gray-900: #f9fafb;   /* Nästan vit text */
}
```

---

### 3. Semantic Colors - Status & Feedback

**Filosofi:** Pastelltoner, inte neon-varningar

```css
/* Success - Green */
--green-50:  #f0fdf4;
--green-100: #dcfce7;
--green-500: #10b981;   /* SLA Safe ✅ */
--green-600: #059669;

/* Warning - Amber/Yellow */
--amber-50:  #fffbeb;
--amber-100: #fef3c7;   /* SLA Warning bakgrund 🟡 */
--amber-500: #f59e0b;   /* SLA Warning border */
--amber-600: #d97706;

/* Danger - Red */
--red-50:   #fef2f2;
--red-100:  #fee2e2;
--red-500:  #ef4444;    /* SLA Breach 🔴 */
--red-600:  #dc2626;

/* Info - Blue */
--blue-50:  #eff6ff;
--blue-100: #dbeafe;
--blue-500: #3b82f6;
--blue-600: #2563eb;
```

**Användning (Pastell-stil):**
```css
/* SLA Safe badge */
.sla-safe {
  background: var(--green-50);
  color: var(--green-600);
  border: 1px solid var(--green-100);
}

/* SLA Warning badge */
.sla-warning {
  background: var(--amber-50);
  color: var(--amber-600);
  border: 1px solid var(--amber-100);
}

/* SLA Breach badge */
.sla-breach {
  background: var(--red-50);
  color: var(--red-600);
  border: 1px solid var(--red-100);
}
```

---

## ✏️ TYPOGRAFI

### 1. Font Stack

```css
/* System font stack - Native, snabb, professionell */
--font-sans: 
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  Arial,
  sans-serif;

/* Monospace (för kod) */
--font-mono:
  "SF Mono",
  Monaco,
  "Cascadia Code",
  "Courier New",
  monospace;
```

---

### 2. Font Sizes (Kompakt skala)

```css
/* Font size tokens - Kompakt men läsbart */
--text-xs:   11px;  /* Små badges, timestamps */
--text-sm:   12px;  /* Secondary text, captions */
--text-base: 13px;  /* Body text, buttons */
--text-md:   14px;  /* Headings (liten) */
--text-lg:   16px;  /* Headings (medium) */
--text-xl:   18px;  /* Headings (stor) */
--text-2xl:  20px;  /* Page titles */
--text-3xl:  24px;  /* Hero */
```

**Användning:**
```css
.timestamp      { font-size: var(--text-xs); }   /* 11px */
.caption        { font-size: var(--text-sm); }   /* 12px */
.body-text      { font-size: var(--text-base); } /* 13px */
.button         { font-size: var(--text-base); } /* 13px */
.card-title     { font-size: var(--text-md); }   /* 14px */
.section-title  { font-size: var(--text-lg); }   /* 16px */
.page-title     { font-size: var(--text-2xl); }  /* 20px */
```

---

### 3. Font Weights

```css
/* Font weight tokens */
--font-normal:    400;  /* Body text */
--font-medium:    500;  /* Buttons, labels */
--font-semibold:  600;  /* Headings */
--font-bold:      700;  /* Strong emphasis */

/* Användning */
.body-text      { font-weight: var(--font-normal); }
.button         { font-weight: var(--font-medium); }
.heading        { font-weight: var(--font-semibold); }
.emphasis       { font-weight: var(--font-bold); }
```

---

### 4. Line Heights

```css
/* Line height tokens */
--leading-tight:  1.25;  /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Long-form content */

/* Användning */
.heading        { line-height: var(--leading-tight); }
.body-text      { line-height: var(--leading-normal); }
.article        { line-height: var(--leading-relaxed); }
```

---

## 🎭 KOMPONENTER - Anatomi & Stil

### 1. Button - Tre Varianter

#### **Primary Button (Gradient)**
```css
.button-primary {
  background: linear-gradient(to bottom right, var(--pink-500), var(--rose-500));
  color: white;
  font-weight: var(--font-medium);
  border: none;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
}

.button-primary:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.button-primary:active {
  transform: translateY(0);
}
```

#### **Secondary Button (Outline)**
```css
.button-secondary {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  font-weight: var(--font-medium);
  transition: all 0.2s;
}

.button-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}
```

#### **Ghost Button (Minimal)**
```css
.button-ghost {
  background: transparent;
  color: var(--gray-600);
  border: none;
  font-weight: var(--font-normal);
  transition: all 0.2s;
}

.button-ghost:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}
```

---

### 2. Badge - Pastell Stil

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 20px;
  padding: 2px 8px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-xs);
  transition: all 0.2s;
}

/* Variants */
.badge-pink {
  background: var(--pink-50);
  color: var(--pink-700);
  border: 1px solid var(--pink-200);
}

.badge-gray {
  background: var(--gray-100);
  color: var(--gray-600);
  border: 1px solid var(--gray-200);
}

.badge-green {
  background: var(--green-50);
  color: var(--green-700);
  border: 1px solid var(--green-200);
}
```

---

### 3. Card - Med skugga

```css
.card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--gray-300);
}

/* Dark mode */
.dark .card {
  background: var(--gray-800);
  border-color: var(--gray-700);
}
```

---

### 4. Input - Subtil stil

```css
.input {
  width: 100%;
  height: 36px;
  padding: 8px 12px;
  font-size: var(--text-base);
  color: var(--gray-900);
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  background: white;
  border-color: var(--pink-500);
  box-shadow: 0 0 0 3px var(--pink-500) / 10%;
}

.input::placeholder {
  color: var(--gray-400);
}
```

---

### 5. Avatar - Perfekt rund

```css
.avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  border: 2px solid var(--gray-200);
  overflow: hidden;
  transition: all 0.2s;
}

.avatar:hover {
  border-color: var(--pink-500);
  box-shadow: 0 0 0 2px var(--pink-500) / 20%;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

### 6. Dropdown/Modal - Layered

```css
.dropdown {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-2);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
}

.dropdown-item {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  transition: all 0.15s;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--gray-100);
}

.dropdown-separator {
  height: 1px;
  background: var(--gray-200);
  margin: var(--space-2) 0;
}
```

---

## ✨ INTERAKTIONER & ANIMATIONER

### 1. Transition Standards

```css
/* Standard transitions - Snabba men smooth */
--transition-fast:   0.15s ease;
--transition-normal: 0.2s ease;
--transition-slow:   0.3s ease;

/* Användning */
.button {
  transition: all var(--transition-normal);
}

.dropdown {
  transition: opacity var(--transition-fast),
              transform var(--transition-fast);
}
```

---

### 2. Hover States - Subtila

```css
/* Regel: Aldrig mer än 2-3px movement */
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* Färgbyten istället för stora rörelser */
.nav-tab:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}
```

---

### 3. Focus States - Accessibility

```css
/* Synlig focus ring - VIKTIGT för a11y */
.button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--pink-500) / 30%;
}

.input:focus {
  outline: none;
  border-color: var(--pink-500);
  box-shadow: 0 0 0 3px var(--pink-500) / 10%;
}
```

---

### 4. Loading States

```css
/* Skeleton loader */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 0%,
    var(--gray-100) 50%,
    var(--gray-200) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-200);
  border-top-color: var(--pink-500);
  border-radius: var(--radius-full);
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

### 5. Expand/Collapse - Smooth

```css
/* Accordion/Collapsible */
.collapsible-content {
  overflow: hidden;
  transition: height var(--transition-normal);
}

.collapsible-content[data-state="open"] {
  animation: slideDown 0.2s ease;
}

.collapsible-content[data-state="closed"] {
  animation: slideUp 0.2s ease;
}

@keyframes slideDown {
  from { height: 0; opacity: 0; }
  to { height: var(--radix-collapsible-content-height); opacity: 1; }
}

@keyframes slideUp {
  from { height: var(--radix-collapsible-content-height); opacity: 1; }
  to { height: 0; opacity: 0; }
}
```

---

## 🎯 IKONER - Stil & Användning

### 1. Icon Library

**Vi använder:** Lucide React (0.487.0)

**Varför?**
- Konsistent stil
- 14px, 16px, 20px, 24px storlekar
- Lätta att färglägga
- Moderna, minimalistiska

```tsx
import { Mail, User, Settings, Search } from 'lucide-react';

<Mail className="h-4 w-4" />       {/* 16px */}
<User className="h-5 w-5" />       {/* 20px */}
<Settings className="h-6 w-6" />   {/* 24px */}
```

---

### 2. Icon Sizes per Kontext

```css
/* Icon size tokens */
--icon-xs: 12px;   /* Tiny badges */
--icon-sm: 14px;   /* Buttons, tabs */
--icon-md: 16px;   /* Default */
--icon-lg: 20px;   /* Headers */
--icon-xl: 24px;   /* Feature icons */

/* Användning */
.nav-tab-icon     { width: var(--icon-sm); height: var(--icon-sm); }
.button-icon      { width: var(--icon-sm); height: var(--icon-sm); }
.card-icon        { width: var(--icon-lg); height: var(--icon-lg); }
```

---

### 3. Icon Colors

```css
/* Ikoner ärver färg från parent */
.icon {
  color: currentColor; /* VIKTIGT! */
}

/* Användning */
.text-gray-600 .icon { color: var(--gray-600); }
.text-pink-500 .icon { color: var(--pink-500); }

/* Hover states */
.button:hover .icon {
  color: var(--pink-600);
}
```

---

## 📱 RESPONSIVITET

### 1. Breakpoints

```css
/* Tailwind-style breakpoints */
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

**Användning (Mobile-first):**
```css
/* Mobile först */
.container {
  padding: var(--space-4);
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
  }
}
```

---

### 2. Touch Targets (Mobil)

**Regel:** Minimum 44x44px för touch targets

```css
/* Desktop button */
.button {
  height: 36px;
  padding: 8px 16px;
}

/* Mobile button - Större */
@media (max-width: 768px) {
  .button {
    height: 44px;
    padding: 12px 20px;
  }
}
```

---

## 🌓 DARK MODE

### 1. Color Inversion Strategy

```css
/* Light mode */
:root {
  --background: #ffffff;
  --foreground: #111827;
}

/* Dark mode - Smart inversion */
.dark {
  --background: #111827;   /* Nästan svart */
  --foreground: #f9fafb;   /* Nästan vit */
  
  /* Inte 100% vit/svart - mjukare */
}
```

---

### 2. Komponent Anpassningar

```css
/* Card i dark mode */
.dark .card {
  background: var(--gray-800);  /* Mörkare än bakgrund */
  border-color: var(--gray-700);
}

/* Shadows i dark mode - Mörkare */
.dark .card {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

/* Input i dark mode */
.dark .input {
  background: var(--gray-900);
  border-color: var(--gray-700);
  color: var(--gray-100);
}
```

---

## 📋 DESIGN CHECKLIST

### När du applicerar denna design på ett annat projekt:

#### ✅ **Spacing & Layout**
- [ ] Använd 8px grid (4px, 8px, 12px, 16px...)
- [ ] Header: 40px höjd
- [ ] Navigation tabs: 32px höjd
- [ ] Buttons: 28px (sm), 36px (md), 44px (lg)
- [ ] Cards: 16px padding
- [ ] Gap mellan element: 8px-12px

#### ✅ **Colors**
- [ ] Primary: Pink/Rose gradient (#ec4899 → #f43f5e)
- [ ] Neutrals: Warm grays (inte blå-grå)
- [ ] Status: Pastell badges (ljus bakgrund + mörk text)
- [ ] Borders: Gray-200 (#e5e7eb)

#### ✅ **Typography**
- [ ] System fonts (-apple-system, etc.)
- [ ] Base size: 13px
- [ ] Small: 12px
- [ ] Large: 16px
- [ ] Weight: 400 (normal), 500 (medium), 600 (semibold)
- [ ] Line height: 1.5 för body text

#### ✅ **Border Radius**
- [ ] Small (badges): 4px
- [ ] Buttons/tabs: 6px
- [ ] Cards: 12px
- [ ] Modals: 16px
- [ ] Avatars: 9999px (rund)

#### ✅ **Shadows**
- [ ] Subtila (max opacity: 0.15)
- [ ] Small: rgba(0,0,0,0.08)
- [ ] Medium: rgba(0,0,0,0.1)
- [ ] Large: rgba(0,0,0,0.12)

#### ✅ **Icons**
- [ ] Lucide React library
- [ ] Small: 14px
- [ ] Medium: 16px
- [ ] Large: 20px
- [ ] Color: currentColor (ärv från parent)

#### ✅ **Animations**
- [ ] Transitions: 0.2s ease
- [ ] Hover: translateY(-1px to -2px)
- [ ] Focus rings: 3px spread, 10-30% opacity
- [ ] Loading: Skeleton gradients

#### ✅ **Responsiveness**
- [ ] Mobile-first approach
- [ ] Touch targets: min 44x44px
- [ ] Breakpoints: 640px, 768px, 1024px

#### ✅ **Dark Mode**
- [ ] Smart color inversion
- [ ] Mörkare shadows (opacity +0.1-0.2)
- [ ] Inte 100% svart/vit
- [ ] Testa kontrast (WCAG AA)

---

## 🎨 SNABB SAMMANFATTNING

**"Den här känslan" handlar om:**

1. **Kompakthet utan trängsel**
   - Allt använder 8px-grid
   - Tight spacing (8-16px)
   - Men alltid andrum (12px+ mellan sektioner)

2. **Mjukhet utan fluffighet**
   - Rundade hörn (4-16px)
   - Subtila skuggor (max 15% opacity)
   - Pastellfärger för status

3. **Premium utan flash**
   - Pink/Rose gradient som accent
   - Varma grå toner
   - System fonts (native feel)

4. **Responsivitet med intelligens**
   - Progressive disclosure
   - Expand/collapse smooth
   - Touch-friendly på mobil

5. **Tillgänglighet inbyggt**
   - Synliga focus states
   - WCAG AA kontrast
   - Keyboard navigation

---

## 💼 HUR KOMMUNICERA DETTA

### Till Designers:
```
"Vi vill ha samma visuella språk som HairTP Clinic:
- Pink/Rose (#ec4899) som primary
- Warm grays för neutrals
- 8px spacing grid
- Rundade hörn (4-16px)
- Subtila skuggor (max 15% opacity)
- System fonts (13px base)
- Pastell badges för status
- Lucide icons (14-20px)

Referens: DESIGN-LANGUAGE-SPECIFICATION.md"
```

### Till Utvecklare:
```
"Använd samma design tokens som HairTP:
- Import våra CSS variables från theme.css
- Följ spacing tokens (--space-2, --space-4, etc.)
- Använd shadow tokens (--shadow-sm, --shadow-md)
- Border radius tokens (--radius-sm, --radius-lg)
- Color tokens (--pink-500, --gray-600, etc.)

Se: DESIGN-LANGUAGE-SPECIFICATION.md för alla tokens"
```

### Till Stakeholders:
```
"Samma premium-känsla som HairTP Clinic:
- Elegant, professionell design
- Kompakt men luftig
- Rosa/grå färgpalett (varumärke)
- Smooth animationer
- Fungerar på alla enheter
- Tillgänglig för alla användare

Visuell referens: HairTP Clinic prototyp"
```

---

## 📦 EXPORT DESIGN TOKENS

### CSS Variables (Copy-paste ready)

```css
:root {
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Colors - Pink */
  --pink-50: #fdf2f8;
  --pink-500: #ec4899;
  --pink-600: #db2777;
  --rose-500: #f43f5e;
  
  /* Colors - Gray */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-600: #4b5563;
  --gray-900: #111827;
  
  /* Radius */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 2px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.12);
  
  /* Typography */
  --text-xs: 11px;
  --text-sm: 12px;
  --text-base: 13px;
  --text-lg: 16px;
  
  /* Transitions */
  --transition-normal: 0.2s ease;
}
```

---

**Med denna specifikation kan du återskapa exakt samma visuella känsla i vilket projekt som helst!** 🎨✨

*Version 1.0 - 2026-03-16*
