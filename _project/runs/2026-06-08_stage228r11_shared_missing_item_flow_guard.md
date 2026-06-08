# Stage228R11 - shared missing item flow guard

- date: 2026-06-08 19:40 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Cel

Zamknac lekka wersje wspolnego przeplywu Brak bez nowej tabeli SQL:

- Lead: Brak jako szybka akcja, shared modal, zapis do task missing_item + activity missing_item_created.
- Client: Brak jako akcja w kartotece klienta, shared modal, zapis do task missing_item + activity missing_item_created.
- Case: Brak jako szybka akcja, zapis do case_items status missing + activity item_added.

## FAKTY z kodu

- LeadDetail ma STAGE227C3A_LEAD_MISSING_ITEM_RUNTIME_WIRING.
- ClientDetail ma STAGE227C3B_CLIENT_MISSING_ITEM_RUNTIME_WIRING.
- CaseQuickActions ma akcje key missing i AddCaseMissingItemDialog.
- AddCaseMissingItemDialog zapisuje case_items ze statusem missing.
- CaseDetail ma CRUD na case_items.

## Decyzja techniczna etapu

Na teraz nie dodajemy SQL ani tabeli missing_items. Wspolny model danych bylby osobnym etapem migracyjnym. Ten etap zamyka i pilnuje obecny lekki workflow.

## Zmiany

- Dodano guard scripts/check-stage228r11-shared-missing-item-flow.cjs.
- Dodano skrypt package.json check:stage228r11-shared-missing-item-flow.
- Podpieto guard do prebuild.
- Zaktualizowano centralne pliki testow/guardow oraz manifest Obsidian update.

## Testy automatyczne

- node scripts/check-stage228r11-shared-missing-item-flow.cjs
- npm run build
- git diff --check

## Test reczny

1. LeadDetail: klik Brak, zapisz brak, sprawdz Braki i blokady po odswiezeniu.
2. ClientDetail: klik Brak, zapisz brak, sprawdz Braki i blokady po odswiezeniu.
3. CaseDetail: klik Brak w Szybkich akcjach, zapisz brak, sprawdz liste dzialan/brakow sprawy po odswiezeniu.

## Audyt ryzyk po etapie

- Ryzyko: sa dwa backendowe targety zapisu, task/activity dla lead/client i case_items dla case.
- Skutek: przyszly shared model missing_items bedzie wymagal migracji danych i osobnego SQL.
- Ograniczenie: guard pilnuje obecnego kontraktu i nie pozwala przypadkowo usunac Brak z jednego widoku.
- Nie ruszano: UI layout, SQL, Supabase RLS, logiki finansow, CaseDetail grid.
