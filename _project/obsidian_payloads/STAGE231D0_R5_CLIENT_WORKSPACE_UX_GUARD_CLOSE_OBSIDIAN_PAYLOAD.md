# CloseFlow / LeadFlow — STAGE231D0-R5 Client workspace UX guard close

Data i godzina: 2026-06-10 Europe/Warsaw

## status

LOCAL_ONLY_RESCUE_PRE_PUSH

## VISUAL SOURCE OF TRUTH

- D0-R5 domyka D0 na podstawie D0A Visual Source of Truth.
- Finance tile klienta używa centralnej semantyki EntityIcon payment.
- Nie dodano nowego lokalnego wzorca karty, badge, buttona ani ikony.

## decyzja

- Client workspace UX cleanup ma być domknięty dopiero po PASS D0 guard/test, D0A regression, Polish guard, build i git diff --check.

## testy

- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

## audyt ryzyk

- Ryzyko: wcześniejsze partial apply D0/D0-R2/D0-R3/D0-R4 zostawiły ślady w working tree, więc push musi być selektywny.
- Ryzyko UI: ręcznie sprawdzić brak duplikatu Finanse klienta oraz poprawną ikonę finansów.
- Nie ruszano SQL, Supabase, Google Calendar, kosztów, prowizji, delete/restore.

## następny krok

- Po PASS/push przejść do D1 — model kosztów.
