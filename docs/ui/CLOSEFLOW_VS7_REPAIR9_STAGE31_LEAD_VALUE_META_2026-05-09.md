# CloseFlow VS-7 Repair9 - Stage31 lead value meta

## Cel
Naprawia release gate Stage31 po serii repairów VS-7.

## Problem
`tests/stage31-leads-thin-list-search.test.cjs` wymaga, aby cienka lista leadów używała wywołania:

`buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel)`

Aktualny `Leads.tsx` miał starszy wariant bez `leadValueLabel`.

## Zmiana
- dodano helper `buildLeadValueLabel(lead)`;
- rozszerzono `buildLeadCompactMeta` o argument `leadValueLabel`;
- dodano wartość leada do jednowierszowego meta opisu;
- podmieniono wywołania `buildLeadCompactMeta` na kontrakt Stage31.

## Nie zmienia
- zapisu leadów;
- soft-trash;
- VS-7 semantic tone contract;
- routingu;
- Supabase.

## Kryterium zakończenia
- `node --test tests/stage31-leads-thin-list-search.test.cjs` przechodzi;
- `npm run verify:closeflow:quiet` przechodzi do kolejnych testów albo kończy się zielono;
- `npm run test:raw` i `npm run build` przechodzą przed commitem.
