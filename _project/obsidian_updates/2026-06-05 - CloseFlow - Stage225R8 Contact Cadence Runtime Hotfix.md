# CloseFlow - STAGE225R8 Contact Cadence Runtime Hotfix

Data: 2026-06-05 18:55 Europe/Warsaw
Typ: hotfix blokujący przejście dalej

## Decyzja
Stage225 nie był domknięty po R6. Wykryto ryzyko TDZ/runtime w `Leads.tsx`, błędne mapowanie `relatedRecordsById`, błędny regex w helperze oraz ASCII-copy w helperze.

## Zakres R8
- Przywrócenie target files z HEAD przed patchowaniem, żeby usunąć częściowy R7.
- Naprawa kolejności memo w `Leads.tsx`.
- Naprawa `relatedRecordsById: relatedRecordsByLeadId`.
- Naprawa `replace(/\s+/g, '')`.
- Poprawa polskich etykiet w helperze.
- Wzmocnienie guardu Stage225.

## Testy wymagane
- `node scripts/check-stage225-contact-cadence-grid.cjs`
- `node --test tests/stage225-contact-cadence-grid.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`
- `git status --short`

## Audyt ryzyk
Nie przechodzić dalej, jeśli R8 nie przejdzie pełnego verify. Nie dodawać `_LOCAL_CHECKS/`.
