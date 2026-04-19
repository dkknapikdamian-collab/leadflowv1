# ENVIRONMENT MATRIX

## local
- app url: `http://localhost:3000`
- env name: `development`
- local `.env.local`
- lokalny cache i draft dopuszczalne

## preview / staging
- app url: `https://preview-twoj-projekt.vercel.app`
- env name: `preview`
- osobne klucze Supabase
- osobne klucze mailowe
- bez danych demo dla obcych userow

## production
- app url: `https://twoja-domena.pl`
- env name: `production`
- osobne klucze Supabase
- osobne klucze mailowe
- osobne klucze billingowe
- tylko prawdziwe dane usera

## Rozdzial sekretow
### publiczne
- `NEXT_PUBLIC_*`

### prywatne
- wszystko poza `NEXT_PUBLIC_*`
- tylko backend, server actions, route handlers

## Minimum do uznania etapu
- Vercel podlaczony do repo
- `.env.example` gotowy
- local / preview / production opisane
- miejsce pod auth, baze, SMTP i billing przygotowane
