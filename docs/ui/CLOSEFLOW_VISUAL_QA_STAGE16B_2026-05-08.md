# CLOSEFLOW_VISUAL_QA_STAGE16B_2026_05_08

## Cel

Stage16B jest etapem QA-only po Stage16A. Celem jest sprawdzenie realnego wygladu UI po wdrozeniu kontraktow metryk i page hero.

Ten etap nie zmienia UI, danych, API, Supabase, auth, billing, AI, routingu ani zachowania klikniec.

## Zakres ekranow

- /tasks
- /cases
- /leads
- /clients
- /ai-drafts
- /activity
- /notifications
- /calendar
- /templates

## Kryteria wizualne do sprawdzenia

1. top metric tiles maja identyczne proporcje,
2. label nie lamie krotkich slow,
3. icons maja ten sam rozmiar i pozycje,
4. value/liczba ma ten sam font i wage,
5. page hero/header ma ten sam styl,
6. action cluster w headerze nie lata w innym miejscu,
7. mobile wrapping nie psuje layoutu.

## Decyzje po Stage16A

| Ekran | Decyzja | Uzasadnienie | Nastepny krok |
|---|---|---|---|
| /tasks | WYMAGA_STAGE16C | Zgloszony ekran. Wymaga realnego porownania screenshotow po deployu, bo guardy nie wystarcza. | Screenshot-driven repair dla Tasks. |
| /cases | WYMAGA_STAGE16C | Zgloszony ekran. Wymaga realnego porownania screenshotow po deployu, bo guardy nie wystarcza. | Screenshot-driven repair dla Cases. |
| /leads | OK | Brak aktualnego zgloszenia po Stage16A. Zostaje pod obserwacja screenshotowa. | Bez zmian bez dowodu. |
| /clients | OK | Brak aktualnego zgloszenia po Stage16A. Zostaje pod obserwacja screenshotowa. | Bez zmian bez dowodu. |
| /ai-drafts | OK | Brak aktualnego zgloszenia po Stage16A. Zostaje pod obserwacja screenshotowa. | Bez zmian bez dowodu. |
| /activity | OK | Brak aktualnego zgloszenia po Stage16A. Zostaje pod obserwacja screenshotowa. | Bez zmian bez dowodu. |
| /notifications | POZA_ZAKRESEM | Ten ekran nie jest glownym ekranem top metric tiles parity. Do osobnego kontrastu/czytelnosci, jesli screenshot to pokaze. | Nie blokuje Stage16B. |
| /calendar | OK | Brak aktualnego zgloszenia top metric parity po Stage16A. Kalendarz moze miec osobne problemy kontrastu, ale to inny etap. | Bez zmian bez dowodu. |
| /templates | OK | Brak aktualnego zgloszenia po Stage16A. Zostaje pod obserwacja screenshotowa. | Bez zmian bez dowodu. |

## Werdykt

Stage16B nie zamyka naprawy wizualnej samymi guardami. Po Stage16A nalezy przejsc do Stage16C tylko dla ekranow z realnym ryzykiem screenshotowym:

- /tasks
- /cases

Pozostale ekrany nie powinny byc ruszane bez screenshotu pokazujacego rozjazd.

## Weryfikacja

Wymagane komendy:

```bash
npm run check:closeflow-visual-qa-stage16b
npm run build
```

## Kryterium zakonczenia

- dokument Stage16B istnieje,
- kazdy ekran z zakresu ma decyzje: OK, WYMAGA_STAGE16C albo POZA_ZAKRESEM,
- check Stage16B przechodzi,
- build przechodzi,
- commit i push ida na dev-rollout-freeze dopiero po zielonych checkach,
- remote GitHub jest potwierdzony.
