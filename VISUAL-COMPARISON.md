# 📊 VISUELL JÄMFÖRELSE: Nuvarande vs Gamla ConversationFocusPanel

## 🔍 ÖVERSIKT

| Aspekt | NUVARANDE (conversation-focus-panel.tsx) | GAMLA (enhanced-conversation-detail.tsx) |
|--------|------------------------------------------|------------------------------------------|
| **Header** | ❌ Ingen header | ✅ Header med titel + more-knapp |
| **Tabs** | ✅ Konversation, Kundhistorik, Historik | ✅ Konversation, Kundhistorik, Historik |
| **Konversationsvy** | ⚠️ Enkel bubblechat (2 meddelanden) | ✅ Timeline med avatarer (3 meddelanden) |
| **SLA indicators** | ❌ Ingen SLA-visning | ✅ SLA badges (safe/warning/breach) |
| **Stagnation detection** | ❌ Ingen stagnation | ✅ "48h inaktiv" badge med "Följ upp" knapp |
| **Message metadata** | ⚠️ Namn + tid endast | ✅ Namn, tid, intent, tone, priority, SLA status |
| **Timeline visual** | ❌ Ingen timeline | ✅ Vertikal timeline med dots + line |
| **Message styling** | ⚠️ Basic bubbles | ✅ Cards med borders, avatarer, metadata |
| **Footer info** | ❌ Ingen | ✅ "Tidigare bokningar (3), Senaste behandling, Kund sedan" |

---

## 📋 TAB: KONVERSATION

### NUVARANDE:
```
┌─────────────────────────────────────┐
│ [Konversation│Kundhistorik│Historik]│
├─────────────────────────────────────┤
│                                      │
│  👤 AK                               │
│  Anna Karlsson · 2026-04-22 11:42  │
│  ┌───────────────────────────────┐  │
│  │ Hej! Jag måste tyvärr ställa  │  │
│  │ in min tid imorgon...         │  │
│  └───────────────────────────────┘  │
│                                      │
│  👤 SL                               │
│  Sara Lindberg · 2026-04-20 14:30  │
│  ┌───────────────────────────────┐  │
│  │ Hej Anna! Din tid för PRP...  │  │
│  └───────────────────────────────┘  │
│                                      │
├─────────────────────────────────────┤
│ 📝 Intern operativ notis             │
│ Kunden kan endast efter 15:00...    │
├─────────────────────────────────────┤
│ [Boka] [Mallar]    [🌟 Svarsstudio] │
└─────────────────────────────────────┘
```

**Saknas:**
- ❌ SLA-status (safe/warning/breach)
- ❌ Stagnation detection (48h inaktiv)
- ❌ Intent + tone + priority metadata
- ❌ Timeline visual (dots + line)
- ❌ Profilbilder/avatarer
- ❌ Footer med "Tidigare bokningar, Senaste behandling"
- ❌ Message separator ("Senaste meddelande")
- ❌ Quick reply textarea (kompakt)

---

