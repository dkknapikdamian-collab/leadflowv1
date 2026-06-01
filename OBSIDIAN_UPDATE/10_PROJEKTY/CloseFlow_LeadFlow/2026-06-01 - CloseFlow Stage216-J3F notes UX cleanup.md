---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216J3F
status: pushed_for_vercel_visual_review
date: 2026-06-01
---

# 2026-06-01 - CloseFlow Stage216-J3F notes UX cleanup

## FAKTY

- Screenshot z Vercel pokazał problem z notatkami: inline pole było mylące, a Kontekst leada dublował historię.
- J3F porządkuje notatki bez ruszania API.

## DECYZJE

- Nie używamy inline textarea w środku.
- Dodaj notatkę i Dyktuj notatkę są akcjami, które otwierają dedykowany modal.
- Kontekst leada pokazuje tylko notatkę źródłową, a nie ostatni wpis z historii.
- Nie używać git add .

## NASTĘPNY KROK

- Po Vercel review sprawdzić dodawanie notatki i wygląd historii.