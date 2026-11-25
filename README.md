# Fysi – MVP

Fysi är en digital plattform för hemträning inom fysioterapi. Fysioterapeuten skapar träningsprogram, patienten tränar och loggar sina pass, och båda ser hur rehabiliteringen går. Projektet är gjort i kursen TDDE02 Mjukvarutekniskt entreprenörskap (utmaning 4: Brist på följsamhet i rehab).

Det här är en klickbar MVP för användartester. All data är påhittad och sparas bara i den egna webbläsaren.

## Kör

Öppna `index.html` i en webbläsare. Inget behöver byggas eller installeras.

Med GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**. Appen finns sedan på `https://<användarnamn>.github.io/<repo>/`.

## Tre vyer

| Vy | Innehåll |
|---|---|
| **Patientapp** | Veckans pass (missade pass ligger kvar i stället för att räknas som misslyckade), instruktionsfilm på varje övning, läget Kör passet med timer och setsräknare, påminnelser som patienten styr själv, övningar med steg, "varför" och gör/undvik. Loggning av ett helt pass: set och repetitioner, valfri smärta (VAS 0–10, kan hoppas över) med smärtgräns, kroppskarta med inzoomning och smärtsymboler, Lätt/Lagom/Tungt, flaggor per övning. Egna anteckningar per övning. Framsteg med graf över pass och smärta per vecka. Chatt med utskriven svarstid där patient och fysioterapeut kan skicka videor och bilder. |
| **Fysioterapeut** | Översikt med det som kräver uppmärksamhet och en patienttabell. Patientprofil med egna anteckningar, följsamhet per vecka, smärtkurva, smärtkarta, flaggade övningar och export till journal. Egen flik för övningsbanken (alla övningar, favoriter, egna övningar, förhandsvisning och tillägg till valfri patients program). Programbyggare med smart övningsbibliotek (sökning som förstår synonymer, latin, diagnoser och stavfel, filter, favoriter, senast använda, lättare/svårare varianter), mallar, pass per vecka eller per dag, programlängd, smärtgräns och egna övningar med flera bilder och videor (ladda upp flera på en gång, fota eller filma med mobilen, eller länka till YouTube). Egen video eller bild per övning för en viss patient. Inkorg med svarstid per meddelande. |
| **Ge feedback** | Testuppgifter för båda rollerna, betyg på hur lätt det var, fritext och export som tabell. |

Textstorleken kan ökas i tre steg uppe till höger. Knappen **Återställ demodata** i sidfoten tar tillbaka exempeldatan mellan testpersoner.

## Teknik

En enda HTML-fil med vanlig HTML, CSS och JavaScript utan ramverk. Data sparas i `localStorage`, uppladdade bilder och videor i `IndexedDB` i webbläsaren. Typsnittet Plus Jakarta Sans hämtas från Google Fonts.
