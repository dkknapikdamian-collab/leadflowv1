# STAGE150 Panel Typography and Width Source Truth — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / typography / visual source truth

## Cel

Zachować zaakceptowany stan po Stage149 i przejść do delikatnego zmniejszenia czcionek bez ruszania szerokości.

## FAKTY

- Stage149 został zaakceptowany jako kierunek po problemach z szerokością.
- Ustalono: jedna szerokość / jedno źródło prawdy wizualne dla wszystkich zakładek panelu aplikacji.
- Nie wracamy do per-tab width hacków.
- Następna poprawka: delikatnie zmniejszyć czcionkę w panelu, bez redesignu.

## DECYZJE DAMIANA

- Zapisujemy aktualny stan.
- Lecimy dalej z poprawkami.
- Trzeba delikatnie zmniejszyć czcionkę.
- Stage149 szerokości ma być traktowany jako jedno źródło prawdy dla wszystkich zakładek panelu.

## HIPOTEZY AI

- Najbezpieczniej zmniejszyć typografię przez nowy Stage150 CSS po Stage149, zamiast zmieniać każdy komponent osobno.
- Nie należy teraz ruszać width source truth, bo dopiero został ustabilizowany.

## Zakres Stage150

Dodaje:
- `src/styles/closeflow-panel-typography-and-width-source-truth-stage150.css`
- `docs/ui/CLOSEFLOW_STAGE150_PANEL_VISUAL_SOURCE_TRUTH.md`
- guard
- raport `_project`
- aktualizację Obsidiana

## Testy

```powershell
node scripts/check-stage150-panel-typography-and-width-source-truth.cjs
npm.cmd run build
```

## Czego nie ruszano

- szerokości Stage149
- routing
- dane
- auth
- Supabase
- Google Calendar
- Stripe
- AI
- deploy
- push

## Następny krok

Sprawdzić wizualnie `/`, `/leads`, `/clients`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.
Jeśli czcionka nadal jest za duża, regulować tylko zmienne `--cf150-text-*`.
