# Obsidian payload - STAGE231D0C LeadListCard client-view freeze

- data i godzina: 2026-06-11 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- typ wpisu: UI freeze + lead tab alignment
- status: prepared in ZIP
- decyzja: Clients card view is frozen; Leads tab reuses repeated visual shell only.
- czego nie ruszano: SQL, Supabase, trial banner, filters, top layout, lead data semantics.
- testy: D0B client freeze guard, Stage231D0C lead guard, node test, diff check, build.
- audyt ryzyk: lead cards have more meta/badges than clients; visual QA is required.
- następny krok: apply, push, manual QA /clients and /leads.
