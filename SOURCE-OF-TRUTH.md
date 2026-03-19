# 📋 SOURCE OF TRUTH - HairTP CRM

**Senast uppdaterad:** 2026-03-19

Detta dokument definierar vilka filer som är den officiella källan till sanning i projektet.

---

## 🎯 **AKTIVA SIDOR (Pages)**

| Route | Fil | Status | Beskrivning |
|-------|-----|--------|-------------|
| `/` | `/src/app/pages/inbox-page-final.tsx` | ✅ **AKTIV** | Inkorg med togglebara filter, ultra-kompakt design |
| `/later` | `/src/app/pages/later-page.tsx` | ✅ **AKTIV** | Snoozade konversationer |
| `/sent` | `/src/app/pages/sent-page.tsx` | ✅ **AKTIV** | Skickade meddelanden |
| `/customers` | `/src/app/components/customer-identity-page.tsx` | ✅ **AKTIV** | Kundidentitet & CRM |
| `/analytics` | `/src/app/pages/analytics-page.tsx` | ✅ **AKTIV** | Analytics dashboard (ultra-kompakt) |
| `/integrations` | `/src/app/pages/integrations-page.tsx` | ✅ **AKTIV** | Integrationer |
| `/templates` | `/src/app/pages/template-studio-page.tsx` | ✅ **AKTIV** | Svarstudio & mallar |
| `/macros` | `/src/app/pages/macros-page.tsx` | ✅ **AKTIV** | Makron & automatisering |
| `/workflows` | `/src/app/pages/workflow-builder-page.tsx` | ✅ **AKTIV** | Arbetsflödesbyggare (ultra-kompakt) |
| `/settings` | `/src/app/pages/settings-page.tsx` | ✅ **AKTIV** | Inställningar (ultra-kompakt) |
| `/showcase` | `/src/app/pages/showcase-page.tsx` | ✅ **AKTIV** | Power features showcase |

---

## ❌ **DEPRECATED FILER (TA BORT)**

Dessa filer är gamla versioner och ska INTE användas:

| Fil | Ersätts av | Orsak |
|-----|-----------|--------|
| `/src/app/pages/inbox-page.tsx` | `inbox-page-final.tsx` | Gammal version utan togglebara filter |
| `/src/app/pages/inbox-page-new.tsx` | `inbox-page-final.tsx` | Mellanversion, ersatt av final |

**Åtgärd:** Dessa filer kommer att tas bort från projektet.

---

## 🏗️ **LAYOUT & ROUTING**

| Komponent | Fil | Beskrivning |
|-----------|-----|-------------|
| **Main Layout** | `/src/app/layouts/main-layout.tsx` | Huvudlayout med sidebar & navigation |
| **Router Config** | `/src/app/routes.tsx` | React Router konfiguration |
| **App Entry** | `/src/app/App.tsx` | Huvudapplikation med providers |

---

## 🧩 **CORE KOMPONENTER**

### **Inbox Components**
- `/src/app/components/inbox/conversation-list-compact.tsx` - ✅ Konversationslista
- `/src/app/components/inbox/conversation-detail-compact.tsx` - ✅ Konversationsdetaljer
- `/src/app/components/inbox/inbox-categories-dragdrop.tsx` - ✅ Drag & drop kategorier

### **Workflow Components**
- `/src/app/components/workflow/workflow-canvas.tsx` - ✅ Arbetsflödets canvas
- `/src/app/components/workflow/workflow-analytics.tsx` - ✅ ULTRA-KOMPAKT
- `/src/app/components/workflow/workflow-templates.tsx` - ✅ ULTRA-KOMPAKT
- `/src/app/components/workflow/workflow-testing.tsx` - ✅ ULTRA-KOMPAKT
- `/src/app/components/workflow/workflow-versions.tsx` - ✅ ULTRA-KOMPAKT
- `/src/app/components/workflow/workflow-autopilot.tsx` - ✅ ULTRA-KOMPAKT

