# STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE

Date: 2026-06-23 11:15 Europe/Warsaw
Status: APPLIED_PENDING_TEST_OR_PUSH
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Summary

R1E gates Calendar DOM normalizers behind a central policy instead of adding more post-render DOM surgery or deleting high-risk month repairs blindly.

## Tests to record

R1E guard, R1E node test, CF_RUNTIME_00, build, verify quiet, diff check.

## Risk

Month DOM normalizers remain allowed by default, but are now explicit and switchable. Real retirement/removal needs manual smoke or R1F follow-up.
