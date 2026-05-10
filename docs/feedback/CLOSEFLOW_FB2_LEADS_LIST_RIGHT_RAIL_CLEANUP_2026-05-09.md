# CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP

Data: 2026-05-09  
Etap: FB-2 — Leads list and right rail cleanup  
Status: wdrożone przez paczkę `closeflow_fb2_leads_list_right_rail_cleanup_2026-05-10`

## Cel

Naprawić `/leads` bez ruszania klientów, finansów ani wartości.

## Decyzje

| Obszar | Decyzja |
|---|---|
| Lista leadów | Telefon nie jest zdublowany. Usuwamy drugi prefiks `Telefon: ...`, jeśli kontakt jest już pokazany w sekcji kontaktu. |
| Right rail | `Najcenniejsze relacje` zmienione na `Najcenniejsze leady`. |
| Źródło right rail | Tylko aktywne leady. Bez klientów i bez spraw jako pozycji listy. |
| Sortowanie | Po wartości leada, przez istniejący kontrakt `buildRelationValueEntries` z `clients: []` i `cases: []`. |
| Tekst w panelu | `min-width: 0`, clamp 1-2 linie, brak łamania krótkich słów, kwota nie rozjeżdża wiersza. |
| Zakres | nie zmienia `/clients`, nie zmienia finansów, nie usuwa wartości. |

## Pliki

- `src/pages/Leads.tsx`
- `src/styles/closeflow-list-row-tokens.css`
- `scripts/check-closeflow-fb2-leads-list-right-rail-cleanup.cjs`
- `package.json`

## Check

```bash
npm run check:closeflow-fb2-leads-list-right-rail-cleanup
npm run build
```

## Kryterium zakończenia

Telefon nie jest zdublowany, right rail pokazuje tylko leady i tekst mieści się w panelu.
