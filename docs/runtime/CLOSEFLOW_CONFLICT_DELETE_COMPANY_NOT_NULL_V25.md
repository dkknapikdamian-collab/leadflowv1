# CloseFlow conflict delete + company NOT NULL v25

Status: aggregate stabilizer.

Zakres:
- company never goes to lead insert as null,
- conflict dialog has delete action,
- Leads.tsx uses bounded imports,
- supabase-fallback named export guard uses import declarations,
- TypeScript audit runs before build.
