# Stage227F4 — Lead Top Strip Case VST + Scroll Fix

Status: LOCAL-ONLY, F4R5 regression guard compatibility repair.

## Cel
Lead top strip ma korzystać z wizualnego źródła prawdy CaseDetail i nie może blokować scrolla przez hash anchors.

## F4R5
F4R5 nie zmienia runtime UI. Naprawia regresyjny guard Stage227F3 tak, żeby rozumiał nowy F4 kontrakt: button scroll zamiast linków hash.

## Testy
- npm run check:stage227f4-lead-top-strip-case-vst-scroll-fix
- npm run test:stage227f4-lead-top-strip-case-vst-scroll-fix
- npm run check:stage227f3-lead-history-top-strip-case-header-width
- npm run test:stage227f3-lead-history-top-strip-case-header-width
- npm run check:stage227c2-missing-item-quick-action-modal
- npm run test:stage227c2-missing-item-quick-action-modal
- npm run build
- git diff --check
