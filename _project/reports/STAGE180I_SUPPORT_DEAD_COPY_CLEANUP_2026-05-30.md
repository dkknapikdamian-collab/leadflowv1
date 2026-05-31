# STAGE180I - Support dead copy cleanup after right rail removal

## Cel
Usunąć martwe teksty po usunięciu prawego panelu z zakładki `Zgłoszenia`.

## Kontekst
Stage180H usunął blok `support-right-rail`, ale guard wykrył, że w `SupportCenter.tsx` pozostały martwe teksty z usuniętych kart, np. `Co zgłaszać jako problem?`.

## Zakres
- `src/pages/SupportCenter.tsx`
  - usuwa martwe copy z prawego panelu,
  - usuwa opis pod `Wszystkie zgłoszenia`,
  - zostawia formularz zgłoszenia i listę zgłoszeń.
- `src/styles/visual-stage17-support-vnext.css`
  - wymusza jedną kolumnę po usunięciu prawego panelu.
- `scripts/check-stage180i-support-dead-copy-cleanup.cjs`
  - pilnuje, żeby skasowane teksty i `support-right-rail` nie wróciły.

## Testy
- `node scripts/check-stage180i-support-dead-copy-cleanup.cjs`
- `npm run build`

## Czego nie ruszano
- Supabase
- RLS
- API zgłoszeń
- deployment
- push

## Następny krok
Restart dev servera i ręczna kontrola `/help` po `Ctrl + F5`.
