# 2026-06-07 - Stage227C3B Client Case Missing Item Runtime Wiring run report

## Status
LOCAL_ONLY_READY po apply, guardach, testach i buildzie.

## FAKTY
- C3A domyka lead lokalnie.
- C3B dodaje ClientDetail Brak przez shared modal i lekki task/activity.
- CaseDetail ma już CaseQuickActions + AddCaseMissingItemDialog + case_items. Etap to potwierdza guardem, bez duplikowania modelu.

## DECYZJE
- Bez SQL w tym etapie.
- Client: task/activity.
- Case: istniejące case_items.

## TESTY
- check:stage227c3b-client-case-missing-item-runtime-wiring
- test:stage227c3b-client-case-missing-item-runtime-wiring
- C3A/C2/F6 regression
- build
- git diff --check

## AUDYT RYZYK
- Backend może nie zaakceptować `type/status = missing_item` w taskach klienta; wymagany manualny zapis i refresh.
- Case flow nie jest przepisywany, bo już ma `case_items`.
- To nadal nie jest jeden wspólny SQL model braków dla wszystkich rekordów.

## NASTĘPNY KROK
Manualny runtime check ClientDetail i CaseDetail. Po PASS można commit/push C3A+C3B razem albo osobno według stanu lokalnego.
