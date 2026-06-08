# Stage228R1 - rail tasks-pattern source truth

Data: 2026-06-08 07:30 Europe/Warsaw

## FAKTY
- Debug 2026-06-08 wskazał, że wzorem jest /tasks: tasks-stage178-filter-button oraz tasks-stage178-urgent-button.
- Naprawa dotyczy tylko /leads, /clients i /cases.
- Nie dotykamy /activity, /ai-drafts, /notifications, /help, /settings, /billing ani /funnel w tym etapie.
- Nie dodano runtime mapperów, MutationObserver ani setInterval.

## ZMIANY
- Dodano src/styles/operator-rail-tasks-pattern-stage228r1.css.
- Podpięto CSS w src/main.tsx po closeflow-right-rail-source-truth.css.
- Usunięto znane stare importy stage228 soft-tone/cases-risk z aktywnej ścieżki, jeśli były obecne.
- Guard: npm run check:stage228r1-rail-tasks-pattern.

## TESTY
- npm run check:stage228r1-rail-tasks-pattern
- git diff --check
- ręcznie: /tasks, /leads, /clients, /cases

## RYZYKA
- Lokalny working tree ma stare niecommitowane pliki Stage228. Jeśli któryś plik spoza aktywnej ścieżki nadal wymusza CSS z większą specyficznością, trzeba wykonać computed-style audit.
- Etap nie naprawia kodowania mojibake w /funnel.
