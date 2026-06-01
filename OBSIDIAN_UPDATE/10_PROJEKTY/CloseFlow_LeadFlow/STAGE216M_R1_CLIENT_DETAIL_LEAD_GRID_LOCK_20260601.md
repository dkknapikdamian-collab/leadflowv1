# CloseFlow Stage216M-R1 - ClientDetail lead grid lock

## FAKTY

Stage216M poprawiĹ‚ czÄ™Ĺ›Ä‡ wizualnÄ…, ale po screenach nadal byĹ‚a duĹĽa rĂłĹĽnica wzglÄ™dem LeadDetail:
- ClientDetail shell byĹ‚ wÄ™ĹĽszy niĹĽ header i LeadDetail,
- karty byĹ‚y przesuniÄ™te wzglÄ™dem Ĺ›rodka,
- kolumny i kafelki nie trzymaĹ‚y ukĹ‚adu leadowego.

## DECYZJE DAMIANA

- PatrzeÄ‡ kafelek po kafelku.
- WielkoĹ›Ä‡, uĹ‚oĹĽenie i styl majÄ… byÄ‡ jak w LeadDetail.
- Nazwy, ikonki i kolory bÄ™dÄ… dopiero pĂłĹşniej.

## HIPOTEZY AI

GĹ‚Ăłwny problem Stage216M: fixed page/column dimensions skurczyĹ‚y ClientDetail wzglÄ™dem LeadDetail. Stage216M-R1 przywraca realny grid LeadDetail.

## ZAKRES

- CSS-only override `stage216m-r1-client-detail-lead-grid-lock.css`.
- Import po Stage216M.
- Guard dla ukĹ‚adu.
- Bez zmian w Supabase/API/danych/pĹ‚atnoĹ›ciach.

## TESTY

- Stage216M-R1 guard.
- `git diff --check`.
- `npm run build`.

## NASTÄPNY KROK

Deploy i porĂłwnanie lead/client na tym samym viewportcie.
