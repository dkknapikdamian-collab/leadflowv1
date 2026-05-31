# STAGE180M - Support remove top metrics

## Cel
Usuniecie gornego rzedu kafelkow z widoku /help: Nowe zgloszenie, Status zgloszen, W trakcie.

## Fakty
- Praca lokalna na CloseFlow / LeadFlow.
- Uzytkownik wskazal gorny rzad kafelkow na screenie i decyzje: "to wywalmy".
- Ten etap nie dotyka Supabase, API, RLS, deploy ani push.

## Zmiany
- src/pages/SupportCenter.tsx: usunieto renderowany blok <section className="support-hero-grid">.
- scripts/check-stage180m-support-remove-top-metrics.cjs: dodano guard braku gornego bloku metryk.

## Testy
- node scripts/check-stage180m-support-remove-top-metrics.cjs
- npm run build

## Next step
Uruchomic dev server i sprawdzic /help po Ctrl+F5.
