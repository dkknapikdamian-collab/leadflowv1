# Stage A25E - Lead detail null status hotfix

## Cel

Naprawia crash przy otwieraniu szczegolow leada:

```text
Cannot read properties of null (reading 'status')
```

## Przyczyna

`LeadDetail` moze renderowac sie zanim rekord leada zostanie pobrany. Helpery z `src/lib/lead-health.ts` zakladaly, ze obiekt leada zawsze istnieje i czytaly `lead.status`.

## Zmiana

- `LeadHealthInput` przyjmuje teraz `null` i `undefined`.
- Dodano `normalizeLeadHealthInput`.
- Helpery zwracaja bezpieczne wartosci przy braku leada.
- Dodano guard `scripts/check-a25e-lead-health-null-guard.cjs`.

## Weryfikacja

Skrypt wdrozeniowy odpala:

```text
node scripts/check-a25e-lead-health-null-guard.cjs
npm.cmd run check:a25-nearest-planned-action
npm.cmd run check:polish-mojibake
npm.cmd run test:critical
npm.cmd run build
```
