# 📦 Export HairTP Clinic till Codex

Guide för att flytta projektet från Figma Make till Codex.

---

## 🎯 METOD 1: DOWNLOAD & UPLOAD (Enklast)

### Steg 1: Exportera från Figma Make

1. **I Figma Make:**
   - Klicka på **"..."** menyn (top right)
   - Välj **"Download as ZIP"** eller **"Export Project"**
   - Spara ZIP-filen lokalt

### Steg 2: Importera till Codex

1. **Öppna Codex**
2. **Skapa nytt projekt** eller öppna befintligt
3. **Ladda upp filerna:**
   ```
   - Packa upp ZIP-filen lokalt
   - Dra & släpp alla filer till Codex
   ELLER
   - Använd Codex upload-funktion
   ```

4. **Installera dependencies:**
   ```bash
   npm install
   ```

5. **Starta projektet:**
   ```bash
   npm run dev
   ```

---

## 🎯 METOD 2: VIA GITHUB (Rekommenderat)

### Steg 1: Skapa GitHub Repository

1. **Skapa nytt repo på GitHub:**
   ```
   - Gå till github.com
   - Klicka "New repository"
   - Namnge: "hairtp-clinic"
   - Public eller Private
   - Klicka "Create repository"
   ```

### Steg 2: Exportera från Figma Make

1. **Ladda ner projektet som ZIP**
2. **Packa upp lokalt**

### Steg 3: Push till GitHub

```bash
# Navigera till projekt-mappen
cd hairtp-clinic

# Initiera git (om inte redan gjort)
git init

# Lägg till alla filer
git add .

# Commit
git commit -m "Initial commit - HairTP Clinic CCO"

# Lägg till remote
git remote add origin https://github.com/ditt-username/hairtp-clinic.git

# Push till GitHub
git branch -M main
git push -u origin main
```

### Steg 4: Klona i Codex

1. **I Codex:**
   - Öppna terminal/command palette
   - Kör: `git clone https://github.com/ditt-username/hairtp-clinic.git`
   
2. **Installera dependencies:**
   ```bash
   cd hairtp-clinic
   npm install
   ```

3. **Starta dev server:**
   ```bash
   npm run dev
   ```

---

## 🎯 METOD 3: MANUELL KOPIERING

### Om Codex har fil-upload:

1. **Exportera från Figma Make** (ZIP)
2. **Packa upp lokalt**
3. **Skapa mapstruktur i Codex:**
   ```
   hairtp-clinic/
   ├── src/
   ├── public/
   ├── .github/
   └── ...
   ```
4. **Kopiera filer en och en** eller mapp för mapp
5. **Installera dependencies:** `npm install`

---

## 📋 VIKTIGA FILER ATT INKLUDERA

### **Måste ha:**
```
✅ /src/                    # All source code
✅ /package.json            # Dependencies
✅ /vite.config.ts          # Build config
✅ /tsconfig.json           # TypeScript config
✅ /vercel.json             # Deployment config
✅ /.env.example            # Environment template
✅ /.gitignore              # Git ignore
```

### **Bra att ha:**
```
✅ /.github/workflows/      # CI/CD pipeline
✅ /DEPLOYMENT-GUIDE.md     # Deployment docs
✅ /TESTING-GUIDE.md        # Testing docs
✅ /README.md               # Project README
✅ All STEP-*.md files      # Documentation
```

### **INTE nödvändiga:**
```
❌ /node_modules/          # Installeras med npm install
❌ /dist/                  # Genereras vid build
❌ /coverage/              # Genereras vid test
❌ /.vercel/               # Vercel deployment cache
❌ .env.local              # Lokala secrets (skapa ny)
```

---

## 🔧 SETUP I CODEX

### Steg 1: Installera Dependencies

```bash
npm install
```

**Om det uppstår problem:**
```bash
# Rensa och installera om
rm -rf node_modules package-lock.json
npm install
```

### Steg 2: Konfigurera Environment

```bash
# Kopiera environment template
cp .env.example .env.local

# Redigera med dina värden
# VITE_APP_URL=http://localhost:5173
# osv...
```

### Steg 3: Starta Dev Server

```bash
npm run dev
```

Öppna: `http://localhost:5173`

### Steg 4: Verifiera att allt fungerar

```bash
# Kör tests
npm run test:run

# Build production
npm run build

# Preview build
npm run preview
```

---

