# No-Go Patterns

Do not do these during UI consistency work:

1. Do not add page-specific CSS for a visual rule that appears on multiple screens.
2. Do not use local `text-red-*` or `text-rose-*` for delete/trash icons if the action is shared.
3. Do not copy `ClientDetail` markup into `LeadDetail` or `CaseDetail` just to match layout.
4. Do not remove duplicated action entry points unless the behavior is preserved.
5. Do not change Supabase/API/auth/billing/AI/data logic while doing UI style work.
6. Do not introduce new visible claims like "gotowe" without source-of-truth validation.
7. Do not make UI-only fake features.
8. Do not patch only the currently visible screen when the issue is global.
