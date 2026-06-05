# STAGE222 R2 - Owner Risk Rules Foundation

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## Cel

Wdrożyć jedno źródło prawdy dla reguł ryzyka sprzedażowego:
- próg wysokiej wartości,
- cisza 7+/14+,
- brak następnej akcji/ruchu,
- sprawy bez ruchu,
- pieniądze bez ruchu,
bez tworzenia nowego panelu Today.

## FAKTY

- Today ma już sekcję `Wysoka wartość / ryzyko`.
- Today ma już `TODAY_SECTION_KEYS` i `TODAY_SECTION_TITLES`.
- Lokalnie R4 V3 dodał badge przy leadach/klientach.
- Stage222 R2 ma integrować R4, nie nadpisywać go.
- Settings nie ma jeszcze docelowego workspace storage dla progu wysokiej wartości, więc adapter ma jawny fallback.

## DECYZJE DAMIANA

- Wysoka wartość ma być ustawialna.
- Cisza 7+/14 dni ma być widoczna przy rekordzie.
- Sprawy bez ruchu też mają mieć badge przy sprawie.
- Sprawy/pieniądze bez ruchu mają zasilać istniejące ryzyko, nie nowy panel.
- Nie używać `git add .`.
- Push dopiero po akceptacji.

## HIPOTEZY AI

- Najbezpieczniejszy etap to dodać helper owner-risk-rules i wpiąć go w istniejące lead/case badge.
- Today agregację można rozszerzać ostrożnie po zatwierdzeniu badge i progu.

## DO POTWIERDZENIA

- Docelowy backendowy zapis progu wysokiej wartości w workspace settings / Supabase.
- Czy etykieta ma być dokładnie `Cisza 14+ dni` czy krótsza `14+ dni bez ruchu` w widoku leadów.

## ZMIENIONE PLIKI

- `src/lib/owner-control/owner-risk-rules.ts`
- `src/lib/owner-control/owner-risk-settings.ts`
- `src/lib/record-operational-badges.ts`
- `src/pages/Settings.tsx`
- `src/pages/Cases.tsx`
- `scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `tests/stage222-owner-risk-rules-foundation.test.cjs`
- `package.json`
- `_project/*`
- `_project/runs/2026-06-05_stage222_owner_risk_rules_foundation.md`
- `_project/obsidian_updates/2026-06-05 - CloseFlow - Stage222 Owner Risk Rules Foundation.md`

## TESTY AUTOMATYCZNE

```powershell
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## TEST RĘCZNY

- `/settings`: sekcja `Progi ryzyka sprzedaży`, input `Wysoka wartość od`.
- `/leads`: badge z R4 nadal widoczne i używają owner risk rules.
- `/cases`: badge `Brak następnego ruchu`, `Sprawa bez ruchu 7+/14+`, `Pieniądze bez ruchu` gdy dane spełniają warunki.
- `/today`: brak nowej sekcji `Kontrola sprzedaży`; istnieje `Wysoka wartość / ryzyko`.

## RYZYKA

- Adapter ustawień jest local/client fallbackiem, nie docelowym workspace storage.
- Today nadal ma starą część logiki `value >= 5000`; kolejny etap powinien usunąć ten magic number z Today i podpiąć settings runtime.
- LastContactAt nie jest jeszcze prawdziwym źródłem kontaktu. To zakres Stage224.

## NASTĘPNY KROK

Stage223 — Mandatory Next Move / Next Step Contract.
