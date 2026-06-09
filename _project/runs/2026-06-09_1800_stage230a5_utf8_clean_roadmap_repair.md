# Stage230A5 - UTF-8 clean roadmap repair

- data i godzina: 2026-06-09 18:00 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: encoding repair / roadmap quality guard
- status: prepared by ZIP runner

## Powód

Po Stage230A4 GitHub raw pokazał mojibake i BOM w plikach roadmapy. Runtime aplikacji nie został zmieniony, ale pamięć projektu nie może mieć uszkodzonej polszczyzny.

## Zakres

- przepisanie bloku Stage230 w `_project/07_NEXT_STEPS.md` jako UTF-8 bez BOM,
- przepisanie run/obsidian update Stage230A/Stage230A4 jako UTF-8 bez BOM,
- dopisanie guarda kodowania do `scripts/check-stage230a-ai-draft-inbox-roadmap.cjs`,
- test guardu.

## Testy

- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- git diff --check
- git diff --cached --check

## Audyt ryzyk

- Etap nie rusza runtime UI, bazy ani endpointów.
- Guard ma od teraz łapać BOM i typowe sekwencje mojibake w Stage230 plikach, ale nie skanuje całego historycznego `_project/07_NEXT_STEPS.md`, bo tam są stare wpisy z mojibake do osobnego porządkowania.
