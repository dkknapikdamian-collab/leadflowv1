---
typ: project_report
stage: STAGE216J3D
status: pushed_for_vercel_visual_review
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3D - Upcoming Actions Rail

## FAKTY

- J3A uprościł header.
- J3B przeniósł dane leada do jednego lewego panelu.
- J3C/J3C2 uporządkowały środek: notatki i historia kontaktu przed zadaniami.
- Pierwsza próba J3D lokalnie przeszła guard i build, ale nie została zacommitowana, bo brakowało raportu _project.

## ZMIANY

- Prawa kolumna zaczyna się od Najbliższe działania.
- Panel pokazuje maksymalnie 5 pozycji z timeline: zadania i wydarzenia z datą.
- Dodano CTA: Dodaj follow-up i Dodaj wydarzenie.
- Stary pojedynczy panel Najbliższa akcja został zastąpiony listą, żeby nie dublować informacji.
- Powiązana sprawa, finanse i szybkie akcje zostają niżej.

## TESTY

- node scripts/check-stage216j3d-upcoming-actions-rail.cjs
- npm run build
- Vercel visual review

## CZEGO NIE RUSZANO

- Lewy panel danych.
- Środkowa kolumna notatek.
- API.
- SQL/RLS/GRANT.
- Supabase dane.
- Storage.
- Google Calendar.
