# CloseFlow TSC import regression repair — 2026-05-10

Status: naprawa regresji TypeScript po automatycznym import-boundary repairze.

## Problem

API-0 przeszedł: liczba funkcji API spadła do 12/12. `tsc` nadal padał, ale nie przez API-0 ani FIN-5. Źródłem była wcześniejsza automatyczna naprawa importów, która przeniosła symbole do złych modułów, np.:

- `date-fns` helpers do `../components/entity-actions`,
- `Mic`, `Pin` do `react-router-dom`,
- `Tabs`, `FolderKanban`, `Clock3` do `../components/ui-system`,
- helpery Supabase/scheduling do `date-fns`.

## Decyzja

Nie naprawiamy tego kolejnym zgadującym parserem. Przywracamy tylko wskazane ekrany z bazy sprzed commita FIN-5/import repair i zostawiamy:

- FIN-5 panel rozliczeń,
- API-0 konsolidację funkcji Vercel,
- dokumenty i guardy dla FIN-5/API-0.

## Pliki przywracane z bazy

- `src/pages/Calendar.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Login.tsx`
- `src/pages/NotificationsCenter.tsx`
- `src/pages/Tasks.tsx`
- `src/pages/Templates.tsx`

Po restore wykonywana jest tylko mała poprawka entity icons, jeżeli w bazie były jeszcze importowane z `lucide-react`.

## Guardy

- `npm run check:closeflow-tsc-import-regression`
- `npm run check:closeflow-api0-vercel-hobby-functions`
- `npm run check:closeflow-case-settlement-panel`
- `npm run check:closeflow-fin5-import-boundaries-final`
- `npx tsc --noEmit --pretty false`
- `npm run build`
