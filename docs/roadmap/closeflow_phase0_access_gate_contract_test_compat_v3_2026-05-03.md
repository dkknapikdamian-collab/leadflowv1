# CloseFlow Phase 0 — access-gate contract test compatibility v3

Data: 2026-05-03

Cel: naprawić zbyt sztywny test `phase0-vercel-typecheck-runtime-helpers`, który wymagał dokładnej sygnatury tekstowej `assertWorkspaceWriteAccess(workspaceId: string, _req?: any)`, mimo że helper jest kompatybilny typowo przez parametry opcjonalne.

Zakres:
- nie zmieniać runtime logiki `src/server/_access-gate.ts`, jeżeli wymagane eksporty już istnieją,
- zmienić test tak, żeby sprawdzał realny kontrakt: eksport funkcji i markery bramki płatnego/trialowego dostępu,
- utrzymać zgodność z Vercel typecheck i release gate.

Kryterium zakończenia:
- targeted helper contract przechodzi,
- lead write access contract przechodzi,
- tsc noEmit przechodzi,
- build przechodzi,
- test:critical przechodzi,
- verify:closeflow:quiet przechodzi,
- release evidence generuje PASS na czystym drzewie po commicie.
