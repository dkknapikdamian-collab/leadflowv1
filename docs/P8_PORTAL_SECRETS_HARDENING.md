# P8 — Portal secrets hardening

## Cel

Portal klienta nie może działać produkcyjnie na domyślnych sekretach.

## Co zmieniono

- `src/server/_portal-token.ts` wymaga w produkcji:
  - `PORTAL_TOKEN_PEPPER`,
  - `PORTAL_SESSION_SECRET`.
- Jeśli `NODE_ENV=production` albo `VERCEL_ENV=production` i brakuje sekretu, kod rzuca:
  - `PORTAL_SECRET_CONFIG_MISSING`,
  - status HTTP 500.
- Usunięto stare produkcyjne poleganie na literalnych fallbackach:
  - `closeflow-portal-v1`,
  - `closeflow-portal-session-v1`.
- `.env.example` i `README.md` dokumentują wymagane sekrety.
- Dodano guard `check:p8-portal-secrets-hardening`.

## Zakres

Nie zmieniano UX portalu ani długości tokenów.

## Ręczne sprawdzenie produkcyjne

1. Na środowisku produkcyjnym usuń `PORTAL_TOKEN_PEPPER` albo `PORTAL_SESSION_SECRET`.
2. Wejdź w endpoint generowania linku lub tworzenia sesji portalu.
3. Oczekiwane: `500 PORTAL_SECRET_CONFIG_MISSING`.
4. Dodaj oba sekrety.
5. Oczekiwane: generowanie linku i tworzenie sesji działa.
6. Zmień `PORTAL_TOKEN_PEPPER`.
7. Oczekiwane: stare tokeny portalu nie przechodzą walidacji.
