# 🎨 Design Quick Reference - HairTP Clinic

## One-Page Cheat Sheet för att återskapa "den här känslan"

---

## 📏 STORLEKAR (px)

```
HEADER               40px höjd
NAVIGATION TABS      32px höjd
MESSAGE ITEM         60px höjd
BUTTON SMALL         28px höjd
BUTTON MEDIUM        36px höjd
BUTTON LARGE         44px höjd
AVATAR               36px × 36px
BADGE                20px höjd
ICON SMALL           14px × 14px
ICON MEDIUM          16px × 16px
ICON LARGE           20px × 20px
```

---

## 📐 SPACING (8px grid)

```
MINIMAL              4px   (--space-1)
SMALL                8px   (--space-2)
MEDIUM              12px   (--space-3)
STANDARD            16px   (--space-4)
LARGE               24px   (--space-6)
SECTION             32px   (--space-8)
```

---

## 🎨 FÄRGER

### Primary (Brand)
```
PINK-500            #ec4899  ⭐ MAIN BRAND COLOR
ROSE-500            #f43f5e  (Warmer accent)
```

### Neutrals
```
GRAY-50             #f9fafb  (Ljus bakgrund)
GRAY-100            #f3f4f6  (Cards, inputs)
GRAY-200            #e5e7eb  (Borders)
GRAY-600            #4b5563  (Text)
GRAY-900            #111827  (Headings)
```

### Status (Pastell)
```
GREEN-50 + GREEN-600    SLA Safe ✅
AMBER-50 + AMBER-600    SLA Warning 🟡
RED-50 + RED-600        SLA Breach 🔴
```

---

## ⚪ BORDER RADIUS

```
BADGES               4px   (--radius-xs)
BUTTONS/TABS         6px   (--radius-sm)
CARDS/INPUTS         8px   (--radius-md)
MODALS              12px   (--radius-lg)
AVATARS/PILLS     9999px  (--radius-full)
```

---

## 🌑 SHADOWS (Subtila!)

```
SMALL    0 1px 3px rgba(0,0,0,0.08)
MEDIUM   0 2px 6px rgba(0,0,0,0.1)
LARGE    0 4px 12px rgba(0,0,0,0.12)
```

---

## ✏️ TYPOGRAFI

### Font Family
```
System fonts:
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
```

### Sizes
```
SMALL (badges)        11px
MEDIUM (body)         13px  ⭐ DEFAULT
LARGE (headings)      16px
```

### Weights
```
NORMAL               400
MEDIUM (buttons)     500
SEMIBOLD (headings)  600
```

---

## 🎬 ANIMATIONER

### Transitions
```
STANDARD             0.2s ease
```

### Hover Effects
```
TRANSLATE           -1px to -2px (uppåt)
SHADOW              Öka från sm → md
```

### Focus Ring
```
BOX-SHADOW          0 0 0 3px [color]/30%
```

---

## 🎯 PRIMARY BUTTON (Signatur)

```css
background: linear-gradient(
  to bottom right,
  #ec4899,  /* pink-500 */
  #f43f5e   /* rose-500 */
);
color: white;
height: 36px;
padding: 8px 16px;
border-radius: 8px;
font-weight: 500;
box-shadow: 0 1px 3px rgba(0,0,0,0.08);

:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
```

---

## 🏷️ BADGE (Pastell Stil)

```css
background: #fdf2f8;    /* pink-50 */
color: #be185d;         /* pink-700 */
border: 1px solid #fbcfe8;  /* pink-200 */
height: 20px;
padding: 2px 8px;
font-size: 11px;
font-weight: 500;
border-radius: 4px;
```

---

## 📦 CARD

```css
background: white;
border: 1px solid #e5e7eb;  /* gray-200 */
border-radius: 12px;
padding: 16px;
box-shadow: 0 1px 3px rgba(0,0,0,0.08);

:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
```

---

## 🌓 DARK MODE

```css
:root {
  --background: #ffffff;
  --foreground: #111827;
}

.dark {
  --background: #111827;  /* Nästan svart */
  --foreground: #f9fafb;  /* Nästan vit */
}

/* Shadows mörkare i dark mode */
.dark .card {
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
```

---

## 🔍 DESIGN PRINCIPER

### 1. **Luftig men kompakt**
- 8px spacing grid
- Tight padding (12-16px)
- Men whitespace mellan sektioner (24-32px)

### 2. **Mjukt men distinkt**
- Rundade hörn (4-12px)
- Subtila skuggor (max 15% opacity)
- Pastellfärger för status

### 3. **Premium men inte flashig**
- Pink/Rose gradient som accent
- Varma grå toner
- System fonts (native feel)

### 4. **Responsive & Accessible**
- Mobile: 44x44px touch targets
- Focus rings: 3px, 30% opacity
- WCAG AA kontrast

---

## ✅ QUICK CHECKLIST

När du bygger nytt:

- [ ] Använd 8px grid för spacing
- [ ] Primary color: Pink (#ec4899)
- [ ] Border radius: 4-12px
- [ ] Shadows: max 15% opacity
- [ ] Font size: 13px base
- [ ] Font weight: 500 för buttons
- [ ] Transitions: 0.2s ease
- [ ] Icons: Lucide, 14-16px
- [ ] Pastell badges (ljus bg + mörk text)
- [ ] Dark mode support

---

## 🎨 CSS VARIABLES (Copy-Paste)

```css
:root {
  /* Spacing */
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  
  /* Colors */
  --pink-500: #ec4899;
  --rose-500: #f43f5e;
  --gray-200: #e5e7eb;
  --gray-600: #4b5563;
  
  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 2px 6px rgba(0,0,0,0.1);
  
  /* Typography */
  --text-sm: 12px;
  --text-base: 13px;
  --text-lg: 16px;
}
```

---

## 📸 VISUAL REFERENCE

```
┌─────────────────────────────────────┐
│ Header (40px)                       │  ← Kompakt
├─────────────────────────────────────┤
│ Tabs (32px)                         │  ← Små gaps
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Card (12px radius)           │  │
│  │ • 16px padding               │  │
│  │ • Gray-200 border            │  │
│  │ • Subtle shadow              │  │
│  │                              │  │
│  │ [Button: Pink gradient]      │  │  ← Accent
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘

Spacing: 8px, 12px, 16px, 24px
Colors: Pink accent + Warm grays
Shadows: Subtil (8-12% opacity)
Radius: 4-12px (mjukt)
```

---

## 🎯 "DEN HÄR KÄNSLAN" I TRE MENINGAR

1. **Kompakt men aldrig trångt** - 8px spacing grid ger tight layout med perfekt andrum
2. **Mjukt men professionellt** - Pastell badges, subtila skuggor, rundade hörn (4-12px)
3. **Premium accent** - Pink/Rose gradient (#ec4899 → #f43f5e) som brand color

---

**Print this. Pin it on your wall. Reference it daily.** 📌✨

*Quick Reference v1.0 - 2026-03-16*
