<!-- STAGE103_CALENDAR_MONTH_GRID_DAY_STATES_V3_RUN -->
# Stage103 V3 â€” Calendar month grid day states

## FAKTY Z KODU / PLIKĂ“W
- Aktywny month grid jest renderowany w src/pages/Calendar.tsx w gaĹ‚Ä™zi calendarView === 'month'.
- Przed naprawÄ… komĂłrka miesiÄ…ca renderowaĹ‚a gĂłrny Badge przy numerze dnia.
- Przed naprawÄ… + wiÄ™cej byĹ‚o martwym div.calendar-more.
- Importy CSS kalendarza majÄ… kilka warstw historycznych: skin, overlap, rows no-overlap, structural, plain text rows. Finalny override Stage103 dopisano do ostatniej warstwy closeflow-calendar-month-plain-text-rows-v4.css.

## DECYZJE DAMIANA
- Aktualny dzieĹ„ ma byÄ‡ lekko zielonkawy.
- Stare dni majÄ… byÄ‡ szare / mniej kontrastowe.
- Wybrany dzieĹ„ ma mieÄ‡ spokojny niebieski border.
- GĂłrny count badge przy dacie ma zniknÄ…Ä‡.
- + wiÄ™cej ma byÄ‡ realnÄ… akcjÄ…, nie martwym tekstem.

## HIPOTEZY / PROPOZYCJE AI
- Najbezpieczniejsza naprawa to maĹ‚a zmiana aktywnego renderu i finalny CSS override w ostatnim importowanym pliku month grid.

## DO POTWIERDZENIA
- Test rÄ™czny w przeglÄ…darce: dzisiejszy dzieĹ„, stare dni, selected day i klikniÄ™cie + wiÄ™cej.

## TESTY AUTOMATYCZNE
- 
ode tests/stage103-calendar-month-grid-day-states.test.cjs
- 
ode scripts/closeflow-release-check-quiet.cjs

## GUARDY
- 	ests/stage103-calendar-month-grid-day-states.test.cjs wymusza brak gĂłrnego count badge, klasy stanĂłw dnia, aktywny przycisk + wiÄ™cej, target selected day i CSS Stage103.

## TESTY RÄCZNE
- TEST RÄCZNY DO WYKONANIA PRZEZ DAMIANA.

## POTWIERDZENIA DAMIANA
- Brak potwierdzenia rÄ™cznego na moment wdroĹĽenia.

## BRAKI I RYZYKA
- Stare warstwy CSS kalendarza nadal istniejÄ…, ale Stage103 celowo dopisuje finalny override w ostatniej aktywnej warstwie.
- JeĹ›li przeglÄ…darka pokaĹĽe inny efekt, trzeba sprawdziÄ‡ computed styles dla .calendar-day-cell i .cf-calendar-month-more.

## WPĹYW NA OBSIDIANA
- Dopisano status Stage103 i test rÄ™czny do notatek CloseFlow w vault.

## WPĹYW NA KIERUNEK ROZWOJU
- Month grid pozostaje zamroĹĽony funkcjonalnie, zmienione sÄ… tylko stany komĂłrki i martwy + wiÄ™cej.

## NASTÄPNY KROK
- Damian uruchamia test rÄ™czny /calendar -> MiesiÄ…c i potwierdza wyglÄ…d oraz klikniÄ™cie + wiÄ™cej.

## GIT / ZIP STATUS
- WdroĹĽenie przez lokalny ZIP Stage103 V3.
