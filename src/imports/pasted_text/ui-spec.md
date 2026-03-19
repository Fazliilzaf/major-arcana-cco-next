Här är en mer professionell produkt- och UX-specifikation som utvecklare och designers normalt använder. Den är skriven för att minimera missförstånd och göra varje ändring mätbar och implementerbar.

⸻

Produkt- och UX-specifikation

Projekt: UI-förbättringar i mejl- och kundhanteringssystem
Version: 1.0
Datum: 2026-03-15

Syfte

Syftet med dessa ändringar är att:
	•	förbättra tydlighet och användbarhet i gränssnittet
	•	skapa konsekvent design mellan olika vyer
	•	utöka funktionaliteten i AI- och teamfunktioner
	•	minska visuellt brus som distraherar från mejlinnehållet

⸻

1. Logotyp i sidhuvud

Nuvarande problem

Sidhuvudet visar en svart dropp-ikon, vilket inte är korrekt varumärkesrepresentation.

Krav
	•	Den svarta dropp-ikonen ska tas bort.
	•	Den ska ersättas med CCO-logotypen (loggan där texten “CCO” visas).
	•	Den logotypfil som tidigare skickats ska användas.

Acceptanskriterier
	•	Logotypen visas korrekt i sidhuvudet.
	•	Samma logotyp visas konsekvent i hela systemet.

⸻

2. Knappar under “Skicka”

Problem

Knapparna under Skicka är visuellt svaga och uppfattas inte tydligt som klickbara funktioner.

Krav

Knapparnas synlighet ska förbättras genom minst en av följande åtgärder:
	•	högre färgkontrast mot bakgrund
	•	tydligare ikonografi
	•	hover-effekt vid muspekare
	•	tydligare kantlinje eller bakgrund

Acceptanskriterier
	•	Knapparna är visuellt tydliga utan att dominera layouten.
	•	Användaren ska direkt förstå att de är interaktiva.

⸻

3. Kundvy (högerpanel)

3.1 Medical – mallar och samtycken

Problem

Det är inte möjligt att lägga till fler:
	•	samtycken
	•	mallar

Krav

Systemet ska stödja:
	•	skapande av nya samtycken
	•	skapande av nya mallar

Acceptanskriterier
	•	användare kan lägga till fler poster
	•	nya poster sparas och visas i listan

⸻

3.2 AI-funktioner

Problem

Under AI-funktioner finns endast alternativet:

“Kopiera till svarstudion”.

Krav

AI-menyn ska utökas med fler funktioner, exempelvis:
	•	generera svarsförslag
	•	förbättra textformulering
	•	sammanfatta mejl
	•	skapa svarsmall
	•	generera struktur för svar

Acceptanskriterier

Minst två ytterligare AI-funktioner ska vara tillgängliga utöver nuvarande funktion.

⸻

4. Statusfält i inkorg

Problem

Fälten för statuskategorier:
	•	Sprint
	•	Kritisk
	•	Kräver svar idag

är för breda och drar för mycket uppmärksamhet från mejlinnehållet.

Krav
	•	Bredden på dessa fält ska minskas till cirka 50 % av nuvarande storlek.

Acceptanskriterier
	•	statusinformation är fortfarande tydlig
	•	mejlinnehållet blir visuellt mer framträdande

⸻

5. Smarta funktioner i fler kategorier

Problem

Smarta funktioner finns endast i Inkorg.

Krav

Samma funktionalitet ska finnas i följande kategorier:
	•	Observerade
	•	Snooze
	•	Utkast
	•	Arkiv

Acceptanskriterier

Funktionerna ska vara identiska i:
	•	funktion
	•	placering
	•	beteende

⸻

6. Storlek på mejlvy

Problem

Storleken på mejlrutan är inte konsekvent mellan:
	•	Inkorg
	•	Observerade
	•	Snooze
	•	Utkast
	•	Arkiv

Krav

Layouten för mejlrutan ska standardiseras.

Referenslayout: Inkorg.

Acceptanskriterier
	•	mejlrutan har samma dimensioner i alla kategorier
	•	layoutbeteendet är identiskt

⸻

7. Kundhistorik

Problem

Knapparna i kundhistorikvyn drar för mycket visuell uppmärksamhet.

Krav

Knapparnas visuella vikt ska reduceras genom exempelvis:
	•	mindre färgintensitet
	•	mindre storlek
	•	mer neutral design

Acceptanskriterier

Informationen i kundhistoriken är huvudfokus i vyn.

⸻

8. Team-sektion

Problem

Det går inte att tilldela fler än en person.

Krav

Systemet ska stödja tilldelning av flera personer.

Acceptanskriterier
	•	flera användare kan kopplas till samma ärende eller kund
	•	alla tilldelade användare visas i teamfältet

⸻

9. Notiser

Problem

Notiser kopplas inte automatiskt till personen som skapade dem.

Krav

När en användare skriver en notis ska systemet automatiskt:
	•	registrera skaparen
	•	spara detta tillsammans med notisen

Acceptanskriterier

Varje notis ska visa:
	•	namn på skaparen
	•	datum
	•	eventuell tidsstämpel

⸻

Designprinciper för alla ändringar

Följande designprinciper ska gälla genomgående:
	1.	Konsekvens
Samma layout och beteende i alla sektioner.
	2.	Informationsfokus
Innehåll ska prioriteras över UI-element.
	3.	Visuell hierarki
Viktig information ska vara mest framträdande.
	4.	Minimal distraktion
UI-element ska inte ta uppmärksamhet från mejl och kunddata.

⸻

Om du vill kan jag också göra en ännu mer avancerad version som utvecklare älskar (PRD + Jira-tickets) där varje punkt blir ett separat utvecklingskort. Det brukar minska missförstånd med upp till 70–80 % i utvecklingsprojekt.