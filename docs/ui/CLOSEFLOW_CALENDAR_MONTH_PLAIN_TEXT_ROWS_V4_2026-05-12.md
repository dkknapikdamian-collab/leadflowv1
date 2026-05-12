# CloseFlow — Calendar Month Plain Text Rows V4

## Cel

Naprawić widok miesięczny kalendarza:

- długie teksty nie mogą się zawijać,
- tekst ma iść do końca szerokości kafelka dnia,
- gdy się nie mieści, ma być `...`,
- po najechaniu ma być pełny tekst,
- wpisy w miesiącu nie mają być mini-kafelkami w kafelku.

## Co robi V4

W widoku `month` normalizuje wpisy do prostych linii tekstu:

```html
<div class="cf-calendar-month-text-row" title="Zad 11:00 wystawić działki">
  <span class="cf-calendar-month-text-type">Zad</span>
  <span class="cf-calendar-month-text-title">11:00 wystawić działki...</span>
</div>
```

## Ważne

To dalej nie zmienia danych ani akcji.

Nie rusza:

- Supabase,
- API,
- dodawania,
- edycji,
- usuwania,
- lewego sidebaru,
- panelu bocznego kalendarza.
