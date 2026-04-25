# Vercel Hobby daily digest cron fix

Data: 2026-04-25

## Problem

Deploy na Vercel Hobby padal z bledem:

Hobby accounts are limited to daily cron jobs. This cron expression (5 * * * *) would run more than once per day.

## Decyzja

Dla darmowego MVP zostajemy na Vercel Hobby i ustawiamy cron raz dziennie:

5 5 * * *

To oznacza 05:05 UTC, czyli okolo 06:05 czasu polskiego zima i 07:05 czasu polskiego latem.

## Co zmieniono

- vercel.json: /api/daily-digest wraca na dzienny cron,
- api/daily-digest.ts: sprawdzanie godziny workspace jest opcjonalne,
- domyslnie DIGEST_ENFORCE_WORKSPACE_HOUR=false, wiec darmowy cron wysyla raz dziennie,
- jezeli kiedys przejdziemy na Vercel Pro i godzinowy cron, mozna ustawic DIGEST_ENFORCE_WORKSPACE_HOUR=true,
- Settings pokazuje krotka informacje o ograniczeniu darmowego Vercela,
- test daily-digest-email-runtime pilnuje, zeby nie wrocic do godzinowego crona na Hobby.

## Wymagane ENV

- RESEND_API_KEY
- DIGEST_FROM_EMAIL = CloseFlow <onboarding@resend.dev>
- NEXT_PUBLIC_APP_URL albo APP_URL

Nie ustawiaj DIGEST_ENFORCE_WORKSPACE_HOUR na darmowym Vercel.

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi,
- npx.cmd vercel --prod nie blokuje crona,
- po deployu w aplikacji widac diagnostyke digestu.
