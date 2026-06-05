# STAGE220A36-R6 — Deploy Unblock Mojibake Cleanup — RUN

Data: 2026-06-05 22:35 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## CEL
Unblock Vercel after Stage220A36-R5 by cleaning R4 guard/test files from BOM and encoding-marker strings.

## ZMIANY
- Rewrote R4 guard and R4 test as clean UTF-8 without BOM.
- Replaced literal mojibake marker regex with numeric codepoint checks.
- Added R6 guard and test to keep modal order and deploy safety.

## STATUS
Do local test and push after PASS.
