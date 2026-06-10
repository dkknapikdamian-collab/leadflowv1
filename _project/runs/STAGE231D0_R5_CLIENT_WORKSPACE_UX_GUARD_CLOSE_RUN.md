# STAGE231D0-R5 — Client workspace UX guard close

Status: LOCAL_ONLY_RESCUE_PRE_PUSH

## Fakty

- R4 patch wykonał większość zmian, ale guard zatrzymał etap na trzech brakach:
  - left finance tile still uses EntityIcon case,
  - run missing token "audyt ryzyk",
  - run missing token "następny krok",
  - obsidian missing token "VISUAL SOURCE OF TRUTH".
- R5 nie zmienia modelu danych ani logiki finansów.
- R5 domyka ikonę finansów klienta i wymagane tokeny dokumentacyjne.

## VISUAL SOURCE OF TRUTH

- Źródło ikon: EntityIcon / ui-system.
- Finance tile: payment.
- Nie dodano nowego lokalnego systemu ikon, kart ani przycisków.

## Testy

- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

## audyt ryzyk

- Możliwa regresja wizualna ogranicza się do kafla finansów w ClientDetail.
- Brak zmian SQL, Supabase, kosztów, Google Calendar, delete/restore i prowizji.
- Ręcznie trzeba sprawdzić, czy Finanse klienta nie są zdublowane i ikona finansów nie wygląda jak sprawa.

## następny krok

- Po PASS i pushu przejść do D1 — model kosztów.
