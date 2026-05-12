# CloseFlow — Build Blockers Masscheck LeadDetail Fix

## Cel

Naprawić build blocker z Vercel:

```txt
src/pages/LeadDetail.tsx:1647:96
ERROR: Unterminated string literal
```

## Przyczyna

W `LeadDetail.tsx` fallback tekstu miał brakujący apostrof:

```tsx
<small>{serviceCaseId ? serviceCaseStatusLabel : 'Brak powiązanej sprawy}</small>
```

Powinno być:

```tsx
<small>{serviceCaseId ? serviceCaseStatusLabel : 'Brak powiązanej sprawy'}</small>
```

## Co robi paczka

- poprawia string w `LeadDetail.tsx`,
- dodaje marker naprawy,
- skanuje masowo podobne ryzykowne wzorce,
- odpala `node --check` na wszystkich `.cjs` z paczki,
- odpala `node --check` na skopiowanych narzędziach,
- odpala `npm run build`,
- commit/push.

## Nie rusza

- kalendarza,
- API,
- Supabase,
- danych,
- UI poza jedną literówką w LeadDetail.
