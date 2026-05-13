# CloseFlow - CaseDetail history visual P1 Repair5 - 2026-05-13

## Powod

Repair4 zmienil quiet gate na Vite build runner po natywnym crashu Windows/Node, ale stary test tests/closeflow-release-gate-quiet.test.cjs nadal wymagal literalnego runNpmScript('production build', 'build').

## Naprawa

- Quiet gate self-test zostal dopasowany do nowego kontraktu.
- Quiet gate ma dalej wykonywac production build, ale przez scripts/closeflow-vite-build-runner.mjs.
- CaseDetail visual fix zostaje utrzymany.
- QuickActions helper copy pozostaje usuniete.

## Weryfikacja

- node scripts/check-case-detail-history-visual-p1-repair5-2026-05-13.cjs
- node --test tests/closeflow-release-gate-quiet.test.cjs
- node --test tests/case-detail-history-visual-p1-repair5-2026-05-13.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
