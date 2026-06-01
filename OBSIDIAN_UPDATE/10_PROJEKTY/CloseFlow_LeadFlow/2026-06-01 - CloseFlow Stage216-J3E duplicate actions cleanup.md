---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216J3E
status: pushed_for_vercel_visual_review
date: 2026-06-01
---

# 2026-06-01 - CloseFlow Stage216-J3E duplicate actions cleanup

## FAKTY

- Screenshot z Vercel po J3D pokazał, że środkowe Zadania i wydarzenia dublują prawą kartę Najbliższe działania.
- Szybkie akcje były puste funkcjonalnie, bo zawierały tylko Rozpocznij obsługę.

## DECYZJE

- Prawa kolumna jest głównym miejscem najbliższych działań.
- Środkowa sekcja pokazuje tylko pozostałe działania ponad pierwsze 5.
- Usuwamy zduplikowaną kartę Szybkie akcje.
- Nie używać git add .

## NASTĘPNY KROK

- Po Vercel review ocenić, czy prawą kolumnę trzeba jeszcze spłaszczyć finansowo.