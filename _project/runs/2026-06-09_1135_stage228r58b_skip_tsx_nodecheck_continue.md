# Stage228R58B â€” skip invalid TSX node check and continue

- data i godzina: 2026-06-09 11:35 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: runner repair / mass preflight
- status: prepared by ZIP runner

## PowĂłd

R58 zatrzymaĹ‚ siÄ™, bo runner uruchomiĹ‚ `node --check` na pliku `.tsx`. Node nie obsĹ‚uguje bezpoĹ›redniego syntax-check dla TSX. Poprawna kontrola TSX odbywa siÄ™ przez `npm run build` / Vite/esbuild.

## Zakres

- pomija `node --check` dla `.tsx`
- zostawia `node --check` dla `.cjs` i `src/lib/supabase-fallback.ts`
- uruchamia peĹ‚ny stack guardĂłw/testĂłw R47-R58B
- uruchamia `npm run build` jako wĹ‚aĹ›ciwy check TS/TSX

## Audyt ryzyk po etapie

- Ryzyko: bezpoĹ›redni `node --check` na TSX daje faĹ‚szywy FAIL runnera. Kontrola: TSX sprawdza build.
- Ryzyko: build moĹĽe ujawniÄ‡ kolejne bĹ‚Ä™dy po przejĹ›ciu guardĂłw. Kontrola: runner zatrzyma siÄ™ przed commit/push.
