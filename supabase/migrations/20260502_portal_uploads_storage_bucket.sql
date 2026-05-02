-- CloseFlow P15 — private Supabase Storage bucket for client portal uploads
-- Run in Supabase SQL editor or through your normal migration flow.
-- Bucket is private. Uploads are performed only by the backend with SUPABASE_SERVICE_ROLE_KEY.
-- Do not add public/authenticated SELECT/INSERT policies for this bucket.

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
  ]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  updated_at = now();

-- Defensive cleanup for common unsafe policy names. If your project has other
-- custom policies on storage.objects, inspect them manually before deleting.
drop policy if exists "Public read access for portal uploads" on storage.objects;
drop policy if exists "Public upload access for portal uploads" on storage.objects;
drop policy if exists "Anyone can view portal uploads" on storage.objects;
drop policy if exists "Authenticated users can upload portal files" on storage.objects;

-- Manual verification query. Expected result: no policies granting anon/authenticated
-- broad access to bucket_id = 'portal-uploads'.
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and (
    policyname ilike '%portal%'
    or qual ilike '%portal-uploads%'
    or with_check ilike '%portal-uploads%'
  )
order by policyname;
