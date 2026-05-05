# Stage86L - fix Stage86K guard syntax

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Stage86K runtime fix zostaĹ‚ wypchniÄ™ty, P14 i build przeszĹ‚y, ale guard `scripts/check-stage86k-billing-workspace-resolution.cjs` miaĹ‚ bĹ‚Ä…d skĹ‚adni w literalnym sprawdzaniu headera `x-workspace-id`.

To byĹ‚ bĹ‚Ä…d guardu, nie bĹ‚Ä…d Stripe runtime.

## Zmiana

- poprawiono cytowanie w `scripts/check-stage86k-billing-workspace-resolution.cjs`
- dodano skrypty:
  - `check:stage86k-billing-workspace-resolution`
  - `test:stage86k-billing-workspace-resolution`
- nie zmieniono runtime billing/Stripe/Google

## Kryterium zakoĹ„czenia

- Stage86K guard PASS
- Stage86K test PASS
- P14 PASS
- Stage86H PASS
- build PASS
- commit + push