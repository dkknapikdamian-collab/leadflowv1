# STAGE151 Compact Cards Source Truth — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / compact cards / guard per correction

## Cel

Delikatnie zmniejszyć wszystkie kafelki/karty/panele w całej aplikacji, bez ruszania szerokości Stage149 i bez zmian per zakładka.

## FAKTY

- Stage149 został zaakceptowany jako jedno źródło prawdy szerokości panelu.
- Stage150 dodał źródło prawdy typografii, ale kafelki nadal są za duże.
- Damian ustalił zasadę: każda poprawka = nowy guard.
- Następna poprawka: wszystkie kafelki w całej aplikacji mają być delikatnie mniejsze.

## DECYZJE DAMIANA

- Każda poprawka ma mieć osobny guard.
- Zaczynamy od zmniejszenia kafelków.
- Kafelki w całej aplikacji mają być delikatnie mniejsze.
- Nie zmieniamy zaakceptowanego kierunku szerokości.

## Zakres Stage151

Dodaje:
- `src/styles/closeflow-compact-cards-source-truth-stage151.css`
- `scripts/check-stage151-compact-cards-source-truth.cjs`
- `scripts/apply-stage151-compact-cards-source-truth.cjs`
- `docs/ui/CLOSEFLOW_STAGE151_COMPACT_CARDS_SOURCE_TRUTH.md`
- `_project/STAGE151_COMPACT_CARDS_SOURCE_TRUTH_REPORT.md`
- aktualizację Obsidiana

## Testy

```powershell
node scripts/check-stage151-compact-cards-source-truth.cjs
npm.cmd run build
```

## Czego nie ruszano

- szerokość Stage149
- typografia Stage150 poza kartami
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
Jeśli kafelki nadal są za duże, regulować wyłącznie zmienne `--cf151-*`.
