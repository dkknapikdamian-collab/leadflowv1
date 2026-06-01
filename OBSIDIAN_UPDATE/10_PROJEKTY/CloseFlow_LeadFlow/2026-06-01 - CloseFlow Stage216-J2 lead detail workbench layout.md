---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216J2
status: pushed_for_vercel_visual_review
date: 2026-06-01
---

# 2026-06-01 - CloseFlow Stage216-J2 lead detail workbench layout

## FAKTY
- Dotychczasowe G/H/I poprawiły części widoku, ale nie rozwiązały logiki pracy z leadem.
- Damian zdecydował: dane w jednym miejscu, notatki szeroko w środku, najbliższe 5 działań po prawej.

## DECYZJE DAMIANA
- Wdrażamy układ workbench.
- Pchamy do gita, żeby sprawdzić na Vercel.
- Nie używać git add .

## ZMIANY
- Dane leada po lewej jako source of truth.
- Notatki i historia kontaktu w środku.
- 5 najbliższych działań z datą po prawej.
- Powiązana sprawa jako Obsługa pod danymi.

## RYZYKA
- To większy patch JSX/CSS niż poprzednie kosmetyki.
- Working tree może mieć lokalne zmiany D2, więc commit musi być targetowany.

## NASTĘPNY KROK
- Po deployu sprawdzić widok leada na Vercel.
