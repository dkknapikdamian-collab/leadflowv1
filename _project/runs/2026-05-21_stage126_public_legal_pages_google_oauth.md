# 2026-05-21 - Stage126 public privacy and terms pages for Google OAuth

## Status

LOCAL-ONLY ZIP PATCH.

## Cel

PrzywrĂłciÄ‡ publiczne strony wymagane przez Google Auth Platform Branding:

- `/privacy`
- `/terms`

Po wdroĹĽeniu moĹĽna wpisaÄ‡ w Google Branding:

- Application home page: `https://closeflowapp.vercel.app/`
- Application privacy policy link: `https://closeflowapp.vercel.app/privacy`
- Application terms of service link: `https://closeflowapp.vercel.app/terms`

## Zakres

Dodane pliki:

- `src/pages/LegalPrivacy.tsx`
- `src/pages/LegalTerms.tsx`
- `src/pages/legal-public-pages.css`
- `tests/stage126-public-legal-pages-google-oauth.test.cjs`
- `_project/runs/2026-05-21_stage126_public_legal_pages_google_oauth.md`

Zmieniony plik:

- `src/App.tsx`

## Decyzje

- Strony sÄ… publiczne, dostÄ™pne bez logowania.
- TreĹ›Ä‡ jest praktyczna i minimalna pod Google OAuth, nie jest peĹ‚nym dokumentem kancelarii prawnej.
- Nie ruszamy Google Calendar code, envĂłw, Supabase, Stripe, Resend ani AI.

## Testy

- `node tests/stage126-public-legal-pages-google-oauth.test.cjs`
- `npm run build`

## Manual QA

Po deployu sprawdziÄ‡ publicznie:

- `https://closeflowapp.vercel.app/privacy`
- `https://closeflowapp.vercel.app/terms`

NastÄ™pnie wpisaÄ‡ te URL-e w Google Auth Platform -> Branding.

