# CloseFlow Phase 0: requireAuthContext alias TSC fix — 2026-05-03

Cel: naprawić ostatni błąd lokalnego i Vercelowego typechecku po konsolidacji helperów runtime.

Problem:
- część starszych handlerów serwerowych importuje `requireAuthContext` z `src/server/_request-scope.ts`;
- helper został zastąpiony nowszym `requireRequestIdentity`, ale importy w handlerach nadal istnieją;
- `vite build` przechodził, ale `tsc --noEmit` wywalał Vercel typecheck.

Zmiana:
- dodano kompatybilny eksport `requireAuthContext(req, bodyInput)`, który deleguje do `requireRequestIdentity(req, bodyInput)`;
- dodano test kontraktu importów dla billing/portal handlerów;
- skrypt sprawdza `tsc --noEmit` przed commitem i pushem.

Nie zmieniać:
- nie przenosić helperów do katalogu `api/`;
- nie zwiększać liczby funkcji Vercel Hobby;
- nie usuwać istniejących handlerów bez osobnego etapu.
