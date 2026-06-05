# STAGE223R3-A - Last Contact Intake

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, testy, push po akceptacji

## WERYFIKACJA

Weryfikacja potwierdziła główną tezę: formularze tworzenia leadów i klientów nie zapisują explicit `lastContactAt`.

Korekta do załączonej analizy: `activity-truth.ts` i `next-move-contract.ts` już istnieją po Stage223. Brakuje intake i trwałego zapisu ostatniego kontaktu, nie całego owner movement foundation.

## ZAKRES

- `src/lib/owner-control/last-contact-intake.ts`
- `src/pages/Leads.tsx`
- `src/pages/Clients.tsx`
- `api/leads.ts`
- `api/clients.ts`
- `src/lib/data-contract.ts`
- `src/lib/supabase-fallback.ts`
- `scripts/check-stage223r3-last-contact-intake.cjs`
- `tests/stage223r3-last-contact-intake.test.cjs`
- `supabase/sql/001_stage223r3_add_last_contact_at.sql`

## SQL

Uruchomić w Supabase SQL Editor przed poleganiem na trwałym zapisie daty:

```sql
alter table public.leads
  add column if not exists last_contact_at timestamptz;

alter table public.clients
  add column if not exists last_contact_at timestamptz;
```

Pełny SQL jest w pliku:

`supabase/sql/001_stage223r3_add_last_contact_at.sql`

## TESTY

```powershell
node scripts/check-stage223r3-last-contact-intake.cjs
node --test tests/stage223r3-last-contact-intake.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## TEST RĘCZNY

- Lead: dodaj lead z `Ostatni kontakt` 20 dni temu.
- Klient: dodaj klienta z `Ostatni kontakt` 20 dni temu.
- Walidacja: data jutro ma pokazać `Ostatni kontakt nie może być w przyszłości.`
- Po SQL i odświeżeniu sprawdzić, czy data wraca z API i zasila badge ciszy.

## AUDYT RYZYK

- Bez SQL data może zostać odrzucona przez schema fallback i nie zapisze się w bazie.
- Fallback select chroni produkcję przed awarią przed migracją.
- Nie przenosimy jeszcze daty do sprawy tworzonej z klientem.
