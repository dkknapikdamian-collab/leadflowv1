# STAGE223 R2B - Activity Truth fallback hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- Stage223 R2 apply wykonał się lokalnie, ale runtime test ma 1 fail.
- Failing test: `Stage223 activity truth separates real contact silence from updatedAt fallback activity`.
- Błąd: `lastActivityIsFallback` zwracało `true`, mimo że istniała prawdziwa aktywność kontaktowa.
- Build przeszedł, ale runtime test nie. Build nie wystarcza do akceptacji tego etapu.

## PRZYCZYNA

`activity-truth.ts` mieszał realne kandydaty aktywności i fallback z `updatedAt/createdAt` w jednej liście. Jeżeli `updatedAt` był nowszy niż realny telefon/spotkanie, fallback wygrywał jako `lastActivityAt`.

To łamie decyzję Damiana: `updatedAt` nie może udawać prawdziwego kontaktu ani prawdziwej aktywności, jeśli istnieje realny wpis.

## NAPRAWA

- Rozdzielono:
  - `contactCandidates`,
  - `realActivityCandidates`,
  - `fallbackActivityCandidates`.
- `updatedAt/createdAt` są używane tylko, gdy nie ma żadnego realnego activity/task/event/payment/contact.
- `lastActivityIsFallback` jest `false`, jeżeli istnieje realna aktywność.

## TESTY

```powershell
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-risk-runtime-contract.test.cjs
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Jeżeli wszystkie testy są zielone, Stage223 R2 może iść do jednego commit/push. Bez zielonych runtime testów nie pushować.
