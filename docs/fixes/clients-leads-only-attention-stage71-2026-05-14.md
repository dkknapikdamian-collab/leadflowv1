# CloseFlow Stage71 - Clients right rail leads-only attention

Date: 2026-05-14

## Problem

Admin feedback for /clients reported that the right rail attention card was showing client records, while the user expected lead records only.

## Fix

- Replaced the legacy client-based follow-up candidate source with lead-based candidates.
- Replaced the card title from Klienci do uwagi to Leady do uwagi.
- Added explicit missing relation labels: Brak klienta / Brak sprawy.
- Added links to /leads/:leadId from the card rows.
- Added a regression guard.

## Manual test

Open /clients and check the right rail card:
- it should be titled Leady do uwagi,
- it should contain only lead rows,
- rows should open /leads/:leadId,
- no client rows should be rendered there just because they are client records.
