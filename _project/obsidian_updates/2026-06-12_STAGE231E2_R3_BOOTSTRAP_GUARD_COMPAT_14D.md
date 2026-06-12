# CloseFlow / LeadFlow â€” STAGE231E2_R3_BOOTSTRAP_GUARD_COMPAT_14D

- data i godzina: 2026-06-12 24:25 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: hotfix guarda / trial 14 dni / ZIP local-only

## Decyzja

R3 nie zmienia logiki triala. Naprawia tylko stary guard `check-stage231e2-account-trial-bootstrap.cjs`, ĹĽeby akceptowaĹ‚ nowÄ… decyzjÄ™ produktu: trial 14 dni.

## PowĂłd

Po R2 guard 14d przeszedĹ‚, build przeszedĹ‚, ale stary guard R1 blokowaĹ‚ na nieaktualnym markerze w `plans.ts`.

## Testy

```powershell
node scripts/check-stage231e2-account-trial-bootstrap.cjs
node scripts/check-stage231e2-r2-trial-14d-lock.cjs
npm run build
git diff --check
```

## Ryzyka

- R3 nie naprawia danych w bazie.
- JeĹ›li Ĺ›wieĹĽe konto nadal pokazuje zĹ‚y licznik, trzeba sprawdziÄ‡ faktyczne `trial_ends_at` i workspace/profile mapping w Supabase.
- Nie pushowaÄ‡ przed lokalnym PASS.