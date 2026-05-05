# Stage87D - Admin click-to-annotate flow

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Bug i Copy dziaĹ‚aĹ‚y jak ciÄ™ĹĽkie modale. UĹĽytkownik oczekiwaĹ‚ trybu debugowania:

1. Klikam `Bug`, `Copy` albo `Review`.
2. Klikam element na ekranie.
3. Wyskakuje maĹ‚y edytor przy dolnej krawÄ™dzi.
4. WpisujÄ™ uwagÄ™.
5. Enter zapisuje.
6. Element dostaje chwilowy zielony marker, a narzÄ™dzie zostaje aktywne do kolejnego klikniÄ™cia.

## Zmiana

- `Bug` nie otwiera samodzielnego modala po klikniÄ™ciu toolbaru.
- `Copy` nie otwiera samodzielnego modala.
- `Bug`, `Copy`, `Review/Zbieraj` dziaĹ‚ajÄ… jako tryby wyboru elementu.
- KlikniÄ™cie elementu zatrzymuje normalnÄ… akcjÄ™ i otwiera quick editor.
- Enter zapisuje, Shift+Enter zostawia nowÄ… liniÄ™.
- Wybrany element ma niebieski outline.
- Po zapisie element ma chwilowy zielony outline.
- Pojawia siÄ™ status: `Zapisano... MoĹĽesz kliknÄ…Ä‡ kolejny element.`
- Stage87B/Stage87C guardy sÄ… kompatybilne z nowym Stage87D flow.

## Nie zmieniono

- localStorage schema
- eksport JSON/Markdown
- Button Matrix
- backend / Supabase

## Kryterium zakoĹ„czenia

- `check:admin-click-to-annotate` PASS
- `test:admin-click-to-annotate` PASS
- `verify:admin-tools` PASS
- build PASS
- commit + push

## Test rÄ™czny

1. Kliknij `Bug`.
2. Kliknij dowolny przycisk w aplikacji.
3. Zobacz maĹ‚y edytor na dole po prawej.
4. Wpisz `ten przycisk nie dziaĹ‚a`.
5. NaciĹ›nij Enter.
6. SprawdĹş zielony marker i komunikat zapisu.
7. Kliknij kolejny element bez ponownego otwierania narzÄ™dzia.
8. PowtĂłrz dla `Copy` i `Review â†’ Zbieraj`.