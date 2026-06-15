# STAGE_PROJECT_DOCS_ENCODING_REPAIR_001

Data: 2026-06-15 19:15 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Zakres: _project docs only, no runtime, no main.

## FAKTY

- Branch roboczy: dev-rollout-freeze.
- main zostaje w kwarantannie.
- Runtime aplikacji nie byl ruszany.
- Centralne pliki _project mialy mojibake w polskich znakach.
- Dodano guard kodowania dokumentow projektu.

## PLIKI

- _project/04_ETAPY_ROZWOJU_APLIKACJI.md
- _project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md
- _project/06_GUARDS_AND_TESTS.md
- _project/08_CHANGELOG_AI.md
- _project/10_PROJECT_TIMELINE.md
- _project/13_TEST_HISTORY.md
- scripts/check-closeflow-project-docs-encoding.cjs

## TESTY

- node scripts/check-closeflow-branch-scope.cjs
- node scripts/check-closeflow-project-docs-encoding.cjs
- git diff --check

## RYZYKA

- Automatyczna naprawa kodowania moze wymagac recznego przegladu semantyki historycznych wpisow.
- Nie naprawiano runtime ani main.
- Nie scalano galezi.

## NASTEPNY KROK

- Po PASS zrobic selektywny commit na dev-rollout-freeze.
