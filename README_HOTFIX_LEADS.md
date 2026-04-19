# LeadFlow leads hotfix 1

Ten hotfix robi dwie rzeczy:

1. Naprawia natychmiastowy błąd dodawania leada przy rozjeździe schematu Supabase.
2. Daje SQL wyrównujący tabelę `public.leads` do aktualnych oczekiwań API.

## Pliki
- `api/leads.ts`
- `SUPABASE_SQL_LEADS_HOTFIX_1.sql`

## Wdrażanie
1. Podmień `api/leads.ts` w repo.
2. Odpalić cały SQL z `SUPABASE_SQL_LEADS_HOTFIX_1.sql` w Supabase SQL Editor.
3. Zrobić build.
4. Commit i push.

## Po wdrożeniu sprawdź
- dodanie nowego leada
- edycję leada
- oznaczenie leada jako zagrożony
- zapis kolejnego kroku i terminu ruchu
