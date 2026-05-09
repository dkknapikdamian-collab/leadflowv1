# CLOSEFLOW VS-7 Repair10 - Stage31 lead value label dedupe

Cel: naprawic build po Stage31 lead value meta repair bez zmiany kontraktu listy leadow.

Problem:
- `verify:closeflow:quiet` zatrzymal sie na buildzie Vite/esbuild.
- `src/pages/Leads.tsx` mial zdublowane `const leadValueLabel` w tym samym lokalnym bloku.
- Test Stage31 wymaga nadal `buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel)`.

Zakres:
- Tylko `src/pages/Leads.tsx`.
- Usuniecie nadmiarowej deklaracji `leadValueLabel` przed wywolaniem Stage31 meta.

Nie zmienia:
- Supabase.
- Lead flow.
- Soft delete.
- VS-7 semantic tones.
- UI rendererow metryk.
