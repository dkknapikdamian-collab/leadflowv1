# CloseFlow Stage82 / Etap 3 - Leads simple filters

Status: applied locally, commit/push skipped by request.

Scope:
- src/pages/Leads.tsx
- tests/stage82-leads-simple-filters-card.test.cjs
- tools/patch-clients-top-value-stage2.cjs is not touched by this stage

What changed:
- /leads now uses SimpleFiltersCard in the right rail.
- The simple filters card is rendered before Najcenniejsze leady.
- The top stat cards are not intentionally changed by this patch.

Manual check:
- Open /leads.
- Right rail should show: Filtry proste, then Najcenniejsze leady.
- Click Aktywne, Zagrozone, Historia, Kosz and confirm the list/filter behavior still works.