### GAMLA (enhanced-conversation-detail.tsx):
```
┌─────────────────────────────────────┐
│ Bokning av tid               [...]  │ ← HEADER
├─────────────────────────────────────┤
│ [Konversation│Kundhistorik│Historik]│
├─────────────────────────────────────┤
│ [🕐 SLA 45m] [⚠️ 48h inaktiv]       │ ← SLA + STAGNATION
│                                      │
│  ●─────────────────────────────     │ ← TIMELINE
│  │                                   │
│  📷 Johan Lagerström · 2026-04-22   │
│     [SLA Th · Hög]                  │
│     Intent: Bokning · Väntar på oss │ ← METADATA
│     ┌───────────────────────────┐   │
│     │ Hej, Jag vill boka in en  │   │
│     │ PrP-behandling...         │   │
│     └───────────────────────────┘   │
│  │                                   │
│  ●                                   │
│  │                                   │
│  📷 Egzona Krasniqi · 2026-04-22    │
│     ┌───────────────────────────┐   │
│     │ Hej Johan, Du kan träffa  │   │
│     │ oss fredag kl 09:00...    │   │
│     └───────────────────────────┘   │
│  │                                   │
│  ────── Senaste meddelande ──────   │ ← SEPARATOR
│  │                                   │
│  ●                                   │
│  📷 Johan Lagerström · Idag 10:58   │
│     ┌───────────────────────────┐   │
│     │ Fredag kl 09:00 passar    │   │
│     │ perfekt! 🙏               │   │
│     └───────────────────────────┘   │
│                                      │
│ 📄 Tidigare bokningar (3)            │ ← FOOTER INFO
│ 📅 Senaste behandling: 2025-01-14   │
│ 👤 Kund sedan: 2023                  │
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐ [✨]│ ← QUICK REPLY
│ │ Skriv ett snabbt svar...    │ │ │ │
│ └─────────────────────────────┘ [✉]│
│   [📅] [📄] [🌟 Svarsstudio]        │
└─────────────────────────────────────┘
```

**HAR:**
- ✅ Header med titel
- ✅ SLA badges (kompakt)
- ✅ Stagnation detection med action
- ✅ Timeline visual
- ✅ Profilbilder
- ✅ Metadata (intent, tone, priority)
- ✅ Footer info
- ✅ Quick reply textarea
- ✅ Message separator

---

## 📋 TAB: KUNDHISTORIK

### NUVARANDE:
```
┌─────────────────────────────────────┐
│ KONTAKTINFORMATION                   │
│ 📧 anna.karlsson@email.com          │
│ 📱 070-123 45 67                     │
│ 📍 Stockholm, Sverige                │
│                                      │
│ KUNDVÄRDE                            │
│ 💰 Total LTV: 89 500 kr             │
│ 📈 Genomsnittligt ordervärde: 22K   │
│ 🛍️ Antal behandlingar: 4 st         │
│                                      │
│ PREFERENSER                          │
│ 🏷️ Föredrar fredagar 09:00-12:00    │
│ 🏷️ Vill alltid ha Dr. Eriksson      │
│ 🏷️ Prefererad kanal: E-post         │
└─────────────────────────────────────┘
```

---

### GAMLA (enhanced-conversation-detail.tsx):
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ 📷 Johan Lagerström      [⭐VIP] │ │ ← PROFILE CARD
│ │ 📧 johan.lagerstrom@email.com   │ │
│ │ 📱 +46 70 123 45 67             │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌────────┬────────┬────────┐        │ ← STATS CARDS (3 col)
│ │ 🛍️ KÖP │💰 LTV  │⭐STATUS│        │
│ │   12   │  46K   │  VIP   │        │
│ │Behand. │Livstid │Återkom.│        │
│ └────────┴────────┴────────┘        │
│                                      │
│ KUNDINFORMATION                      │
│ 👤 Kund sedan: Mars 2023 (3 år)     │
│ 📈 Relation: Återkommande · Lojal   │
│ 🔥 Temperatur: Varm · Aktiv         │
│                                      │
│ TIDIGARE BOKNINGAR                   │
│ ┌─────────────────────────────────┐ │
│ │ 2025-01-14 · PrP behandling     │ │
│ │ 4 500 kr · [✓ Genomförd]        │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 2024-11-02 · Konsultation       │ │
│ │ 500 kr · [✓ Genomförd]          │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**SKILLNADER:**
- ✅ Profilbild med VIP badge
- ✅ 3-kolumns stats cards (visuellt starkare)
- ✅ "Temperatur" metric (Varm/Kall/etc)
- ✅ "Relation" status (Återkommande, Lojal)
- ✅ Bokningshistorik med hover-effekter
- ✅ Mer visuell hierarki

---

## 📋 TAB: HISTORIK

