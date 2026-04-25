# Stripe checkout app URL scheme fix v2

Data: 2026-04-25

## Problem

Stripe/BLIK checkout zwracal blad:

Invalid URL: An explicit scheme (such as https) must be provided.

Powod: APP_URL / NEXT_PUBLIC_APP_URL / VITE_APP_URL mogl byc wpisany jako sama domena bez https://.

## Poprawka

- dodano normalizeAppUrl
- domeny produkcyjne bez schematu dostaja https://
- localhost dostaje http://
- success_url i cancel_url sa skladane z bezpiecznego appUrl

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi
- Stripe checkout nie zwraca bledu Invalid URL
