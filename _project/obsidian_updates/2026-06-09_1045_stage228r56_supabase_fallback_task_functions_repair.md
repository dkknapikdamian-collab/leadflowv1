# Obsidian update — Stage228R56 supabase-fallback task function repair

- data i godzina: 2026-06-09 10:45 Europe/Warsaw
- projekt: CloseFlow / LeadFlow
- project_id: DO_POTWIERDZENIA
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: bugfix / guard / build repair

## Wpis do historii zmian

Stage228R56 naprawia pełny blok funkcji taskowych w `src/lib/supabase-fallback.ts` po częściowych poprawkach no-flicker R50-R55. Build wcześniej zatrzymywał się na niepoprawnym ogonie `}) {` przed `softDeleteTaskInSupabase`.

## Testy do dopisania

- R47-R56 guard stack
- R47-R56 node tests
- npm run build
- git diff --check
- test ręczny CF_DEL_TEST_4 po deployu

## Ryzyka

- No-flicker delete emituje lokalną zmianę przed potwierdzeniem API.
- Trzeba ręcznie potwierdzić, że LeadDetail nie miga i rekord nie wraca po refreshu.
- Calendar nie powinien zostać zmieniony funkcjonalnie; był traktowany jako baseline.
