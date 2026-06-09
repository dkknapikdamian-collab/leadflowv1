# Stage230A7 - commit clean Stage230 report encoding

- data i godzina: 2026-06-09 18:15 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: encoding cleanup / stage closure
- status: prepared by ZIP runner

## Powód

Stage230A6 poprawił roadmapę i guard, ale po selektywnym commit/push zostały lokalnie zmodyfikowane powiązane pliki run/obsidian update Stage230A i Stage230A4. Te pliki są częścią pamięci etapu, więc nie powinny zostać jako brudny working tree.

## Zakres

- przepisać czystym UTF-8 bez BOM:
  - `_project/runs/2026-06-09_1645_stage230a_ai_draft_inbox_voice_capture_roadmap.md`,
  - `_project/obsidian_updates/2026-06-09_1645_stage230a_ai_draft_inbox_voice_capture_roadmap.md`,
  - `_project/runs/2026-06-09_1730_stage230a4_ascii_backlog_repair_and_push.md`,
  - `_project/obsidian_updates/2026-06-09_1730_stage230a4_ascii_backlog_repair_and_push.md`.
- dodać ten run report i Obsidian update.
- nie ruszać runtime.

## Testy

- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- git diff --check
- git diff --cached --check

## Audyt ryzyk

- Bez tego świeży clone mógłby mieć czystą roadmapę, ale stare run/obsidian update w repo nadal byłyby uszkodzone kodowaniem.
- Runtime aplikacji nie jest dotykany.
