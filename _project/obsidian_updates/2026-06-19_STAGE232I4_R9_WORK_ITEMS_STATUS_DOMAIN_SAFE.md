# 2026-06-19 11:20 Europe/Warsaw — STAGE232I4_R9_WORK_ITEMS_STATUS_DOMAIN_SAFE

canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
obsidian_folder: 10_PROJEKTY/CloseFlow_Lead_App

## Runtime finding
R8 fixed client source truth but wrote `blocking_missing_item` into `work_items.status`, which violates Supabase check constraint `work_items_status_domain_check`.

## Decision
Missing item identity must not live in `status`. It must live in:
- `type = missing_item`
- `client_id` / `case_id` / `lead_id`
- source entity fields
- record fields
- priority/high for blocker signal when needed

## Test/guard
Add R9 guard and test so future code cannot write `blocking_missing_item` into `work_items.status`.

## Next
Apply R9, run guards/build, push to `dev-rollout-freeze`, smoke on Vercel.
