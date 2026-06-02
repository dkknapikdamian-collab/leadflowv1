# STAGE216M-R16-R4 Remove stale R15-R2 CSS import

## FAKTY
- Vercel build po R16-R3 padĹ‚ na nierozwiÄ…zywalnym imporcie CSS: `stage216m-r15-r2-client-notes-source-truth-actual-repair.css`.
- R15-R2 byĹ‚ nieudanym etapem i nie powinien byÄ‡ czÄ™Ĺ›ciÄ… aktywnego import chain.
- R15-R5 i R16-R3 zostajÄ… aktywne.

## DECYZJA
UsunÄ…Ä‡ wyĹ‚Ä…cznie martwy import R15-R2 z `page-adapters.css` i dodaÄ‡ guard sprawdzajÄ…cy, czy wszystkie importy CSS z page-adapters istniejÄ… w repo.

## TESTY
- guard importĂłw page-adapters
- `git diff --check`
- `npm run build`

## NASTÄPNY KROK
Po pushu sprawdziÄ‡ Vercel deployment oraz rÄ™cznie przetestowaÄ‡ modal notatki klienta po Ctrl+F5.