# CloseFlow Stage133 — Local Admin Preview

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI dev workflow / local admin preview

## FAKTY

- Damian chce poprawiać UI w prostym lokalnym trybie.
- Panel admina był wcześniej dostępny na górnym pasku tylko dla admina.
- Bez Supabase lokalny profil był `member`, więc panel admina znikał.
- `Layout.tsx` ukrywa toolbar admina przez `isAdmin || isAppOwner`, a `Admin AI` przez `isAdmin`.

## DECYZJA DAMIANA

Przywrócić panel admina w lokalnym trybie, żeby łatwiej zgłaszać błędy UI.

## HIPOTEZA AI

Najbezpieczniej nie wracać do Stage131 ani flag auth. Wystarczy zmienić lokalny fallback profilu w `useWorkspace.ts`, tylko dla `import.meta.env.DEV` i braku Supabase.

## TESTY

```powershell
node scripts/check-stage133-local-admin-preview.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Odpalić lokalnie `npm.cmd run dev`, sprawdzić topbar/admin toolbar i `/settings/ai`.
