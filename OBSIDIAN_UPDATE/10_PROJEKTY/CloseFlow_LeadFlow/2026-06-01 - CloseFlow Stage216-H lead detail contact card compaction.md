---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216H
status: pushed_for_vercel_visual_review
date: 2026-06-01
---

# 2026-06-01 - CloseFlow Stage216-H lead detail contact card compaction

## FAKTY
- Stage216-G wygląda dobrze, ale karta leada była za szeroka i powtarzała header.

## DECYZJE DAMIANA
- Wdrażamy kompakcję karty kontaktowej.
- Pchamy do gita, żeby sprawdzić na Vercel.
- Nie używać git add .

## ZMIANY
- Karta kontaktowa pokazuje tylko telefon, e-mail i firmę.
- Nazwa, status i ostatni kontakt zostają w headerze.
- Pusta prawa karta Najbliższa akcja znika, jeśli nie ma akcji.

## RYZYKA
- To jest visual refinement, nie test API.
- Working tree może mieć lokalne zmiany D2, więc commit musi być targetowany.

## NASTĘPNY KROK
- Po deployu sprawdzić widok leada na Vercel.
