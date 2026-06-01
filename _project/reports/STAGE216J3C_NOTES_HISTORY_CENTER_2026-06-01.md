---
typ: project_report
stage: STAGE216J3C
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3C - Notes and History Center

## FAKTY

- J3A uprościł header.
- J3B przeniósł dane leada do jednego lewego panelu.
- J3C dotyczy tylko środkowej kolumny.
- Pierwsza próba J3C zatrzymała się przez literówkę PowerShell przed raportem, buildem i commitem.

## ZMIANY

- Historia kontaktu staje się sekcją Notatki i historia kontaktu.
- Formularz notatki jest szerszy i czytelniejszy.
- Lista historii w widoku głównym pokazuje ostatnie 5 wpisów.
- Dawna sekcja Notatki leada zmienia się w Kontekst leada.
- Zadania i wydarzenia zostają w środku, ale po sekcji historii.

## CZEGO NIE RUSZANO

- Lewy panel danych.
- Prawy panel.
- API.
- SQL/RLS/GRANT.
- Supabase dane.

## TESTY

- node scripts/check-stage216j3c-notes-history-center.cjs
- npm run build
- Vercel visual review.