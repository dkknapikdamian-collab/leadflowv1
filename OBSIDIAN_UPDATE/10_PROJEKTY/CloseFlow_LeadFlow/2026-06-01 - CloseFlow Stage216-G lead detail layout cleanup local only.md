---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216G
status: pushed_for_vercel_visual_review
date: 2026-06-01
---

# 2026-06-01 - CloseFlow Stage216-G lead detail layout cleanup

## FAKTY
- Lead detail miał za dużo pustych ramek i za słabą hierarchię decyzji.
- Damian zaakceptował kierunek cockpit pracy sprzedażowej.

## DECYZJE DAMIANA
- Pchamy Stage216-G do gita, żeby zobaczyć zmianę na Vercel.
- Nie używać git add .

## ZMIANY
- Header bardziej kompaktowy.
- Lewa część jako robocza karta leada.
- Prawa kolumna jako sticky panel decyzji.
- Puste stany z CTA zamiast pustych ramek.

## RYZYKA
- To jest visual review, nie test API.
- Working tree ma inne lokalne zmiany, więc commit musi być targetowany.

## NASTĘPNY KROK
- Po deployu sprawdzić widok leada na Vercel.