## 🐛 TROUBLESHOOTING

### Problem: "Module not found"

**Lösning:**
```bash
npm install
```

### Problem: "Port already in use"

**Lösning:**
```bash
# Ändra port i vite.config.ts
server: {
  port: 3000  // Eller annan port
}
```

### Problem: "TypeScript errors"

**Lösning:**
```bash
# Kontrollera tsconfig.json finns
# Installera types
npm install -D @types/node
```

### Problem: "Environment variables not working"

**Lösning:**
```bash
# Skapa .env.local med VITE_ prefix
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

---

## 📂 FILSTRUKTUR EFTER IMPORT

```
hairtp-clinic/
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # CI/CD pipeline
├── src/
│   ├── app/
│   │   ├── components/         # React components (20+)
│   │   ├── hooks/              # Custom hooks (10+)
│   │   ├── __tests__/          # Test files (189 tests)
│   │   ├── routes.ts
│   │   └── App.tsx
│   ├── lib/
│   │   ├── env.ts              # Environment config
│   │   └── monitoring.ts       # Monitoring setup
│   ├── styles/
│   │   ├── theme.css
│   │   └── fonts.css
│   └── test/
│       └── utils/
├── .env.example                # Environment template
├── .env.development            # Dev defaults
├── .env.production             # Prod defaults
├── .gitignore
├── package.json                # Dependencies
├── vite.config.ts              # Build config
├── vercel.json                 # Deployment config
├── tsconfig.json
├── README.md                   # Main README
├── DEPLOYMENT-GUIDE.md         # Deployment docs
├── TESTING-GUIDE.md            # Testing docs
├── PRODUCTION-CHECKLIST.md     # Production checklist
└── STEP-*.md                   # Documentation
```

---

## ✅ VERIFIERING

Efter import, kör dessa kommandon för att verifiera:

```bash
# 1. Dependencies installerade
npm list

# 2. TypeScript OK
npx tsc --noEmit

# 3. Tests passar
npm run test:run

# 4. Build fungerar
npm run build

# 5. Dev server startar
npm run dev
```

**Allt ska vara grönt!** ✅

---

## 🚀 NÄSTA STEG I CODEX

1. **Kör dev server:**
   ```bash
   npm run dev
   ```

2. **Gör ändringar** (Codex AI kan hjälpa dig)

3. **Kör tests:**
   ```bash
   npm test
   ```

4. **Build & deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

---

## 💡 TIPS

### **För bästa resultat:**

1. ✅ Använd **Git/GitHub metoden** (Metod 2)
   - Version control
   - Backup
   - Collaboration ready

2. ✅ **Installera dependencies direkt:**
   ```bash
   npm install
   ```

3. ✅ **Skapa .env.local:**
   ```bash
   cp .env.example .env.local
   ```

4. ✅ **Verifiera med tests:**
   ```bash
   npm run test:run
   ```

5. ✅ **Håll dokumentationen:**
   - README.md
   - DEPLOYMENT-GUIDE.md
   - TESTING-GUIDE.md

---

## 🔗 VIKTIGA KOMMANDON I CODEX

```bash
# Installation
npm install

# Development
npm run dev              # Start dev server
npm test                 # Run tests (watch)

# Testing
npm run test:run         # Run tests once
npm run test:coverage    # Coverage report

# Building
npm run build            # Production build
npm run preview          # Preview build

# Deployment
vercel --prod           # Deploy to production
```

---

## 📞 BEHÖVER HJÄLP?

Om något inte fungerar i Codex:

1. **Kontrollera Node.js version:**
   ```bash
   node --version  # Ska vara 20+
   ```

2. **Kontrollera npm version:**
   ```bash
   npm --version   # Ska vara 9+
   ```

3. **Rensa cache:**
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

4. **Läs error messages** - oftast tydliga!

---

## 🎉 KLART!

Nu har du HairTP Clinic projektet i Codex!

**Du kan:**
- ✅ Utveckla vidare med Codex AI
- ✅ Köra alla 189 tests
- ✅ Bygga production bundles
- ✅ Deploya till Vercel
- ✅ Använda all dokumentation

**Ha kul med utvecklingen! 🚀**

---

**Tips:** Codex AI kan hjälpa dig med:
- Lägga till nya features
- Refaktorera kod
- Fixa buggar
- Skriva tests
- Optimera performance

Säg bara vad du vill göra!
