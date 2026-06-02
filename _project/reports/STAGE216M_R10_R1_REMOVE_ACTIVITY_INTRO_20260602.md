# STAGE216M_R10_R1_REMOVE_ACTIVITY_INTRO_20260602

## Cel
Usunąć z karty historii aktywności leada tekst pomocniczy: `Ostatnie 5 zdarzeń powiązanych z tym leadem.`

## Zakres
- `src/pages/LeadDetail.tsx`
- guard: `tests/stage216m-r10-r1-remove-activity-intro-contract.test.cjs`
- raport `_project`
- notatka Obsidian update

## FAKTY
- Stage216M-R10 ustawił środek ClientDetail w kolejności: kafelki → aktywne sprawy → notatki.
- Tekst pomocniczy w historii aktywności leada jest zbędny wizualnie po ujednoliceniu lewego raila.
- Ten etap nie rusza prawej szyny, finansów klienta, API, Supabase ani danych.

## DECYZJE DAMIANA
- Usunąć tekst `Ostatnie 5 zdarzeń powiązanych z tym leadem.`

## TESTY
- `node tests/stage216m-r10-r1-remove-activity-intro-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Czego nie ruszano
- prawa szyna
- finanse klienta
- API
- Supabase
- płatności
- Stage216D
