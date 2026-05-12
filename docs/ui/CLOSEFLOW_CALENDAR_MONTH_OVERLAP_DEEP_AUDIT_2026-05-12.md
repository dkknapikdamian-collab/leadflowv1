# CloseFlow — Calendar Month Overlap Deep Audit

## Cel

Zrobić audyt przyczyny nakładania tekstu w widoku miesięcznym kalendarza.

## Zakres

Audit-only. Bez zmiany runtime CSS i bez naprawy renderu.

Sprawdza:
- importy CSS w `Calendar.tsx`,
- aktywne warstwy `calendar`, `visual-stage`, `stage37`, `stage39`, `stage40`, `page-adapters`, `emergency`, `page-header`,
- ryzykowne reguły CSS: `absolute`, `negative margin`, `height`, `line-height`, `overflow`, `white-space`, `flex-wrap`, `grid/flex`,
- sygnały renderu w `Calendar.tsx`,
- czy problem powinien być dalej naprawiany CSS-em czy przebudową renderu.

## Wynik

Generuje:
- `docs/ui/CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT.generated.md`
- `docs/ui/CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT.generated.json`

## Ważna teza

Jeżeli po kilku skórkach CSS wpisy dalej nachodzą na siebie, trzeba przestać łatać selektorami i zrobić punktowy komponent renderujący wpis miesiąca:

```tsx
<div className="month-entry-chip" title={fullText}>
  <span className="month-entry-type">Zad</span>
  <span className="month-entry-title">12:41 Wysłać dokumenty...</span>
</div>
```

To będzie czystsze, stabilniejsze i mniej ryzykowne niż kolejne globalne CSS-y.
