# 2026-06-06 — Stage227E2 Lead Detail Top Cards Polish

Data: 2026-06-06 15:20 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Branch: dev-rollout-freeze
Status: przygotowane do lokalnego wdrożenia ZIP, bez pushu

## Decyzja

Stage227E2 jest drugim etapem po Stage227E1. Nie przebudowuje całego LeadDetail. Naprawia tylko trzy top kafelki i źródło prawdy dla ciszy kontaktu.

## Kolejność

1. Stage227E1 — kontrakt IA + Visual Source of Truth.
2. Stage227E2 — top cards polish.
3. Dopiero później kolejne etapy LeadDetail runtime przebudowy.

## Zakres

- `Aktywny lead` usunięty z top cards.
- `Następny krok` zostaje jako pierwszy kafelek.
- `Wartość` zmieniona na `Potencjał`.
- Dodany `Cisza / ryzyko`.
- Cisza kontaktu nie liczy się z `updatedAt`.

## Testy / guardy

- `npm run check:stage227e2-lead-detail-top-cards-polish`
- `npm run test:stage227e2-lead-detail-top-cards-polish`
- `git diff --check`

## Następny krok

Po lokalnym PASS nie pushować od razu, jeśli Damian chce zebrać kilka etapów w jeden batch. Kolejny etap rozpisać dopiero po potwierdzeniu, że E1 i E2 są lokalnie poprawne.
