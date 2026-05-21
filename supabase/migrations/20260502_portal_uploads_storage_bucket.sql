-- Stage129 / P15 - CloseFlow portal upload bucket after Supabase migration
-- Target new Supabase project ref: amrxiaetdocrywnnkoct
-- Run this in Supabase SQL Editor for the NEW project only.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portal-uploads',
  'portal-uploads',
  false,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]::text[]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  updated_at = now();

-- Access model for Stage129:
-- 1. This bucket must stay private: public = false.
-- 2. Do not create public SELECT/INSERT/UPDATE/DELETE policies for anon/authenticated.
-- 3. Uploads are performed only by CloseFlow backend using SUPABASE_SERVICE_ROLE_KEY.
-- 4. Portal authorization happens before upload in /api/storage-upload by validating caseId + portalSession.
-- 5. Future download/read access should be served by a backend endpoint or short signed URLs, not by making the bucket public.
