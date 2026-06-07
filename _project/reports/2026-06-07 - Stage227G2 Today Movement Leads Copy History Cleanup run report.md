# 2026-06-07 — Stage227G2 Today Movement Leads Copy History Cleanup — run report

## Status

LOCAL_ONLY_PACKAGE_PREPARED

## Zmiany

- Dodano styl neutralnej mini-karty dla helpera/ruchu w WorkItemCard.
- Usunięto wskazane copy z Leads, jeśli występuje w runtime.
- Dodano CSS suppression dla legacy kafelka Historia w top-stripie leada.

## Testy wymagane

- G2 guard/test
- G1R1 guard/test
- G1 guard/test
- F6 guard
- C3B guard
- build
- diff-check

## Audyt ryzyk

- CSS helpera może wpłynąć na każdy helper WorkItemCard, nie tylko tekst "Ruch:". To jest intencjonalne ujednolicenie, ale wymaga visual checku Today.
- Suppression kafelka Historia dotyczy tylko legacy top-card selectors; nie usuwa historii aktywności.
- Jeśli copy w Leads pochodzi z innego komponentu niż Leads.tsx, potrzebny będzie osobny follow-up po lokalnym searchu.
