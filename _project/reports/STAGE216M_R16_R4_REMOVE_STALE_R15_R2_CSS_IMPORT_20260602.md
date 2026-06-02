# STAGE216M-R16-R4 Remove stale R15-R2 CSS import

## Cel
NaprawiÄ‡ Vercel build po R16-R3. ĹšwieĹĽy build na Vercelu nie mĂłgĹ‚ rozwiÄ…zaÄ‡ importu `stage216m-r15-r2-client-notes-source-truth-actual-repair.css` z `page-adapters.css`.

## Diagnoza
R15-R2 byĹ‚ nieudanym etapem i jego plik CSS nie znajduje siÄ™ w repo. Lokalny build przeszedĹ‚, bo w katalogu roboczym mĂłgĹ‚ istnieÄ‡ lokalny/untracked plik po nieudanej paczce. Vercel robi Ĺ›wieĹĽy clone i dlatego import pÄ™ka.

## Zakres
- `src/styles/page-adapters/page-adapters.css`
- `tests/stage216m-r16-r4-page-adapters-imports-resolve-contract.test.cjs`

## Czego nie ruszano
API, Supabase SQL, ClientDetail TSX, pĹ‚atnoĹ›ci, prawa szyna finansĂłw, dane.

## Testy
- `node tests/stage216m-r16-r4-page-adapters-imports-resolve-contract.test.cjs`
- `git diff --check`
- `npm run build`