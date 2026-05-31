# STAGE168 Remove Sales List Label From Cards — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / card label cleanup

## Cel

Usunąć z każdego kafelka widoczny napis:

```text
LISTA SPRZEDAŻOWA
```

## FAKTY

- Stage167 został zastosowany lokalnie.
- Stage167 usunął placeholder `Szybkie planowanie` z `src/pages/Leads.tsx`.
- Stage167 guard przeszedł.
- `npm.cmd run build` przeszedł.
- Nowy problem: powtarzalna etykieta `LISTA SPRZEDAŻOWA` w kafelkach.

## DECYZJE DAMIANA

- Z każdego kafelka kasujemy `LISTA SPRZEDAŻOWA`.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- To jest etykieta/overline, nie dane operacyjne.
- Należy usuwać sam label, nie cały kafelek.
- Guard powinien łapać też ASCII/mojibake warianty.

## Pliki

- `scripts/apply-stage168-remove-sales-list-label-from-cards.cjs`
- `scripts/check-stage168-remove-sales-list-label-from-cards.cjs`
- `docs/ui/CLOSEFLOW_STAGE168_REMOVE_SALES_LIST_LABEL_FROM_CARDS.md`
- `_project/STAGE168_REMOVE_SALES_LIST_LABEL_FROM_CARDS_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage168 remove sales list label from cards.md`

## Testy automatyczne

```powershell
node scripts/check-stage168-remove-sales-list-label-from-cards.cjs
npm.cmd run build
```

## Testy ręczne

- `/leads` → sprawdzić listę/kafelki leadów.
- `/clients` → sprawdzić podobne kafelki.
- `/cases` → sprawdzić podobne kafelki, jeśli występują.
- Modal `+ Lead`, `+ Zadanie`, `+ Wydarzenie` bez regresji.

## Czego nie ruszano

- dane
- auth
- Supabase
- Google Calendar
- Stripe
- AI
- routing
- deployment
- push
