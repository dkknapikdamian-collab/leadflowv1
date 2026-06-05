# STAGE223 R2AB - Calendar delete button JSX syntax hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2AA przeszedł:
  - Stage105,
  - Stage220A28,
  - Stage95,
  - mass scan 178 testów.
- Build zatrzymał się na składni JSX w:
  `src/pages/Calendar.tsx`
- Błąd:
  `Expected "=>" but found "="`
- Uszkodzony fragment:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`
- Przyczyna:
  wcześniejszy regexowy patch wstawił atrybut `data-cf-destructive-source` do środka `onClick`.

## ZAKRES

- Naprawić tylko składnię buttona usuwania w `Calendar.tsx`.
- Poprawny zapis:
  `data-cf-destructive-source="trash-action-source" onClick={() => onDelete(entry)}`
- Zachować:
  - trash source marker,
  - `trashActionIconClass("mr-1 h-3.5 w-3.5")`,
  - Stage220A20 marker,
  - brak legacy combo w `ScheduleEntryCard`.
- Nie zmieniać:
  - Stage223,
  - Today,
  - Supabase,
  - daily digest,
  - `/api/activities`,
  - Cases.

## TESTY

```powershell
node scripts/stage223-r2w-mass-release-gate-scan.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- To naprawa składni, ale dotyka przycisku usuwania w Calendar.
- Po deployu ręcznie sprawdzić usuwanie wpisu w kalendarzu w tygodniu i selected day.

## NASTĘPNY KROK

Jeżeli `build`, `verify:closeflow:quiet` i `git diff --check` przejdą, wykonać push całego Stage223.
