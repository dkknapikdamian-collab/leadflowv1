# STAGE228H R3 - Sales Funnel local server fix

Date: 2026-06-07 19:45 Europe/Warsaw
Project: CloseFlow / LeadFlow
Folder: 10_PROJEKTY/CloseFlow_Lead_App
Mode: local-only, no commit, no push

## Summary
- R2 failed before patch due Node patcher syntax error.
- R3 removes Sales Funnel owner panel.
- R3 connects funnel decision tiles to OperatorMetricTile as shared visual source of truth.
- R3 starts local dev server only when the runner receives -StartServer.

## Manual test
Open: http://localhost:3000/dev/funnel

## Risks
- F/G/H are local-only and should be tested together before one selective commit.
- /dev/funnel is a local dev preview route without login; production /funnel remains protected.
