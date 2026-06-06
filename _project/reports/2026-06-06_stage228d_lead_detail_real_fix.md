# Stage228D — LeadDetail real fix: accordion, right quick actions, phone row

Data: 2026-06-06 18:58 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Zakres

- Naprawia nieudany Stage228C: poprzedni runner mial anchor mismatch i mimo bledu pokazal DONE.
- LeadDetail dostaje akordeon jak CaseDetail: maksymalnie jedna grupa otwarta, klik otwiera/zamyka.
- Kolorowe grupy sa pelnotonowe: nie ma bialego kontenera w srodku pustych kafelkow.
- Prawy kafelek Powiazana sprawa zostal zastapiony kafelkiem Szybkie akcje.
- Telefon/e-mail w panelu danych leada nie powinien uciekac pod kafelek ani byc przycinany.

## Pliki

- src/pages/LeadDetail.tsx
- src/styles/visual-stage14-lead-detail-vnext.css
- scripts/guards/stage228d-lead-detail-real-fix.mjs
- package.json

## Testy

- npm run verify:stage228d-lead-detail-real-fix
- git diff --check
- test reczny: LeadDetail, klik Najblizsze dzialania / Braki i blokady / Wszystkie aktywne; max jedna grupa otwarta.
- test reczny: prawy rail ma Szybkie akcje i nie ma kafelka Powiazana sprawa.
- test reczny: telefon w Dane leada jest czytelny i nie wypada pod kafelek.

## Audyt ryzyk

- Dodaj brak w leadzie nadal otwiera zadanie, bo lead nie ma osobnego modelu brakow takiego jak case_items w sprawie.
- Jesli pozniej powstanie osobny model brakow leada, trzeba przepiac przycisk Dodaj brak i filtr leadBlockerEntries.
- Zmieniono tylko UI/guard; bez migracji SQL i bez zmiany przeplywu lead -> sprawa.
