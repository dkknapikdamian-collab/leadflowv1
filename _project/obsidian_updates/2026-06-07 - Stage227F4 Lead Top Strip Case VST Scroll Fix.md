# Stage227F4 - Lead Top Strip Case VST Scroll Fix

Data: 2026-06-07 14:10 Europe/Warsaw

## Cel
Dopiąć top strip w LeadDetail do wizualnego źródła prawdy CaseDetail i usunąć hash-anchor scroll, który powodował ucięcie widoku po kliknięciu.

## Zakres F4R4
- Lead top strip używa klas CaseDetail: `case-detail-stage220a10-tabs-wrap`, `case-detail-tabs`, `case-detail-stage220a10-tabs`.
- Top strip używa `button`, nie `a href="#..."`.
- Scroll jest kontrolowany przez `scrollIntoView`, bez zmiany URL hash.
- Dodano jawny marker `data-stage227f4-case-vst-tabs-source="case-detail-stage220a10-tabs"`.
- Dodano końcowy CSS override z dokładnymi selektorami, żeby nie wygrywały stare bloki F3.

## Testy
- `npm run check:stage227f4-lead-top-strip-case-vst-scroll-fix`
- `npm run test:stage227f4-lead-top-strip-case-vst-scroll-fix`
- regresja F3
- regresja C2
- `npm run build`
- `git diff --check`

## Ryzyka
- Wymagany visual check: top strip ma wyglądać jak pasek CaseDetail, nie jak osobne białe kafle.
- Scroll po kliknięciu musi pozwalać wrócić normalnie do góry.
