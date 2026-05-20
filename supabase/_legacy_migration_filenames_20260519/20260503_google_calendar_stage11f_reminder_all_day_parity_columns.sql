-- GOOGLE_CALENDAR_STAGE11F_REMINDER_ALL_DAY_PARITY_COLUMNS
alter table if exists public.work_items add column if not exists google_calendar_reminders jsonb;
alter table if exists public.work_items add column if not exists google_reminders_use_default boolean;
alter table if exists public.work_items add column if not exists google_reminders_overrides jsonb;
alter table if exists public.work_items add column if not exists google_all_day boolean default false;
alter table if exists public.work_items add column if not exists google_start_date date;
alter table if exists public.work_items add column if not exists google_end_date date;
