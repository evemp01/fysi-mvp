# Fysi – MVP

Fysi är en digital plattform för hemträning inom fysioterapi. Fysioterapeuten skapar träningsprogram, patienten tränar och loggar sina pass, och båda ser hur rehabiliteringen går. Projektet är gjort i kursen TDDE02 Mjukvarutekniskt entreprenörskap (utmaning 4: Brist på följsamhet i rehab).

Det här är en klickbar MVP för användartester. All data är påhittad och sparas bara i den egna webbläsaren.

## Kör

Öppna `index.html` i en webbläsare. Inget behöver byggas eller installeras.

Med GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**. Appen finns sedan på `https://<användarnamn>.github.io/<repo>/`.

## Tre vyer

| Vy | Innehåll |
|---|---|
| **Patientapp** | Veckans pass (t.ex. 2 av 4), övningar med animerade figurer, steg, "varför" och gör/undvik. Loggning av ett helt pass: set och repetitioner, smärta (VAS 0–10) med smärtgräns, kroppskarta med inzoomning och smärtsymboler, Lätt/Lagom/Tungt, flaggor per övning. Framsteg och chatt med meddelandekvot. |
| **Fysioterapeut** | Översikt med det som kräver uppmärksamhet och en patienttabell. Patientprofil med följsamhet per vecka, smärtkurva, smärtkarta, flaggade övningar och export till journal. Programbyggare med övningsbibliotek, mallar, pass per vecka, programlängd, smärtgräns och egna övningar. Inkorg. |
| **Ge feedback** | Testuppgifter för båda rollerna, betyg på hur lätt det var, fritext och export som tabell. |

Textstorleken kan ökas i tre steg uppe till höger. Knappen **Återställ demodata** i sidfoten tar tillbaka exempeldatan mellan testpersoner.

## Teknik

En enda HTML-fil med vanlig HTML, CSS och JavaScript utan ramverk. Data sparas i `localStorage`. Typsnittet Plus Jakarta Sans hämtas från Google Fonts.
