# Stage20H â€” CaseDetail mojibake repair before Stage20 resume

Cel:
- naprawic prawdziwy blocker guardow: `src/pages/CaseDetail.tsx` zawieral mojibake, przez co Stage86 wspierajacy Stage20 zatrzymywal audit.

Zakres:
- dodaje skrypt `scripts/repair-stage20h-case-detail-mojibake.cjs`,
- naprawia mojibake w `src/pages/CaseDetail.tsx`,
- ponownie instaluje Stage20 real button trigger verifier,
- patchuje aliasy Stage18/Stage19/Stage20,
- wznawia Stage20C.

Nie zmienia:
- logiki aplikacji,
- UI,
- API,
- przeplywu Supabase.

Weryfikacja:
- `node scripts/repair-stage20h-case-detail-mojibake.cjs <repo>`
- `node scripts/check-stage86-context-action-explicit-triggers.cjs`
- `npm run audit:stage20-context-action-real-button-trigger`
- `npm run check:stage20-context-action-real-button-trigger-v1`
- `npm run test:stage20-context-action-real-button-trigger-v1`