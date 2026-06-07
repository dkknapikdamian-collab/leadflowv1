# Stage227E cleanup E1 case-sensitive marker final verification

Data: 2026-06-07 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Cel

Naprawa dryfu dokument/guard E1 po cleanupie Stage227E. Guard E1 wymaga dokĹ‚adnego lowercase markeru isual source of truth w dokumencie kontraktu.

## Zakres

- Dopisano dokĹ‚adny marker isual source of truth do docs/stages/STAGE227E1_LEAD_DETAIL_IA_CONTRACT.md, jeĹ›li go brakowaĹ‚o.
- Nie ruszano runtime UI.
- Nie ruszano Stage227E2/E3/E4 runtime.

## Testy do wykonania przez skrypt

- 
ode scripts/check-stage227e1-lead-detail-ia-contract.cjs
- 
ode --test tests/stage227e1-lead-detail-ia-contract.test.cjs
- 
ode scripts/check-stage227e2-lead-detail-top-cards-polish.cjs
- 
ode --test tests/stage227e2-lead-detail-top-cards-polish.test.cjs
- 
ode scripts/check-stage227e3-shared-quick-actions-bar.cjs
- 
ode --test tests/stage227e3-shared-quick-actions-bar.test.cjs
- 
ode scripts/check-stage227e4-sales-signal-section.cjs
- 
ode --test tests/stage227e4-sales-signal-section.test.cjs
- git diff --check

## Audyt ryzyk

- Ryzyko runtime: niskie, zmiana dotyczy dokumentu kontraktu i raportu.
- Ryzyko dokumentacyjne: Ĺ›rednie, jeĹ›li do commita trafiÄ… stare repair raporty. Cleanup wczeĹ›niej usunÄ…Ĺ‚ poĹ›rednie repair artifacts; przed commitem sprawdziÄ‡ git status --short.
- Ryzyko guard drift: obniĹĽone przez case-sensitive marker.

## NastÄ™pny krok

Po PASS wykonaÄ‡ lokalny manual UI check LeadDetail/CaseDetail, potem selektywny commit/push.