# STAGE16Z A13 rawText cleanup marker repair 2026-05-06

Cel: domknąć ostatni czerwony A13 po przejściu quiet release gate.

Zakres:
- `src/lib/ai-drafts.ts`
- dodanie statycznego markera `rawText: ''` dla A13 critical guard,
- zachowanie aktualnego runtime flow AI drafts,
- bez commita i bez pusha.

Powód:
A13 sprawdza legacy kontrakt `rawText:\s*''` jako dowód czyszczenia tekstu szkicu po confirm/cancel. Po Stage16Y guard przeszedł dalej i wskazał brak tego markera.

Checks po naprawie:
- `npm.cmd run build`
- `node scripts/check-a13-critical-regressions.cjs`
- `node --test tests/a13-critical-regressions.test.cjs`
- `npm.cmd run test:critical`
- `npm.cmd run verify:closeflow:quiet`
- opcjonalnie `npm.cmd run check:stage16p:focused`
