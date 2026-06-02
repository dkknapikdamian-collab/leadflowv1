---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE219R6
status: prepared_zip
date: 2026-06-02
---

# Stage219-R6 - CaseDetail refresh + flat cards

## FAKTY
- Stage219-R5 ZIP był wadliwy: brakowało plików narzędzia i guarda.
- R6 przygotowuje poprawiony ZIP.
- Cel R6: po zapisie notatki/zadania/wydarzenia widok sprawy ma się odświeżać, a kolorowe kafle mają być niższe i bez opisów pomocniczych.

## DECYZJE DAMIANA
- Praca przez ZIP i lokalny push selektywny.
- Nie używać `git add .`.
- Nie ruszać Supabase, SQL ani API.

## TESTY
- guard Stage219-R6
- build
- git diff check

## NASTĘPNY KROK
Wdrożyć ZIP, uruchomić testy, push selektywny, sprawdzić screen po Vercel deploy.
