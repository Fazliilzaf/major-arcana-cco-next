# CCO Typography System - Standardiserat

## 📐 Typografi-Hierarki

### **Rubriker (Headers)**
- **H1** - Huvudrubriker (Dialog-titlar, Sidtitlar)
  - Klass: `text-[14px] font-bold`
  - Användning: "Smart Anteckning", "Konversation", "Kundprofil"
  
- **H2** - Sektionsrubriker (Stora sektioner)
  - Klass: `text-[12px] font-bold`
  - Användning: "Kunddetaljer", "Behandlingshistorik", "Meddelanden"
  
- **H3** - Underrubriker (Sub-sektioner)
  - Klass: `text-[11px] font-bold`
  - Användning: "Senaste aktivitet", "Rekommenderade åtgärder"
  
- **H4** - Små rubriker (Grupperingar)
  - Klass: `text-[10px] font-bold`
  - Användning: "Detaljer", "Inställningar", kort-titlar

### **Brödtext (Body)**
- **Body Large** - Stor brödtext
  - Klass: `text-[10px]`
  - Användning: Meddelandeinnehåll, viktiga texter
  
- **Body Regular** - Normal brödtext
  - Klass: `text-[9px]`
  - Användning: Standardtext, beskrivningar
  
- **Body Small** - Liten brödtext
  - Klass: `text-[8px]`
  - Användning: Hjälptext, mindre viktig info

### **Labels & Meta**
- **Label** - Etiketter
  - Klass: `text-[8px] font-bold` eller `text-[8px] font-medium`
  - Användning: "Namn:", "Status:", form-labels
  
- **Caption** - Bildtexter
  - Klass: `text-[8px]`
  - Användning: Förklaringar under inputs
  
- **Tiny/Meta** - Metadata
  - Klass: `text-[7px]`
  - Användning: Timestamps, badges, små taggar

### **Buttons**
- **Primary Button Text**: `text-[10px] font-bold`
- **Secondary Button Text**: `text-[10px] font-medium`
- **Small Button Text**: `text-[9px] font-medium`

---

## 🎯 Komponent-Mappning

### **enhanced-conversation-detail.tsx**
- Dialog-titel: H1 (14px bold)
- Meddelande-innehåll: Body Large (10px)
- Timestamps: Tiny (7px)
- Kund-namn: H3 (11px bold)

### **progressive-message-list.tsx**
- Ämnesrad: H4 (10px bold)
- Preview-text: Body Regular (9px)
- Metadata: Tiny (7px)

### **customer-intelligence-sidebar.tsx**
- Tab-titlar: H4 (10px bold)
- Sektionsrubriker: Label (8px bold uppercase)
- Data-värden: Body Regular (9px)
- Badges: Tiny (7px)

### **response-studio-modal.tsx**
- Dialog-titel: H1 (14px bold)
- Sektionsrubriker: Label (8px bold uppercase)
- Textinnehåll: Body Large (10px)
- Hjälptext: Body Small (8px)

### **notes-dialog.tsx**
- Dialog-titel: H1 (14px bold)
- Kategori-titlar: H4 (10px bold)
- Labels: Label (8px bold uppercase)
- Innehåll: Body Large (10px)
- Hjälptext: Tiny (7px)

---

## ✅ Implementering

Alla klasser ska använda Tailwind v4 syntax:
- `text-[14px]` - exakt pixelstorlek
- `font-bold` - bold weight
- `font-medium` - medium weight
- `leading-tight` - för kompakt line-height
