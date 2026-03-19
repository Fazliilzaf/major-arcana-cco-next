# ✅ TOGGLEABLE FILTERS - KLART!

## 🎯 VAD JAG HAR GJORT:

### **1. FLYTTAT ALLA FILTER TILL SUB-HEADER**

**Före:**
```
SUB-HEADER: Hair TP | 2 agera nu | 1 bokningsåkara | etc.
WORKLIST PANEL:
  - SPARADE VYER: Alla 7 | Oågda 1 | etc.
  - FOLLOW-UP: Alla uppföljningar 7 | Idag 5 | etc.
```
→ **DUBBELT OCH FÖRVIRRANDE!**

**Efter:**
```
SUB-HEADER (TOGGLEABLE):
  [Hair TP] [Sprint 3] [Agera nu 2↓] [Bokningsåkara 1↓]
  [Idag 5↓] [Imorgon 1↓] [Hög risk 2↓] [Oågda 1↓]

WORKLIST PANEL (RENARE):
  - LISTLÄGE: Normal | Compact | Progressive | Open
  - SPRINT BOX (conditional)
  - Meddelandelista (filtrerad)
```
→ **EN PLATS FÖR ALLT!**

---

## 📦 NYA FILER SKAPADE:

### **1. ToggleableFilterPills** 
`/src/app/components/toggleable-filter-pills.tsx`

**Funktioner:**
- ✅ Klickbara filter-badges
- ✅ Toggle på/av för att aktivera/avaktivera
- ✅ Chevron (↓) för att expandera/kollapsa (framtida funktion)
- ✅ Aktiv filter = rosa gradient
- ✅ Inaktiv filter = färgkodad (röd, blå, amber, lila, grön)
- ✅ Dynamisk räkning (antal meddelanden per filter)

**Beteende:**
```tsx
// Klicka på "Sprint 3" → aktiveras (rosa)
// Klicka igen → avaktiveras (tillbaka till grön)
// Multi-select: Flera filter aktiva samtidigt
// "Alla trådar" cleara alla andra filter
```

---

### **2. SimplifiedWorklistPanel** 
`/src/app/components/simplified-worklist-panel.tsx`

**Förändringar från ursprungliga WorklistPanel:**
- ❌ **TA BORT:** SPARADE VYER sektion
- ❌ **TA BORT:** FOLLOW-UP sektion  
- ❌ **TA BORT:** Beslutsvy/Ägarvy tabs
- ✅ **BEHÅLL:** LISTLÄGE (Normal, Compact, Progressive, Open)
- ✅ **BEHÅLL:** Sprint box (conditional - visas bara när Sprint/Agera nu aktivt)
- ✅ **BEHÅLL:** Meddelandelista

**Filtrering:**
```tsx
// activeFilters = ["sprint", "high-risk"]
// → Visar bara meddelanden med tags: sprint ELLER high-risk

// activeFilters = ["all"]
// → Visar alla meddelanden
```

---

### **3. InboxPageFinal** 
`/src/app/pages/inbox-page-final.tsx`

