# 2026-06-10 — STAGE231B0-R9 — Client history and case view model

## Status
LOCAL_ONLY_PREPARED

## FAKTY Z KODU
- R8 jest w repo i rozdziela aktywne/zamknięte źródła spraw.
- Przed R9 /cases miało mylący widok all oznaczający aktywne.
- Przed R9 ClientDetail renderował zamknięte sprawy pod aktywnymi w zakładce Sprawy.
- Finanse klienta używają mode: 'all_cases' i to zostaje.

## DECYZJE DAMIANA
- Zamknięte sprawy klienta są archiwum relacji i mają być w Historii.
- Zakładka Sprawy pokazuje aktywne sprawy.
- /cases ma jawny model: Otwarte, Zamknięte, Wszystkie.
- Layout klienta ma być szerszy i czytelny na dużych ekranach.
- Nie ruszać kosztów, wykresów, SQL, Google Calendar ani płatności/prowizji.

## TESTY
```powershell
node scripts/check-stage231b0-r9-client-history-and-case-view-model.cjs
node --test tests/stage231b0-r9-client-history-and-case-view-model.test.cjs
node scripts/check-stage231b0-r8-case-archive-relation-truth.cjs
node --test tests/stage231b0-r8-case-archive-relation-truth.test.cjs
node scripts/check-stage231b0-case-close-archive-finance-truth.cjs
node --test tests/stage231b0-case-close-archive-finance-truth.test.cjs
node scripts/check-stage228r25-delete-flow-source-truth.cjs
node scripts/check-stage228r41-delete-flow-final-validate.cjs
npm run build
git diff --check
```

## Ryzyka / audit po etapie
- Manual QA musi potwierdzić, że zamknięta sprawa znika ze Spraw i pojawia się w Historii klienta.
- Manual QA musi potwierdzić, że Wszystkie sprawy pokazują otwarte i zamknięte.
- Sprawdzić, czy zamknięte sprawy nie pokazują aktywnych ryzyk operacyjnych.


## R9-R2 Cases URL reader repair
- R9 initial apply stopped at guard because Cases.tsx did not contain literal searchParams.get('view').
- This repair inserts the R9 URL view reader and adapts the R8 regression guard to accept the R9 open/closed/all source model.


## R9-R3 Closed case banner repair
- R9-R2 stopped at guard because `Cases.tsx` still lacked visible `SPRAWA ZAMKNIĘTA` label.
- Repair inserts a real banner element in the `/cases` row/card rendering surface and tightens guard with data marker.


## R9-R5 Client history renderer guard repair
- R9-R4 stopped because static check expected `Otwórz` inside the history segment, while the history section renders closed cases via `renderClientCaseSmartCardStage231B0R8(..., { closed: true })`.
- Repair keeps product behavior and adjusts the guard to validate actions via renderer plus history mapping.


## R9-R6 Right rail guard robust repair
- R9-R5 stopped because guard expected `</SimpleFiltersCard>` after `data-stage228g-cases-shortcuts-source-truth`.
- Repair makes the guard accept component close, self-close, aside close, main start, or fallback to file end while still validating labels directly.


## R9-R8 R8 setter wrapper scan repair
- R9-R7 stopped because it searched for `toggleCaseView` after the R9 setter.
- Repair finds the end of `setCaseViewStage231B0R9` by brace scanning and inserts a stable R8 -> R9 wrapper.


## R9-R9 Cases items JSX syntax repair
- R9-R8 passed R9/R8/Stage231B0 guards but build failed on `src/pages/Cases.tsx` because the `SimpleFiltersCard` prop was `items=[...]` instead of JSX expression `items={[...]}`.
- Repair changes only JSX prop syntax and reruns full validation.


## R9-R10 ClientDetail JSX section close repair
- R9-R9 passed R9/R8/Stage231B0 guards but build failed at the end of `ClientDetail.tsx` with mismatched closing tags.
- Repair restores the missing central `</section>` before the right rail `<aside>`.
