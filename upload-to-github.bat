@echo off
REM ================================
REM HairTP Clinic → GitHub Upload Script (Windows)
REM ================================
REM Detta script automatiserar uppladdning till GitHub
REM
REM Användning:
REM   Dubbelklicka på filen
REM   ELLER kör: upload-to-github.bat
REM ================================

echo.
echo =============================================
echo    HairTP Clinic - GitHub Upload Script
echo =============================================
echo.

REM Kontrollera att Git är installerat
echo Kontrollerar Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git är inte installerat!
    echo.
    echo Installera Git från: https://git-scm.com
    echo.
    pause
    exit /b 1
)
echo [OK] Git är installerat
echo.

REM Kontrollera att vi är i rätt mapp
if not exist "package.json" (
    echo [ERROR] Fel mapp! package.json hittades inte.
    echo.
    echo Navigera till hairtp-clinic projektmappen först.
    echo.
    pause
    exit /b 1
)
echo [OK] Korrekt projektmapp
echo.

REM Fråga efter GitHub användarnamn
echo GitHub Information
echo.
set /p github_username="Ange ditt GitHub username: "

if "%github_username%"=="" (
    echo [ERROR] Username kan inte vara tomt
    pause
    exit /b 1
)

REM Fråga efter repository namn
set /p repo_name="Ange repository namn [hairtp-clinic]: "
if "%repo_name%"=="" set repo_name=hairtp-clinic

echo.
echo Repository: github.com/%github_username%/%repo_name%
echo.
set /p confirm="Är detta korrekt? (y/n): "

if /i not "%confirm%"=="y" (
    echo Avbruten av användare
    pause
    exit /b 0
)

echo.
echo Startar upload...
echo.

REM Steg 1: Initiera Git
echo [1/6] Initierar Git repository...
if exist ".git" (
    echo [INFO] Git redan initierat
) else (
    git init
    if %errorlevel% neq 0 (
        echo [ERROR] Kunde inte initiera Git
        pause
        exit /b 1
    )
    echo [OK] Git initierat
)
echo.

REM Steg 2: Lägg till filer
echo [2/6] Lägger till filer till Git...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Kunde inte lägga till filer
    pause
    exit /b 1
)
echo [OK] Filer tillagda
echo.

REM Steg 3: Skapa commit
echo [3/6] Skapar initial commit...
git commit -m "Initial commit - HairTP Clinic CCO System"
if %errorlevel% neq 0 (
    echo [INFO] Commit redan existerar eller inga ändringar
)
echo [OK] Commit klar
echo.

REM Steg 4: Sätt main branch
echo [4/6] Sätter main branch...
git branch -M main
if %errorlevel% neq 0 (
    echo [ERROR] Kunde inte sätta branch
    pause
    exit /b 1
)
echo [OK] Branch satt till 'main'
echo.

REM Steg 5: Lägg till remote
echo [5/6] Lägger till GitHub remote...
git remote remove origin 2>nul
git remote add origin "https://github.com/%github_username%/%repo_name%.git"
if %errorlevel% neq 0 (
    echo [ERROR] Kunde inte lägga till remote
    pause
    exit /b 1
)
echo [OK] Remote tillagd
echo URL: https://github.com/%github_username%/%repo_name%.git
echo.

REM Steg 6: Push till GitHub
echo [6/6] Pushar till GitHub...
echo.
echo [INFO] Du kan behöva ange ditt GitHub lösenord eller token
echo [TIP] Om du behöver token: https://github.com/settings/tokens
echo.

git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo =============================================
    echo    UPLOAD MISSLYCKADES
    echo =============================================
    echo.
    echo Vanliga problem och lösningar:
    echo.
    echo 1. Repository existerar inte på GitHub:
    echo    - Gå till https://github.com/new
    echo    - Skapa repository med namn: %repo_name%
    echo    - Kryssa INTE i 'Initialize with README'
    echo    - Kör detta script igen
    echo.
    echo 2. Authentication failed:
    echo    - Använd Personal Access Token istället för lösenord
    echo    - Skapa token: https://github.com/settings/tokens
    echo    - Välj scope: 'repo'
    echo    - Använd token som lösenord
    echo.
    echo 3. Permission denied:
    echo    - Kontrollera att repository-namnet är korrekt
    echo    - Kontrollera att du äger repository:en
    echo.
    echo Mer hjälp: Se GITHUB-UPLOAD-GUIDE.md
    echo.
    pause
    exit /b 1
)

echo.
echo =============================================
echo    UPLOAD LYCKADES!
echo =============================================
echo.
echo Ditt repository:
echo https://github.com/%github_username%/%repo_name%
echo.
echo Nästa steg:
echo 1. Besök ditt repository på GitHub
echo 2. Verifiera att alla filer finns
echo 3. Klona till Codex:
echo    git clone https://github.com/%github_username%/%repo_name%.git
echo 4. Installera dependencies:
echo    npm install
echo 5. Starta dev server:
echo    npm run dev
echo.
echo Grattis! Ditt projekt är nu på GitHub!
echo.
pause
