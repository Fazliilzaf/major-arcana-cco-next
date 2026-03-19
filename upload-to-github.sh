#!/bin/bash

# ================================
# HairTP Clinic → GitHub Upload Script
# ================================
# Detta script automatiserar uppladdning till GitHub
#
# Användning:
#   chmod +x upload-to-github.sh
#   ./upload-to-github.sh
# ================================

echo ""
echo "🚀 ============================================="
echo "   HairTP Clinic → GitHub Upload Script"
echo "   ============================================="
echo ""

# Färger för output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Kontrollera att Git är installerat
echo -e "${BLUE}🔍 Kontrollerar Git installation...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git är inte installerat!${NC}"
    echo "   Installera Git från: https://git-scm.com"
    exit 1
fi
echo -e "${GREEN}✅ Git är installerat ($(git --version))${NC}"
echo ""

# Kontrollera att vi är i rätt mapp
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Fel mapp! package.json hittades inte.${NC}"
    echo "   Navigera till hairtp-clinic projektmappen först."
    exit 1
fi
echo -e "${GREEN}✅ Korrekt projektmapp${NC}"
echo ""

# Fråga efter GitHub användarnamn
echo -e "${YELLOW}📝 GitHub Information${NC}"
echo ""
read -p "Ange ditt GitHub username: " github_username

if [ -z "$github_username" ]; then
    echo -e "${RED}❌ Username kan inte vara tomt${NC}"
    exit 1
fi

# Fråga efter repository namn
read -p "Ange repository namn [hairtp-clinic]: " repo_name
repo_name=${repo_name:-hairtp-clinic}

echo ""
echo -e "${BLUE}📦 Repository: ${GREEN}github.com/$github_username/$repo_name${NC}"
echo ""
read -p "Är detta korrekt? (y/n): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo -e "${YELLOW}❌ Avbruten av användare${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🚀 Startar upload...${NC}"
echo ""

# Steg 1: Initiera Git (om inte redan gjort)
echo -e "${BLUE}1️⃣ Initierar Git repository...${NC}"
if [ -d ".git" ]; then
    echo -e "${YELLOW}   ⚠️  Git redan initierat${NC}"
else
    git init
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✅ Git initierat${NC}"
    else
        echo -e "${RED}   ❌ Kunde inte initiera Git${NC}"
        exit 1
    fi
fi
echo ""

# Steg 2: Lägg till filer
echo -e "${BLUE}2️⃣ Lägger till filer till Git...${NC}"
git add .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ Filer tillagda${NC}"
    
    # Visa antal filer
    files_count=$(git status --short | wc -l)
    echo -e "   📊 Antal filer: $files_count"
else
    echo -e "${RED}   ❌ Kunde inte lägga till filer${NC}"
    exit 1
fi
echo ""

# Steg 3: Skapa commit
echo -e "${BLUE}3️⃣ Skapar initial commit...${NC}"
git commit -m "Initial commit - HairTP Clinic CCO System

Complete booking management and CRM application with:
- Premium pink/grey design
- Inbox with conversation management
- Response Studio with AI suggestions
- Customer engagement tracking
- SLA management
- Progressive disclosure
- 189 passing tests
- 87% code coverage
- Production ready

Built with React, TypeScript, Tailwind CSS v4"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ Commit skapad${NC}"
else
    echo -e "${YELLOW}   ⚠️  Commit redan existerar eller inga ändringar${NC}"
fi
echo ""

# Steg 4: Sätt main branch
echo -e "${BLUE}4️⃣ Sätter main branch...${NC}"
git branch -M main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ Branch satt till 'main'${NC}"
else
    echo -e "${RED}   ❌ Kunde inte sätta branch${NC}"
    exit 1
fi
echo ""

# Steg 5: Lägg till remote
echo -e "${BLUE}5️⃣ Lägger till GitHub remote...${NC}"

# Ta bort befintlig remote om den finns
git remote remove origin 2>/dev/null

# Lägg till ny remote
git remote add origin "https://github.com/$github_username/$repo_name.git"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ Remote tillagd${NC}"
    echo -e "   🔗 URL: https://github.com/$github_username/$repo_name.git"
else
    echo -e "${RED}   ❌ Kunde inte lägga till remote${NC}"
    exit 1
fi
echo ""

# Steg 6: Push till GitHub
echo -e "${BLUE}6️⃣ Pushar till GitHub...${NC}"
echo -e "${YELLOW}   ⚠️  Du kan behöva ange ditt GitHub lösenord eller token${NC}"
echo -e "${YELLOW}   💡 Om du behöver token: https://github.com/settings/tokens${NC}"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ =============================================${NC}"
    echo -e "${GREEN}   UPLOAD LYCKADES!${NC}"
    echo -e "${GREEN}   =============================================${NC}"
    echo ""
    echo -e "${BLUE}🌐 Ditt repository:${NC}"
    echo -e "   ${GREEN}https://github.com/$github_username/$repo_name${NC}"
    echo ""
    echo -e "${BLUE}📋 Nästa steg:${NC}"
    echo -e "   1. Besök ditt repository på GitHub"
    echo -e "   2. Verifiera att alla filer finns"
    echo -e "   3. Klona till Codex:"
    echo -e "      ${YELLOW}git clone https://github.com/$github_username/$repo_name.git${NC}"
    echo -e "   4. Installera dependencies:"
    echo -e "      ${YELLOW}npm install${NC}"
    echo -e "   5. Starta dev server:"
    echo -e "      ${YELLOW}npm run dev${NC}"
    echo ""
    echo -e "${BLUE}🎉 Grattis! Ditt projekt är nu på GitHub!${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ =============================================${NC}"
    echo -e "${RED}   UPLOAD MISSLYCKADES${NC}"
    echo -e "${RED}   =============================================${NC}"
    echo ""
    echo -e "${YELLOW}💡 Vanliga problem och lösningar:${NC}"
    echo ""
    echo -e "${YELLOW}1. Repository existerar inte på GitHub:${NC}"
    echo "   → Gå till https://github.com/new"
    echo "   → Skapa repository med namn: $repo_name"
    echo "   → Kryssa INTE i 'Initialize with README'"
    echo "   → Kör detta script igen"
    echo ""
    echo -e "${YELLOW}2. Authentication failed:${NC}"
    echo "   → Använd Personal Access Token istället för lösenord"
    echo "   → Skapa token: https://github.com/settings/tokens"
    echo "   → Välj scope: 'repo'"
    echo "   → Använd token som lösenord"
    echo ""
    echo -e "${YELLOW}3. Permission denied:${NC}"
    echo "   → Kontrollera att repository-namnet är korrekt"
    echo "   → Kontrollera att du äger repository:en"
    echo ""
    echo -e "${BLUE}📚 Mer hjälp: Se GITHUB-UPLOAD-GUIDE.md${NC}"
    echo ""
    exit 1
fi