### **Showcase/Power Features**
- `/src/app/components/command-palette.tsx` - ✅ KOMPAKT + SVENSKA
- `/src/app/components/snooze-modal.tsx` - ✅ KOMPAKT + SVENSKA
- `/src/app/components/collision-warning.tsx` - ✅ KOMPAKT + SVENSKA
- `/src/app/components/bulk-operations-bar.tsx` - ✅ Bulk-operationer
- `/src/app/components/saved-views-panel.tsx` - ✅ Sparade vyer
- `/src/app/components/ai-copilot.tsx` - ✅ AI-assistent
- `/src/app/components/macro-builder.tsx` - ✅ Makrobyggare
- `/src/app/components/customer-journey-timeline.tsx` - ✅ Kundresa

---

## 🎨 **DESIGN SYSTEM**

### **Spacing System (Ultra-Kompakt)**
```
Padding:    p-3, p-2.5, p-2
Gaps:       gap-3, gap-2, gap-1.5
Margins:    mb-3, mb-2, mb-1.5
```

### **Typography System**
```
Headers:    text-[14px], text-[12px]
Body:       text-[10px], text-[9px]
Labels:     text-[8px], text-[7px]
```

### **Component Sizes**
```
Icons:      h-4 w-4, h-3.5 w-3.5, h-3 w-3
Buttons:    py-1.5, py-1, px-2.5, px-2
Cards:      rounded-lg, border
```

---

## 📱 **CONTEXT & STATE**

| Context | Fil | Beskrivning |
|---------|-----|-------------|
| Language | `/src/app/context/language-context.tsx` | Svenska/Engelska |
| Theme | `/src/app/context/theme-context.tsx` | Light/Dark mode |
| Density | `/src/app/context/density-context.tsx` | Kompakt/Standard |
| Mailbox | `/src/app/context/mailbox-context.tsx` | Mailbox state |

---

## 🌍 **SPRÅK**

**Standard:** Svenska  
**Växling:** Via språkväljare i settings

Alla komponenter ska:
- Ha svenskt språk som standard
- Stödja engelsk toggle
- Använda svenska i alla nya features

---

## ✅ **KVALITETSKRAV**

### **Design Standards**
- ✅ Ultra-kompakt layout (40-50% mer info per skärm)
- ✅ Konsekvent spacing-system
- ✅ Responsiv design
- ✅ Dark mode support

### **Code Standards**
- ✅ TypeScript
- ✅ React hooks
- ✅ Tailwind CSS v4
- ✅ No prop-drilling (use contexts)

### **Features**
- ✅ Drag & drop (kategori-omorganisering)
- ✅ Togglebara filter
- ✅ SLA-hantering
- ✅ AI-recommendations
- ✅ Kundengagemang indicators

---

## 🚫 **REGLER**

### **DO:**
- ✅ Använd filer markerade som "AKTIV"
- ✅ Följ kompakt design-systemet
- ✅ Skriv på svenska som standard
- ✅ Använd contexts för state
- ✅ Implementera nya features ultra-kompakt

### **DON'T:**
- ❌ Använd deprecated filer
- ❌ Skapa nya inbox-varianter
- ❌ Bryt spacing-systemet
- ❌ Skriv nya features på engelska
- ❌ Använd stora paddings/gaps

---

## 📞 **FRÅGOR?**

Om något är oklart, följ denna prioritetsordning:
1. Detta dokument (SOURCE-OF-TRUTH.md)
2. Filen markerad som ✅ AKTIV i routes.tsx
3. Den senaste ultra-kompakta versionen

**Senaste stora uppdateringar:**
- 2026-03-19: Ultra-kompakt transformation av alla workflow-sidor
- 2026-03-19: Showcase power features kompaktifiering + svenskifiering
- 2026-03-19: Inbox kategori drag & drop fix

---

**🎯 Kom ihåg:** inbox-page-final.tsx är den enda riktiga inbox-sidan!
