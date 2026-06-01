# STAGE216M-R1 - ClientDetail lead grid lock

## Cel

NaprawiÄ‡ rĂłĹĽnicÄ™ wskazanÄ… po screenach: ClientDetail byĹ‚ skurczony i przesuniÄ™ty wzglÄ™dem LeadDetail. Stage216M uĹĽyĹ‚ fixed page max/kolumn, przez co shell klienta nie trzymaĹ‚ Ĺ›rodka, szerokoĹ›ci i rytmu kafelkĂłw.

## Decyzja Damiana

- porĂłwnywaÄ‡ kafelek po kafelku,
- wielkoĹ›Ä‡, Ĺ›rodek, szerokoĹ›Ä‡ i ukĹ‚ad majÄ… byÄ‡ jak w LeadDetail,
- nazewnictwo, ikonki i kolory pĂłĹşniej.

## Zakres

CSS-only override:
- przywraca ClientDetail do realnej siatki LeadDetail: `300px minmax(0, 1fr) 310px`,
- przywraca `max-width: 1480px`,
- usuwa wpĹ‚yw fixed-width Stage216M na kolumny,
- wyrĂłwnuje header/shell/karty do rytmu LeadDetail,
- nie rusza Supabase, API, CRUD, pĹ‚atnoĹ›ci ani danych.

## Testy

- `node tests/stage216m-r1-client-detail-lead-grid-lock-contract.test.cjs`
- `git diff --check`
- `npm run build`

## NastÄ™pny krok

Po deployu porĂłwnaÄ‡ `/leads/:id` i `/clients/:id` na tym samym viewportcie. JeĹĽeli ukĹ‚ad szerokoĹ›ci jest juĹĽ zgodny, kolejny etap to Stage216N: nazwy, ikonki i kolory.
