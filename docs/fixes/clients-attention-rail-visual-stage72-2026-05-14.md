# CloseFlow Stage72 - Clients lead attention rail visual contract

Date: 2026-05-14

## Problem

The /clients right rail card titled "Leady do uwagi" used lead data after Stage71, but its row markup collapsed into one inline text run. On mobile/narrow right rail this made lead names, relation labels and meta unreadable.

## Fix

- Kept the Stage71 data rule: the card still renders lead records only.
- Rebuilt every lead row as a structured right rail row:
  - title,
  - meta,
  - badge group,
  - separate status pills.
- Extended the shared right rail source-of-truth stylesheet instead of adding a one-off local style.
- Added Stage72 guard and wired it into prebuild.

## Manual test

Open /clients and check the right rail card "Leady do uwagi":

- each lead is a separate block,
- title and meta are on separate lines,
- Brak klienta / Brak sprawy are pills, not inline text,
- row click opens /leads/:id,
- the card keeps the shared light right-rail style.
