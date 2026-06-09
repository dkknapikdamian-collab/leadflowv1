# CloseFlow â€” Stage228R50 no-flicker add/delete work items

Data: 2026-06-09 08:45 Europe/Warsaw

## Decyzja / zakres
Po potwierdzeniu, ĹĽe delete dziaĹ‚a po SQL R46, UX add/delete work items ma dziaĹ‚aÄ‡ jak w kalendarzu: lokalna zmiana natychmiast, API w tle, bez peĹ‚nego migania sekcji.

## Pliki
- src/pages/LeadDetail.tsx
- src/pages/TasksStable.tsx
- src/components/ContextActionDialogs.tsx
- src/lib/supabase-fallback.ts
- src/lib/work-items/no-flicker-mutation.ts
- supabase/sql/2026-06-09_stage228r46_work_items_deleted_status_constraint.sql
- scripts/check-stage228r47-sql-deleted-status-constraint.cjs
- scripts/check-stage228r50-no-flicker-real-anchors.cjs

## Test manualny
CF_DEL_TEST_4: dodaj na karcie leada, usuĹ„, odĹ›wieĹĽ. Wpis ma znikaÄ‡/pojawiaÄ‡ siÄ™ bez migania i nie wracaÄ‡ po refreshu.

## Ryzyka
- UwaĹĽaÄ‡ na rollback po bĹ‚Ä™dzie API.
- UwaĹĽaÄ‡ na liczniki/Today, bo ten etap obejmuje LeadDetail + TasksStable i wspĂłlny event helper, nie peĹ‚ny refaktor caĹ‚ej aplikacji.
