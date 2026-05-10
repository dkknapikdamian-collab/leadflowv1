# CloseFlow Visual System Release Evidence — VS-9 — 2026-05-09

## Status

VS-9: Final anti-drift visual gate.

Cel: nie dopuścić do powrotu lokalnego chaosu wizualnego po etapach VS-1…VS-8.

Ten etap nie przebudowuje ekranów. Dodaje finalny zestaw strażników, które mają blokować boczne ścieżki omijające system UI.

## Finalna komenda

```bash
npm run verify:closeflow-visual-system
```

## Źródła prawdy systemu wizualnego

Weryfikowane źródła prawdy:

- `src/components/ui-system/semantic-visual-registry.ts`
- `src/components/ui-system/operator-metric-tone-contract.ts`
- `src/components/ui-system/OperatorMetricTiles.tsx`
- `src/components/ui-system/EntityIcon.tsx`
- `src/components/ui-system/ActionIcon.tsx`
- `src/components/ui-system/icon-registry.ts`
- `src/components/ui-system/action-icon-registry.ts`
- `src/components/ui-system/screen-slots.ts`
- `docs/ui/CLOSEFLOW_VISUAL_SYSTEM_RELEASE_EVIDENCE_2026-05-09.md`

## Guardy VS-9

### 1. `scripts/check-closeflow-no-local-visual-drift.cjs`

Sprawdza, czy repo ma centralne źródła prawdy UI i czy `package.json` ma finalną komendę:

```bash
npm run verify:closeflow-visual-system
```

Ten guard pilnuje, żeby system wizualny nie rozpadł się na lokalne mapy i półprywatne registry w ekranach.

### 2. `scripts/check-closeflow-no-direct-entity-icons.cjs`

Sprawdza kluczowe powierzchnie encji:

- `src/pages/Leads.tsx`
- `src/pages/Clients.tsx`
- `src/pages/Cases.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/CaseDetail.tsx`

Zasada:

- ikony encji mają iść przez `EntityIcon` albo wrappery typu `LeadEntityIcon`, `ClientEntityIcon`, `CaseEntityIcon`,
- nie tworzymy lokalnych importów ikon encji z `lucide-react` jako prywatnego systemu ikon,
- wyjątek musi być jawnie oznaczony komentarzem `@closeflow-allow-direct-entity-icon` i opisany w review.

### 3. `scripts/check-closeflow-no-unclassified-css-imports.cjs`

Sprawdza, czy importy CSS nie pojawiają się jako przypadkowe, nieopisane lokalne style.

Zasada:

- style mają iść przez sklasyfikowane miejsca w `src/styles/`,
- lokalne importy CSS wymagają jawnego wyjątku `@closeflow-allow-css-import`,
- nowy styl bez klasyfikacji nie powinien wejść boczną furtką.

### 4. `scripts/check-closeflow-no-local-finance-panels.cjs`

Sprawdza, czy system zna slot:

```text
detail.financePanel
```

Zasada: no local finance panels.

Panele finansowe nie mogą wracać jako lokalne, ekranowe twory z własnym układem i własnym stylem. Ich logiczne miejsce jest w slocie:

```text
detail.financePanel
```

Dotyczy szczególnie:

- Lead detail,
- Client detail,
- Case detail.

## Co VS-9 blokuje

VS-9 ma blokować powrót do wzorca:

- każdy ekran ma własne ikony encji,
- każdy ekran ma własne importy CSS,
- każdy ekran ma własny panel finansów,
- każdy ekran ma lokalne mapy tonów, kolorów i pozycji,
- Lead / Client / Case zaczynają się znowu rozjeżdżać wizualnie.

## Co VS-9 nie robi

VS-9 nie wykonuje screenshot QA. Screenshot QA należy do VS-8.

VS-9 nie przepina jeszcze ekranów Lead / Client / Case pod sloty. Do tego służy kolejny etap wdrożeniowy.

VS-9 nie usuwa istniejących starych paneli bez osobnego etapu. Najpierw zamyka bramkę anty-drift, potem można bezpiecznie sprzątać konkretne ekrany.

## Kryterium zakończenia

Etap VS-9 jest zakończony, gdy przechodzi:

```bash
npm run verify:closeflow-visual-system
npm run build
```

Wynik oczekiwany:

```text
CLOSEFLOW_NO_LOCAL_VISUAL_DRIFT_VS9_OK
CLOSEFLOW_NO_DIRECT_ENTITY_ICONS_VS9_OK
CLOSEFLOW_NO_UNCLASSIFIED_CSS_IMPORTS_VS9_OK
CLOSEFLOW_NO_LOCAL_FINANCE_PANELS_VS9_OK
```

## Następny logiczny etap

Po VS-9 można dopiero robić właściwe przepięcie ekranów Lead / Client / Case pod wspólne sloty:

- `page.primaryActions`
- `page.secondaryActions`
- `detail.headerActions`
- `detail.quickActions`
- `detail.financePanel`
- `detail.notesPanel`
- `detail.tasksPanel`
- `detail.eventsPanel`
- `detail.dangerZone`

Najpierw bramka. Potem operacja na ekranach. Nie odwrotnie.
