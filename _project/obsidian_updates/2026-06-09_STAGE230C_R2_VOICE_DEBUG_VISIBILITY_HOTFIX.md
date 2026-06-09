# CloseFlow / LeadFlow - STAGE230C-R2 Voice debug visibility/readability hotfix

Data: 2026-06-09 Europe/Warsaw
Status: DO_APPLY_LOCAL_ONLY_AND_TEST
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App

## FAKTY
- Stage230C został wdrożony i pushnięty, ale manual QA wykazał problem UX: brak widocznego Kopiuj trace oraz biały/nieczytelny tekst w polu/przyciskach.
- Dublowanie tekstu nadal występuje, więc nadal potrzebujemy trace.

## DECYZJE
- R2 naprawia widoczność i kontrast panelu diagnostycznego.
- R2 nie deduplikuje tekstu i nie zmienia pipeline zapisu.

## TESTY
- Stage230B regression
- Stage230C regression
- Stage230C-R2 visibility guard/test
- npm run build
- git diff --check

## RYZYKA
- Jeśli trace nadal będzie niewidoczny na realnym telefonie, potrzebny będzie prostszy fallback tekstowy do ręcznego zaznaczenia.
- Deduplikacja bez trace nadal jest zakazana.

## NASTĘPNY KROK
- Damian wykonuje manual QA i wkleja trace z telefonu.
