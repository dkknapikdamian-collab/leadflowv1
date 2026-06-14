# STAGE231G R3 - guard/test syntax hotfix

Data: 2026-06-14 HH:mm Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Stage: STAGE231G_LEAD_DETAIL_OPERATIONAL_WIRING_AUDIT_AND_FIX
Hotfix: R3

## PowĂłd

R2 wykonaĹ‚ patch aplikacji i `npm run build` przeszedĹ‚, ale etap nie byĹ‚ zamkniÄ™ty, bo nowo dodane pliki guard/test miaĹ‚y bĹ‚Ä™dy skĹ‚adni JS:

- `scripts/check-stage231g-lead-detail-operational-wiring.cjs` uĹĽywaĹ‚ nieucieczonych pojedynczych cudzysĹ‚owĂłw w tablicy stringĂłw.
- `tests/stage231g-lead-detail-operational-wiring.test.cjs` uĹĽywaĹ‚ niepoprawnego regexu z nieucieczonym `/` w tekĹ›cie `PotencjaĹ‚ / wartoĹ›Ä‡`.

## Zakres R3

Zmieniono tylko:

- `scripts/check-stage231g-lead-detail-operational-wiring.cjs`
- `tests/stage231g-lead-detail-operational-wiring.test.cjs`
- `_project/runs/STAGE231G_R3_GUARD_TEST_SYNTAX_HOTFIX.md`
- `_project/obsidian_updates/2026-06-14_STAGE231G_R3_guard_test_syntax_hotfix.md`

Nie ruszano:

- `LeadDetail.tsx`
- `Leads.tsx`
- CSS
- SQL
- Google Calendar
- billing/trial
- CaseDetail
- ClientDetail
- AI Drafts

## Audyt ryzyk

- R3 nie zmienia runtime aplikacji, tylko walidacjÄ™ etapu.
- Build z R2 przeszedĹ‚, wiÄ™c gĹ‚Ăłwny kod aplikacji jest syntaktycznie poprawny.
- Etap nadal nie powinien byÄ‡ pushowany, dopĂłki R3 guard/test nie przejdÄ….
- `npm run typecheck` w repo nie istnieje; traktowaÄ‡ jako brak skryptu, nie jako regresjÄ™ STAGE231G.

## Testy po R3

Wymagane:

```powershell
node scripts/check-stage231g-lead-detail-operational-wiring.cjs
node --test tests/stage231g-lead-detail-operational-wiring.test.cjs
npm run build
git diff --check
```

## Status

Do uruchomienia lokalnie przez Damiana.
