# FORTECA 004 — BROWSER PROOF

Reference: `004_leads_all.webp` (160924 bytes, 1672x941)
Implementation commit: pending 004
Route: `/leads` filter Wszystkie
Build: TSC PASS, vite build PASS

Steps:
1. Navigate `/leads` at 1440, authenticated workspace with 9 lead fixtures
2. Observe PageHeader: kicker LEADY pill #E5EAF2, title Leady 28px semibold, description Lista aktywnych tematów..., actions Import CSV + Dodaj leada primary #2563EB
3. MetricGrid gap 13 radius 16: Wszystkie 9, Aktywne 2, Wartość 37 488, Zagrożone 1, Historia 7 — each tile clickable filters
4. Search field: height 40-44, border #E5EAF2, radius 12, placeholder Szukaj: nazwa, telefon...
5. Filter toolbar: Status, Źródło, Ryzyko, Kontakt/cisza, Więcej filtrów, reset link — order search+filters+more+reset per spec §5.2
6. List: Record rows with Firma/Lead, Status pill blue, Wartość, Ryzyko, Następny krok, Ostatni kontakt, action menu -> click row navigates `/leads/:leadId`

Comparison to WebP: header/actions/metrics/search/filters/list hierarchy PASS, subtle border #E5EAF2, shadow 0 8px 22px, restrained blue primary, no dead controls, no horizontal scroll.

Result: PASS (earliest Leads owner, subsequent 005-009 reuse)
