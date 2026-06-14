
# STAGE231G_R6_REBASE_WORKROW_GUARD_FIX

Data: 2026-06-14 10:40 Europe/Warsaw
Status: HOTFIX_REBASE_CONFLICT_AND_REAL_WORKROW_FIX

## Przyczyna

R5 usunął problem BOM/encoding, ale guard słusznie pokazał, że realne klasy work-row content/status/actions nie zostały dodane do LeadDetail. Dodatkowo rebase zatrzymał się na konflikcie w _project/04_ETAPY_ROZWOJU_APLIKACJI.md.

## Naprawa

- Rozwiązano konflikt _project/04 przez zachowanie obu stron bez markerów konfliktu.
- Dodano realne klasy BEM: lead-detail-work-row__content, lead-detail-work-row__status, lead-detail-work-row__actions.
- Dopisano CSS STAGE231G_R6_WORK_ROW_LAYOUT_FINAL.
- Guard/test przepisano tak, żeby sprawdzały stabilne markery i overflow section, a nie globalnie całe group.key używane poprawnie w accordion groups.

## Testy

- node scripts/check-stage231g-lead-detail-operational-wiring.cjs
- node --test tests/stage231g-lead-detail-operational-wiring.test.cjs
- npm run build
- git diff --check

## Ryzyko

Manual UI test nadal wymagany: nowy lead z potencjałem, edycja potencjału z kafelka/panelu, zadanie/wydarzenie/brak, hard refresh.
