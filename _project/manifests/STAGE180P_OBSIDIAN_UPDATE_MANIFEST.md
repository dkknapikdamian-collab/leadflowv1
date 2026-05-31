# OBSIDIAN_UPDATE_MANIFEST - STAGE180P Billing plan tone and right rail cleanup

- canonical_name: CloseFlow / LeadFlow
- project_id: CloseFlow / LeadFlow
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- target Obsidian folder: 10_PROJEKTY/CloseFlow_LeadFlow / DO_POTWIERDZENIA
- report: _project/reports/STAGE180P_BILLING_PLAN_TONE_RIGHT_RAIL_CLEANUP_2026-05-30.md

## Do zapisania w Obsidianie

FAKTY:
- Stage180O padł na błędzie patchera Node: `ReferenceError: statusPlanToneKey is not defined`.
- Stage180P zastępuje go bezpiecznym patchem lokalnym.

DECYZJE DAMIANA:
- Tekst o płatności Stripe/BLIK pod wyborem okresu ma zniknąć.
- Kafelek `Status dostępu` ma mieć kolor/obramowanie planu.
- Ikony/kropki w prawym panelu Billing mają być ukryte.

TESTY:
- `node scripts/check-stage180p-billing-plan-tone-right-rail-cleanup.cjs`
- `npm run build`

NASTĘPNY KROK:
- Sprawdzić `/billing` po restarcie dev servera i Ctrl+F5.
