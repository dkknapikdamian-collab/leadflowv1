# Stage 4 right rail cleanup hotfix v5

Scope: fix failed Stage 4 cleanup after broken import rewrites and stale guard markers.

Changed:
- repaired known imports in Clients.tsx and Leads.tsx defensively;
- removed stale right rail marker text from src/tests/scripts;
- rewrote stage79/stage81/stage83 guards so they do not contain stale marker strings as literal text;
- replaced ripgrep dependency with Node portable scanning;
- kept right-card untouched.

Commit/push: skipped by request.
