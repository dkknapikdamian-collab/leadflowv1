# CLOSEFLOW STAGE14F REPAIR7 FINALIZE RIGHT RAIL — 2026-05-12

## Cel
Domknac Stage14F po serii nieudanych paczek Repair2-Repair6.

## Zakres
- Utrwala pusty stan najblizszej akcji przez `data-lead-next-action-empty="-"`.
- Wymusza realny fallback `Powod: -` w source jako osobna galaz renderu.
- Zachowuje widoczny start service button.
- Nie zmienia flow lead -> sprawa.
- Nie zmienia API/Supabase.

## Akceptacja
- Istniejacy guard Stage14F przechodzi.
- Guard Repair7 przechodzi.
- `npm run build` przechodzi.
- Commit/push tylko po zielonych checkach i buildzie.
