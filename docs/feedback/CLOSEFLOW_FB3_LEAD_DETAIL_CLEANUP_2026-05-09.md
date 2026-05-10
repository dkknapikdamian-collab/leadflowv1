# CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP

Data: 2026-05-09  
Etap: FB-3 — LeadDetail cleanup

## Cel

Usunąć zdublowany kafel statusu z prawego panelu LeadDetail, jeżeli status leada jest już widoczny w headerze albo badge’u.

## Decyzja

Status leada ma być widoczny jako mały pill w headerze rekordu. Prawy panel nie powinien dublować informacji:

- `Status leada`
- `Nowy`
- `Lead aktywny. Możesz prowadzić kontakt sprzedażowy.`

## Zakres

Pliki objęte etapem:

- `src/pages/LeadDetail.tsx`
- `scripts/check-closeflow-fb3-lead-detail-cleanup.cjs`
- `package.json`

## Nie zmieniać

- Nie zmienia statusów leadów.
- Nie zmienia start service flow.
- Nie zmienia notatek.
- Nie zmienia zadań.
- Nie usuwa danych.

## Kryterium zakończenia

Nie ma zdublowanego kafla statusu, ale status leada nadal jest widoczny w headerze jako pill.

## Komenda

```bash
npm run check:closeflow-fb3-lead-detail-cleanup
```
