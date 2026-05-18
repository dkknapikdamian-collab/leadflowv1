# Stage115E - LeadDetail finance actions dialog

## Status
LOCAL ZIP/PUSH PACKAGE PREPARED.

## Scan-first confirmation
- Repo: CloseFlow / leadflowv1.
- Branch expected: dev-rollout-freeze.
- Read files before patch: src/pages/LeadDetail.tsx, src/lib/supabase-fallback.ts, src/styles/visual-stage14-lead-detail-vnext.css, package.json.
- Active source of truth: LeadDetail finance panel + existing /api/payments wrapper in supabase-fallback.

## FAKTY Z FEEDBACKU
- Dodaj zaliczkę and Płatność częściowa did nothing.
- Expected behavior: open a finance-style modal and save a payment or show an explicit disabled state.

## FAKTY Z KODU
- openLeadPaymentDialog was an empty function.
- supabase-fallback exposes fetchPaymentsFromSupabase and createPaymentInSupabase.
- LeadDetail did not fetch lead payments, so the finance panel could not update after saving.

## ZMIANY
- LeadDetail fetches lead payments with fetchPaymentsFromSupabase({ leadId }).
- Lead finance panel derives paid/remaining/billingStatus from payment records.
- openLeadPaymentDialog opens a typed modal for deposit or partial payment.
- handleSaveLeadPayment creates a paid payment record and payment_recorded activity, then reloads LeadDetail.
- source_only is displayed as Źródłowe dane leada, never raw source_only.
- Added Stage115E guard.

## TESTY AUTOMATYCZNE
- node --test tests/stage115-lead-contact-card-client-parity.test.cjs
- node --test tests/stage115-lead-notes-visible-source-contract.test.cjs
- node --test tests/stage115c-lead-inline-note-submit-contract.test.cjs
- node --test tests/stage115-lead-overdue-work-items-red-contract.test.cjs
- node --test tests/stage115-lead-finance-actions-open-dialog.test.cjs
- npm run build

## TEST RĘCZNY DO WYKONANIA
1. Open /leads/:id.
2. Click Dodaj zaliczkę.
3. Expected: modal opens with amount and note fields.
4. Save a positive amount.
5. Expected: toast success, modal closes, finance panel paid/remaining refreshes.
6. Repeat for Płatność częściowa.

## OBSIDIAN
Prepared batch note: 2026-05-18 - CloseFlow Stage115 LeadDetail batch P1.md

## BRAKI I RYZYKA
- This stage records payment in existing payments API. It does not implement invoices, receipts, Stripe, or accounting workflow.
- If payment API rejects schema in a specific environment, the modal still proves action wiring but backend schema must be corrected separately.

## NEXT
Manual QA for whole Stage115 batch and then decide whether finance needs full FIN lead/client/case unification.
