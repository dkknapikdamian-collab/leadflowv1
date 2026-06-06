# STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX — report

## Teza

R10C nie doszedł do testów, bo patcher użył zbyt kruchego znacznika końca funkcji `restoreConflictCandidate`. R10C2 naprawia patcher oraz właściwy błąd R10B: w flow tworzenia leada nadal istniała ścieżka `updateClientInSupabase({ archivedAt: null })` dla kandydata typu `client`.

## Zmiana

- `restoreConflictCandidate` blokuje `candidate.entityType === 'client'` i pokazuje komunikat, żeby otworzyć klienta albo utworzyć osobnego leada.
- `restoreConflictCandidate` może przywrócić tylko leada.
- Kandydaci typu `client` są oznaczani `canRestore=false` przed zapisaniem do `leadConflictCandidates`.
- Stale, niezatwierdzone pliki z nieudanego R10C są usuwane przez APPLY.
- Dodano guard/test R10C2 i wpięcie do `prebuild`.

## Testy wymagane

- `npm run check:stage226r10c2-lead-client-conflict-restore-block-patcher-fix`
- `npm run test:stage226r10c2-lead-client-conflict-restore-block-patcher-fix`
- `npm run check:stage226r10b-lead-client-conflict-single-dialog`
- `npm run test:stage226r10b-lead-client-conflict-single-dialog`
- `npm run check:stage226r10-lead-client-separation-runtime`
- `npm run test:stage226r10-lead-client-separation-runtime`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## Audyt ryzyk

- Ten etap nie czyści produkcyjnych danych. Jeśli wcześniej błędnie powstały klienty, to wymaga osobnego audytu danych.
- Ten etap nie naprawia Google Calendar timezone. R11 nadal osobno.
- Ten etap usuwa tylko niezatwierdzone pliki R10C, nie commit R10B.
- Najważniejszy guard: brak `await updateClientInSupabase` w bloku `restoreConflictCandidate`.
