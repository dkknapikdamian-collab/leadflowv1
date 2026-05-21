# 2026-05-21 - Stage127B legal UTF-8 footer guard

## Cel

Naprawić masowo mojibake na publicznych stronach prawnych CloseFlow oraz dodać profesjonalne linki prawne na publicznej stronie głównej.

## Zakres

- `src/pages/LegalPrivacy.tsx`
- `src/pages/LegalTerms.tsx`
- `src/pages/legal-public-pages.css`
- `src/pages/PublicLanding.tsx`
- `src/styles/closeflow-public-landing.css`
- `tests/stage127b-legal-utf8-footer-guard.test.cjs`
- `tools/patch-stage127b-legal-utf8-footer-guard.cjs`

## Fakty wejściowe

- `/privacy` i `/terms` działały po Stage126, ale treść miała mojibake: `prywatnoĹ›ci`, `zarzÄ…dzania`, `uĹĽytkownik`.
- Na publicznej stronie głównej brakowało profesjonalnego footera z linkami do `Polityka prywatności` i `Warunki korzystania`.
- Nie ruszamy Google Calendar, Supabase, Vercel ENV, Storage, Resend, Stripe, AI ani importu leadów.

## Testy

- `node tests/stage127b-legal-utf8-footer-guard.test.cjs`
- `npm run build`

## Manual QA po deployu

- `https://closeflowapp.vercel.app/privacy` pokazuje poprawne polskie znaki.
- `https://closeflowapp.vercel.app/terms` pokazuje poprawne polskie znaki.
- `https://closeflowapp.vercel.app/` ma footer z linkami:
  - `Polityka prywatności`
  - `Warunki korzystania`
- Linki prowadzą do właściwych stron.
