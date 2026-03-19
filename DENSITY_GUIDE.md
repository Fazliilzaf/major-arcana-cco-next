# 📊 View Density Control - User Guide

## Overview
View Density Control är en **kompakt dropdown** som kombinerar både View Density (hur kompakta mail är) och Density Mode (vilka prioriteter som visas) i EN enda kontroll.

**Resultat:** Sparar ~150px horisontellt utrymme i headern! 🎉

## UI Design
**Trigger Button:** `[Icon] [Mode Label] [ChevronDown]`
- Exempel: `[List Icon] Arbete ▼`
- Kompakt: Bara ~120px bred
- Visar nuvarande density icon + mode label

**Dropdown:** 264px bred, två sektioner
1. **Vy-täthet** (View Density) - ~8-30 mail
2. **Arbetsläge** (Density Mode) - Fokus/Arbete/Översikt

## Tre Lägen

### 🏠 Comfortable (Standard)
**~8-12 meddelanden synliga**

- **Avatar:** 44px (stor)
- **Padding:** 12px vertikal
- **Info:** All metadata synlig
- **Features:**
  - ✅ Sentiment emojis
  - ✅ Internal notes
  - ✅ AI suggested replies
  - ✅ Upsell opportunities
  - ✅ Alla badges
  - ✅ Referral source
  - ✅ Interaction count

**Användningsfall:** Första gången du går igenom inbox, behöver se all kontext

---

### 📋 Compact (Balanserad)
**~15-20 meddelanden synliga**

- **Avatar:** 32px (medium)
- **Padding:** 8px vertikal
- **Info:** Kritisk metadata synlig
- **Features:**
  - ✅ Sentiment emojis
  - ✅ SLA status
  - ✅ Medical flags
  - ✅ Priority tags
  - ❌ Internal notes dolda
  - ❌ AI suggested replies dolda
  - ❌ Upsell opportunities dolda
  - ❌ Referral source dold

**Användningsfall:** Dagligt arbete, snabb överblick

---

### ⚡ Super Compact (Maximum throughput)
**~25-30 meddelanden synliga**

- **Avatar:** 24px (liten)
- **Padding:** 6px vertikal
- **Info:** Bara absolut nödvändig metadata
- **Features:**
  - ✅ SLA status
  - ✅ Medical flags
  - ✅ Priority tags
  - ❌ Sentiment emojis dolda
  - ❌ Alla "nice-to-have" badges dolda
  - ❌ Preview text dold

**Användningsfall:** När du behöver scanna MÅNGA mail snabbt, power users

---

## Teknisk Implementation

### Storage
- **localStorage key:** `cco-view-density`
- **Values:** `'comfortable'` | `'compact'` | `'super-compact'`
- **Default:** `'comfortable'`

### Component
```tsx
import { ViewDensityToggle } from './components/view-density-toggle';

<ViewDensityToggle onChange={setViewDensity} />
```

### Configuration Object
```tsx
const densityConfig = {
  comfortable: {
    avatarSize: 'h-11 w-11',
    padding: 'px-4 py-3',
    nameSize: 'text-[15px]',
    subjectSize: 'text-[14px]',
    showAllBadges: true,
    showSentiment: true,
    showInternalNotes: true,
    rowGap: 'gap-3',
    contentGap: 'mb-1',
  },
  compact: {
    avatarSize: 'h-8 w-8',
    padding: 'px-3 py-2',
    nameSize: 'text-[13px]',
    subjectSize: 'text-[12px]',
    showAllBadges: false,
    showSentiment: true,
    showInternalNotes: false,
    rowGap: 'gap-2.5',
    contentGap: 'mb-0.5',
  },
  'super-compact': {
    avatarSize: 'h-6 w-6',
    padding: 'px-3 py-1.5',
    nameSize: 'text-[12px]',
    subjectSize: 'text-[11px]',
    showAllBadges: false,
    showSentiment: false,
    showInternalNotes: false,
    rowGap: 'gap-2',
    contentGap: 'mb-0',
  },
};
```

## User Feedback
- **Toast notification** vid ändring
- **Visual state** i toggle-knapparna (rosa highlight + scale)
- **Tooltips** på varje knapp

## Industry Inspiration
- Gmail (Comfortable, Compact, Cozy)
- Linear (Default, Compact, Ultra compact)
- Notion (Default, Small, Very small)

## Performance
✅ Inga re-renders av meddelanden som inte visas
✅ Config object memoized per message
✅ localStorage synkad asynkront