**State Management:**
```tsx
const [activeFilters, setActiveFilters] = useState<string[]>(["all"]);
const [expandedFilters, setExpandedFilters] = useState<string[]>([]);

// Toggle filter on/off
handleToggleFilter(filterId)

// Expandera/kollapsa filter (framtida funktion)
handleToggleExpand(filterId)

// Conditional Sprint Box
showSprintBox = activeFilters.includes("sprint") || activeFilters.includes("act-now")
```

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│ TOGGLEABLE FILTER PILLS (Sub-header)                  │
├──────────┬────────────────────────┬────────────────────┤
│ WORKLIST │ CONVERSATION           │ SVARSSTUDIO        │
│          │                        │ ────────────────   │
│ Listmode │ Varför i fokus         │ CUSTOMER           │
│ Sprint   │ Action cards           │ INTELLIGENCE       │
│ Lista... │ Meddelanden            │                    │
└──────────┴────────────────────────┴────────────────────┘
```

---

### **4. Språkfiler (för framtida användning)**
`/src/app/i18n/sv.ts` och `/src/app/i18n/en.ts`

**Struktur:**
```typescript
export const sv = {
  header: {
    sprint: "Sprint",
    advancedSearch: "Avancerad sök",
    statistics: "Statistik",
    shortcuts: "Kortkommando",
  },
  filters: {
    all: "Alla trådar",
    actNow: "Agera nu",
    bookable: "Bokningsåkara",
    today: "Idag",
    tomorrow: "Imorgon",
    highRisk: "Hög risk",
    unassigned: "Oågda",
  },
  worklist: {
    title: "INKORG Worklist",
    listMode: "LISTLÄGE",
    normal: "Normal",
    compact: "Kompakt",
    progressive: "Progressiv",
    open: "Öppen",
  },
  // ... mer
};
```

**Not:** För närvarande används hårdkodade svenska strängar i komponenterna, men språkfilerna är redo för framtida i18n-implementation.

---

## 🎨 DESIGN & FÄRGER:

### **Filter Badge States:**

**1. AKTIV (klickad):**
```css
bg-gradient-to-r from-pink-500 to-rose-500
text-white
border-pink-600
shadow-sm
```

**2. INAKTIV - Röd (Agera nu, Hög risk):**
```css
bg-red-100 dark:bg-red-950
text-red-800 dark:text-red-300
border-red-300 dark:border-red-700
hover:bg-red-200
```

**3. INAKTIV - Blå (Bokningsåkara):**
```css
bg-blue-100 dark:bg-blue-950
text-blue-800 dark:text-blue-300
border-blue-300 dark:border-blue-700
```

**4. INAKTIV - Amber (Idag, Imorgon):**
```css
bg-amber-100 dark:bg-amber-950
text-amber-800 dark:text-amber-300
border-amber-300 dark:border-amber-700
```

**5. INAKTIV - Lila (Oågda, Medicinsk):**
```css
bg-purple-100 dark:bg-purple-950
text-purple-800 dark:text-purple-300
border-purple-300 dark:border-purple-700
```

**6. INAKTIV - Grön (Sprint):**
```css
bg-emerald-100 dark:bg-emerald-950
text-emerald-800 dark:text-emerald-300
border-emerald-300 dark:border-emerald-700
```

---

## 🔄 FILTER LOGIC:

### **Single vs Multi Select:**

**IMPLEMENTERAD:** Multi-select (flera filter aktiva samtidigt)

```tsx
// Exempel:
activeFilters = ["sprint", "high-risk"]
→ Visar meddelanden med tags: sprint ELLER high-risk

activeFilters = ["today", "bookable"]
→ Visar meddelanden med tags: today ELLER bookable

// Special case:
activeFilters = ["all"]
→ Visar ALLA meddelanden
```

**Toggle Behavior:**
```tsx
1. Klicka på "Agera nu" → lägg till i activeFilters
2. Klicka igen på "Agera nu" → ta bort från activeFilters
3. Om inga filter aktiva → sätt "all" som default
4. Klicka på "all" → rensa alla andra filter
```

---

## 📊 MESSAGE TAGGING:

**Varje meddelande har `tags` array:**

```tsx
{
  id: "1",
  sender: "Anna Karlsson",
  tags: ["sprint", "act-now", "today", "high-risk"],
  // ... rest of message
}
```

**Filtrering:**
```tsx
filteredMessages = allMessages.filter((msg) => {
  if (activeFilters.includes("all")) return true;
  return activeFilters.some((filter) => msg.tags.includes(filter));
});
```

---

## 🚀 ANVÄNDNING:

### **1. Öppna appen:**
```
http://localhost:5173/
```

### **2. Se nya filter-badges:**
- **Hair TP Clinic** (svart, inte clickbar)
- **Sprint 3** (grön)
- **Agera nu 2** (röd)
- **Bokningsåkara 1** (blå)
- **Idag 5** (amber)
- **Imorgon 1** (amber)
- **Hög risk 2** (röd)
- **Oågda 1** (lila)
- **Medicinsk granskning 1** (lila)
- **Admin 1** (grå)

### **3. Klicka på badges för att filtrera:**

**Exempel 1:**
```
Klicka "Sprint 3" →
  - Badge blir rosa
  - Sprint box visas
  - Lista visar 3 meddelanden (sprint-taggade)
```

**Exempel 2:**
```
Klicka "Agera nu 2" →
  - Badge blir rosa
  - "AGERA NU" header visas i listan
  - Lista visar 2 meddelanden
```

**Exempel 3:**
```
Klicka "Sprint 3" OCH "Hög risk 2" →
  - Båda badges rosa
  - Lista visar meddelanden med sprint ELLER high-risk tags
  - (I detta fall: 3 unika meddelanden)
```

### **4. Avaktivera filter:**
```
Klicka på aktiv badge igen →
  - Badge tillbaka till original färg
  - Meddelanden uppdateras
