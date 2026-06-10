# STAGE231D2-R7-R2 R6 regression guard compatibility

- data i godzina: 2026-06-10 17:36 Europe/Warsaw
- status: LOCAL_ONLY_GUARD_COMPAT_PRE_PUSH
- powód: STAGE231D2-R7 celowo zastępuje szeroki top strip układem z kartą meta sprawy jako pierwszą kartą prawego panelu. Stary R6 guard wymagał nieaktualnego tokenu data-stage231d2-r6-top-strip-left-card="true" i blokował etap, mimo że R7 guard/test przeszły.
- zmiana: scripts/check-stage231d2r6-case-detail-top-rail-lift.cjs akceptuje R7 jako supersession R6, jeśli istnieją tokeny data-stage231d2-r7-side-meta-card="true" oraz data-stage231d2-r7-side-meta-layout="true".
- testy: R7 guard/test, R6 compatibility guard/test, R5/D2/R3/D1/D0/D0A/Polish/build/git diff check.
- audyt ryzyk: zmieniamy tylko guard zgodności; układ i funkcje z R7 pozostają bez rozszerzania API/SQL. Limit Vercel 12/12 pozostaje pilnowany przez R3 budget guard.
- następny krok: push R7 + R7-R2, deploy, sprawdzenie produkcji na karcie sprawy.