### NUVARANDE:
```
BOKNINGSHISTORIK

┌─────────────────────────────────────┐
│ PRP-behandling Serie 2/3            │
│ 2026-04-23 · Dr. Eriksson           │
│ 📦 Behandling          4 500 kr     │
│                    [🔴 Inställd]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ PRP-behandling Serie 1/3            │
│ 2025-12-15 · Dr. Eriksson           │
│ 📦 Behandling          4 500 kr     │
│                    [🟢 Genomförd]   │
└─────────────────────────────────────┘
```

**HAR:** ✅ Lista med bokningar (4 st)

---

### GAMLA (enhanced-conversation-detail.tsx):
```
Aktivitetshistorik
Fullständig logg över all kommunikation

  ●────────────────────────────
  │ ┌─────────────────────────┐
  │ │ 📧 E-post mottaget       │
  │ │ Johan svarade på bokning │
  │ │ Idag 10:58               │
  │ │ "Fredag kl 09:00..."     │
  │ └─────────────────────────┘
  │
  ●────────────────────────────
  │ ┌─────────────────────────┐
  │ │ 📧 E-post skickat        │
  │ │ Egzona skickade svar     │
  │ │ 2026-04-22 11:32         │
  │ └─────────────────────────┘
  │
  ●────────────────────────────
  │ ┌─────────────────────────┐
  │ │ 📅 Behandling genomförd  │
  │ │ PrP behandling slutförd  │
  │ │ 2025-01-14 10:00         │
  │ └─────────────────────────┘
  │
  ●────────────────────────────
  │ ┌─────────────────────────┐
  │ │ 📞 Samtal                │
  │ │ Uppföljningssamtal       │
  │ │ Längd: 12 min            │
  │ └─────────────────────────┘
```

**SKILLNADER:**
- ✅ ALLA kommunikationstyper (email, samtal, SMS, bokningar)
- ✅ Timeline visual med dots
- ✅ Färgkodade ikoner per typ
- ✅ Mer detaljerad information
- ✅ Kronologisk ordning

---

## 🎯 SAMMANFATTNING: VAD SAKNAS I NUVARANDE?

### **KONVERSATION-TAB:**
1. ❌ Header med titel
2. ❌ SLA badges (kompakt inline)
3. ❌ Stagnation detection (48h inaktiv + "Följ upp" knapp)
4. ❌ Timeline visual (dots + vertikal linje)
5. ❌ Profilbilder/avatarer
6. ❌ Metadata per meddelande (intent, tone, priority, SLA status)
7. ❌ Message separator ("Senaste meddelande")
8. ❌ Footer info ("Tidigare bokningar (3), Senaste behandling, Kund sedan")
9. ❌ Quick reply textarea (kompakt med AI-knapp inuti)

### **KUNDHISTORIK-TAB:**
1. ❌ Profilkort med bild + VIP badge
2. ❌ 3-kolumns stats cards (visuellt starkare)
3. ❌ "Temperatur" metric
4. ❌ "Relation" status
5. ❌ Hover-effekter på bokningar

### **HISTORIK-TAB:**
1. ❌ Fullständig aktivitetslogg (email + samtal + SMS + bokningar)
2. ❌ Timeline visual
3. ❌ Färgkodade ikoner per aktivitetstyp
4. ❌ Mer detaljerad information

---

## ✅ REKOMMENDATION

**Behåll allt som finns nu + lägg till:**

1. **Header** (från gamla)
2. **SLA + Stagnation badges** (från gamla)
3. **Timeline visual** (från gamla)
4. **Profilbilder** (från gamla)
5. **Metadata** (från gamla)
6. **Footer info** (från gamla)
7. **Quick reply textarea** (från gamla)
8. **3-kolumns stats** i Kundhistorik (från gamla)
9. **Fullständig aktivitetslogg** i Historik (från gamla)

**= KOMPLETT CCO FUNKTIONALITET** 🚀
