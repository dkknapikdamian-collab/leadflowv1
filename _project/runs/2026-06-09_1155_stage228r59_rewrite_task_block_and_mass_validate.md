# Stage228R59 â€” rewrite task block and mass validate

- data i godzina: 2026-06-09 11:55 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: runtime repair / mass preflight / guard repair
- status: prepared by ZIP runner

## PowĂłd

R58B poprawnie doszedĹ‚ do behavioral guardu, ktĂłry wykryĹ‚ realny problem w `src/lib/supabase-fallback.ts`: blok funkcji taskowych nadal zawieraĹ‚ uszkodzony ogon `}) {` po czÄ™Ĺ›ciowych patchach R50-R56.

## Zakres

- przepisanie caĹ‚ego bloku od `updateTaskInSupabase` do przed `updateEventInSupabase`
- stabilizacja guardĂłw R55-R59
- pominiÄ™cie faĹ‚szywego `node --check` dla TSX
- peĹ‚ny stack guard/test/build/diff-check

## Audyt ryzyk po etapie

- Ryzyko: rÄ™czne Ĺ‚atanie pojedynczego nawiasu zostawia kolejne uszkodzone fragmenty. Kontrola: R59 przepisuje caĹ‚y blok funkcji taskowych.
- Ryzyko: soft delete moĹĽe emitowaÄ‡ obiekt jako id. Kontrola: R59 guard wymaga `id: taskId`.
- Ryzyko: TSX moĹĽe dawaÄ‡ faĹ‚szywy bĹ‚Ä…d przy node --check. Kontrola: TSX sprawdza Vite build.
