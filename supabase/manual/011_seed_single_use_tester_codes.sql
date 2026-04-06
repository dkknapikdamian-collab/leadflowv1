insert into public.promo_codes (
  code,
  kind,
  effect_type,
  effect_value,
  is_active,
  max_redemptions,
  used_count,
  expires_at,
  allowed_email,
  allowed_domain,
  note
)
values
  ('TEST1',  'tester_access', 'tester_unlimited', '{}'::jsonb, true, 1, 0, null, null, null, 'Single-use tester code TEST1'),
  ('TEST2',  'tester_access', 'tester_unlimited', '{}'::jsonb, true, 1, 0, null, null, null, 'Single-use tester code TEST2'),
  ('TEST3',  'tester_access', 'tester_unlimited', '{}'::jsonb, true, 1, 0, null, null, null, 'Single-use tester code TEST3'),
  ('TEST4',  'tester_access', 'tester_unlimited', '{}'::jsonb, true, 1, 0, null, null, null, 'Single-use tester code TEST4'),
  ('TEST5',  'tester_access', 'tester_unlimited', '{}'::jsonb, true, 1, 0, null, null, null, 'Single-use tester code TEST5'),
  ('TEST6',  'tester_access', 'tester_unlimited', '{}'::jsonb, true, 1, 0, null, null, null, 'Single-use tester code TEST6'),
  ('TEST7',  'tester_access', 'tester_unlimited', '{}'::jsonb, true, 1, 0, null, null, null, 'Single-use tester code TEST7'),
  ('TEST8',  'tester_access', 'tester_unlimited', '{}'::jsonb, true, 1, 0, null, null, null, 'Single-use tester code TEST8'),
  ('TEST9',  'tester_access', 'tester_unlimited', '{}'::jsonb, true, 1, 0, null, null, null, 'Single-use tester code TEST9'),
  ('TEST10', 'tester_access', 'tester_unlimited', '{}'::jsonb, true, 1, 0, null, null, null, 'Single-use tester code TEST10')
on conflict (code) do update
set
  kind = excluded.kind,
  effect_type = excluded.effect_type,
  effect_value = excluded.effect_value,
  is_active = excluded.is_active,
  max_redemptions = excluded.max_redemptions,
  expires_at = excluded.expires_at,
  allowed_email = excluded.allowed_email,
  allowed_domain = excluded.allowed_domain,
  note = excluded.note,
  updated_at = now();