```

---

## 🎯 FÖRDELAR MED NYA SYSTEMET:

### **✅ EN PLATS FÖR ALLT:**
- Alla filter i sub-header
- Ingen duplicering
- Enklare att hitta

### **✅ TOGGLEBART:**
- Klicka för att aktivera/avaktivera
- Tydlig visuell feedback (rosa = aktiv)
- Multi-select support

### **✅ RENARE WORKLIST:**
- Mer plats för meddelanden
- Mindre clutter
- Fokus på innehåll

### **✅ CONDITIONAL SPRINT BOX:**
- Visas bara när relevant
- Tar inte plats annars
- Dynamisk räkning

### **✅ DARK MODE:**
- Alla badges fungerar i dark mode
- Konsekvent färgschema
- Bra kontrast

---

## 📝 FRAMTIDA FÖRBÄTTRINGAR:

### **1. Expandera/Kollapsa Funktionalitet:**
```tsx
// När chevron (↓) klickas:
onToggleExpand(filterId)

// Visa en dropdown med fler alternativ:
- "Visa bara olästa"
- "Sortera efter tid"
- "Gruppera efter avsändare"
```

### **2. Spara Filter Preferenser:**
```tsx
// LocalStorage persistence
localStorage.setItem('activeFilters', JSON.stringify(activeFilters))

// Återställ vid reload
useEffect(() => {
  const saved = localStorage.getItem('activeFilters')
  if (saved) setActiveFilters(JSON.parse(saved))
}, [])
```

### **3. Keyboard Shortcuts:**
```tsx
// Cmd/Ctrl + 1-9 för att togglea filter
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1
      onToggleFilter(filters[index].id)
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

### **4. Filter Kombinationer (Sparade Vyer):**
```tsx
// Spara ofta använda kombinationer:
savedViews = [
  { name: "Akut arbete", filters: ["sprint", "act-now", "high-risk"] },
  { name: "Dagens uppgifter", filters: ["today", "bookable"] },
  { name: "Uppföljning", filters: ["tomorrow", "waiting-reply"] },
]
```

### **5. Drag & Drop Sortering:**
```tsx
// Låt användaren ordna filter-badges
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="filters">
    {/* ... badges */}
  </Droppable>
</DragDropContext>
```

---

## 🔧 TEKNISK IMPLEMENTATION:

### **State Flow:**

```
InboxPageFinal
  ├── activeFilters: string[] (state)
  ├── expandedFilters: string[] (state)
  │
  ├── ToggleableFilterPills
  │   ├── onToggleFilter(filterId) → update activeFilters
  │   └── onToggleExpand(filterId) → update expandedFilters
  │
  └── SimplifiedWorklistPanel
      ├── activeFilters (prop)
      ├── showSprintBox (derived from activeFilters)
      └── filteredMessages (computed from activeFilters)
```

### **Key Functions:**

**handleToggleFilter:**
```tsx
const handleToggleFilter = (filterId: string) => {
  setActiveFilters((prev) => {
    // Special case: "all" clears other filters
    if (filterId === "all") {
      return ["all"];
    }

    // Remove "all" if present and clicking another filter
    if (prev.includes("all")) {
      return [filterId];
    }

    // Toggle the filter
    if (prev.includes(filterId)) {
      const newFilters = prev.filter((f) => f !== filterId);
      return newFilters.length === 0 ? ["all"] : newFilters;
    } else {
      return [...prev, filterId];
    }
  });
};
```

**Message Filtering:**
```tsx
const filteredMessages = allMessages.filter((msg) => {
  if (activeFilters.length === 0 || activeFilters.includes("all")) {
    return true;
  }
  return activeFilters.some((filter) => msg.tags.includes(filter));
});
```

---

## ✅ CHECKLISTA:

- [x] Skapa ToggleableFilterPills komponent
- [x] Skapa SimplifiedWorklistPanel (ta bort duplicerade filter)
- [x] Skapa InboxPageFinal med state management
- [x] Implementera filter toggle logic
- [x] Implementera message filtering
- [x] Conditional Sprint Box
- [x] Färgkodning av filter badges
- [x] Aktiv state (rosa gradient)
- [x] Dark mode support
- [x] Uppdatera routes för att använda nya sidan
- [x] Språkfiler (sv.ts, en.ts) för framtida i18n
- [x] Header med språkväxlare (Globe icon)
- [x] Dokumentation

---

## 🎉 RESULTAT:

**DET FUNGERAR!**

1. ✅ **EN plats för filter** (sub-header)
2. ✅ **Togglebart** (klicka på/av)
3. ✅ **Visuell feedback** (rosa = aktiv)
4. ✅ **Renare worklist** (mer plats)
5. ✅ **Conditional sprint box**
6. ✅ **Dark mode**
7. ✅ **Multi-select support**
8. ✅ **Dynamisk räkning**

**Öppna appen och testa! 🚀**
