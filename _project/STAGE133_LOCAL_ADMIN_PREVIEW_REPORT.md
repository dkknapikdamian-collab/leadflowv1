# STAGE133 Local Admin Preview — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: lokalny UI dev bez Supabase / admin toolbar preview

## Cel

Przywrócić widoczność panelu/admin toolbaru w prostym lokalnym trybie bez Supabase i bez Google, żeby Damian mógł łatwiej wskazywać błędy UI.

## FAKTY

- `Layout.tsx` pokazuje toolbar admina przez `canUseAdminDebugToolbar = Boolean(isAdmin || isAppOwner)`.
- `Layout.tsx` pokazuje pozycję `Admin AI` w menu tylko dla `isAdmin`.
- `useWorkspace.ts` w lokalnym trybie bez Supabase budował profil jako zwykły `member`, więc panel admina znikał.
- Patch działa tylko na lokalnym dev fallbacku bez Supabase. Nie nadaje admina przy realnym Supabase.

## DECYZJA

Dodać lokalny profil admin-preview:

- `role: admin`
- `isAdmin: true`
- `isAppOwner: true`
- `appRole: creator`

Tylko w bloku:

```ts
if (!isSupabaseConfigured()) {
  setProfile(import.meta.env.DEV ? buildLocalAdminPreviewProfile(...) : buildLocalProfile(...))
}
```

## Testy

```powershell
node scripts/check-stage133-local-admin-preview.cjs
npm.cmd run build
```

## Test ręczny

1. Odpal:
   ```powershell
   $env:DISABLE_HMR="true"
   npm.cmd run dev
   ```
2. Wejdź na `http://127.0.0.1:3000/`.
3. Sprawdź, czy w topbarze wrócił admin/debug toolbar.
4. Sprawdź, czy w menu jest `Admin AI`.
5. Wejdź w `/settings/ai`.

## Czego nie ruszano

- Supabase
- Google OAuth
- Stripe
- AI runtime
- routing
- dane
- Vercel deploy
- push
