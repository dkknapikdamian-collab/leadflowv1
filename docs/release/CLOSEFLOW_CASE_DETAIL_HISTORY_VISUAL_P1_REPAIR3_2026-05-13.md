# CloseFlow - CaseDetail history visual P1 Repair3 - 2026-05-13

## Powod

Repair2 szukal pierwszego wystapienia "Historia sprawy", ktore nie bylo realnym JSX sekcji. Patcher zatrzymal sie poprawnie, ale warunek byl za waski.

## Naprawa

Repair3 iteruje po wszystkich wystapieniach "Historia sprawy" od konca pliku i szuka najblizszego poprzedzajacego section z case-detail-section-card.

## Zmiany

- CaseDetail.tsx oznacza realna sekcje historii klasa case-detail-history-unified-panel.
- CSS celuje w jawny scope oraz ma fallback dla article[class*="case-detail-work"].
- CaseQuickActions nie zawiera helper copy pod Szybkimi akcjami.
- Dodano guard i test do quiet release gate.

## Weryfikacja

- node scripts/check-case-detail-history-visual-p1-repair3-2026-05-13.cjs
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
