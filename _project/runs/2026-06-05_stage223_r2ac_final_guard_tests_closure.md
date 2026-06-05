# STAGE223 R2AC - Final guard/tests closure

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- Stage223 R2 został wypchnięty jako `66b13479`.
- Podetap E wymagał jeszcze finalnego domknięcia guardów i testów.
- Obecnie repo ma:
  - `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - `tests/stage223-owner-risk-runtime-contract.test.cjs`.
- R2AC dodaje:
  - `tests/stage223-owner-movement-risk-system.test.cjs`,
  - ostrzejszy `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - package script `test:stage223-owner-movement-risk-system`.

## ZAKRES

Guard sprawdza:

- `next-move-contract.ts` istnieje i zawiera kontrakt ruchu.
- `activity-truth.ts` istnieje i rozdziela kontakt od fallback activity.
- `owner-risk-rules.ts` przyjmuje `nextMove` i `activityTruth`.
- test końcowy wywołuje realne funkcje runtime, nie tylko tokeny.
- `LeadDetail` nie definiuje lokalnie `Brak następnego ruchu`.
- `CaseDetail` nie definiuje lokalnie `Sprawa bez ruchu`.
- `Today` nie ma nowej sekcji `Kontrola sprzedaży`.
- `Today` nadal ma `Wysoka wartość / ryzyko`.
- badge nie są hard-coded w pięciu miejscach UI.
- progi ciszy `[1,2,3,5,7,14]` są w jednym miejscu.

## CZEGO NIE RUSZAMY

- Contact Cadence Grid.
- Lost Lead Rescue.
- Owner Digest.
- Finance Watchlist jako osobna zakładka.
- AI scoring.
- Automatyczne wiadomości.
- Masowy redesign Today.
- Nowe migracje Supabase.
- Przepisywanie historii aktywności.

## TESTY AUTOMATYCZNE

```powershell
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-movement-risk-system.test.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## TESTY RĘCZNE

- Leads: brak akcji, cisza 7+, cisza 14+, wysoka wartość po progu.
- LeadDetail: status ruchu, brak duplikacji, czytelne badge.
- Cases: brak ruchu, brak następnego ruchu, pieniądze bez ruchu.
- CaseDetail: ryzyko bez mieszania z historią/notatkami.
- Today: brak nowej sekcji, `Wysoka wartość / ryzyko`, kliknięcia do rekordów, brak agresywnego refreshu.

## AUDYT RYZYK

- To etap jakościowy, bez runtime feature.
- Największe ryzyko: guard może być za ostry dla przyszłych UI zmian. To akceptowalne, bo jego celem jest pilnować jednego źródła prawdy po Stage223.

## NASTĘPNY KROK

Po zielonych testach uruchomić lokalnie aplikację i przejść checklistę manualną.
