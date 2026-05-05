# Stage90C - Env smoke: PWA/Digest, Portal/Storage, Button Matrix QA

Date: 2026-05-05  
Branch: dev-rollout-freeze  
Status: QA_SMOKE_SCAFFOLD_ADDED  
Package: CUMULATIVE_STAGE90C

## Cel

Wdrożyć kontrolę etapów 13-15 bez udawania, że wszystko zostało kliknięte live.

## Co naprawia Stage90C względem Stage90B

Stage90B padł na dwóch zbyt sztywnych warunkach guardu:

1. `NotificationRuntime must use roughly 60s polling`  
   Poprzedni regex nie wykrywał wariantów typu `60_000`.

2. `portal storage code must reference bucket/storage`  
   Poprzedni guard skanował tylko kilka ścieżek. Stage90C skanuje szerzej `api`, `src/server`, `src/lib`, `src/utils`, `src/pages`, `src/components`.

## Etap 13: Powiadomienia, PWA, digest

Sprawdzamy statycznie:

- `NotificationRuntime` istnieje i jest podpięty w runtime,
- runtime ma interval/polling/refresh contract,
- PWA/service worker nie cacheuje API/auth/storage,
- `vercel.json` ma cron dla daily digest,
- digest server ma kontrakt Resend/log/dedupe.

Live smoke nadal wymagany:

- permission w przeglądarce,
- toast,
- browser notification,
- Vercel cron logs,
- Resend delivery,
- dedupe.

## Etap 14: Portal klienta / storage

Sprawdzamy statycznie:

- endpoint portalu istnieje,
- tokeny portalu są hashowane/scoped,
- upload przez portal ma session/token guard,
- storage/bucket/upload contract występuje w repo.

Live smoke nadal wymagany:

- brak tokenu blokuje,
- token działa,
- upload valid działa,
- upload invalid blokuje,
- plik nie jest publicznie listowalny.

## Etap 15: Button Matrix QA

Dodajemy obowiązkową checklistę:

- trasa,
- przycisk,
- oczekiwany efekt,
- modal/nawigacja/API,
- wynik po reloadzie,
- test/guard,
- status live.

## Kryterium zamknięcia

Etap 13/14/15 można zamknąć dopiero po:

1. `verify:stage90-env-portal-button-qa` przechodzi.
2. Evidence file jest uzupełniony po live smoke.
3. Button Matrix ma wynik live dla kluczowych tras.
4. Portal ma smoke: bez tokenu blokuje, z tokenem działa, upload działa.
5. Digest ma smoke: cron/env/Resend bezpiecznie potwierdzone.
