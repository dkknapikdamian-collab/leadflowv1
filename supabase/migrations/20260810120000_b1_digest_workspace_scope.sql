-- LF-SEC-CG-001A: dedupe digest/report sends by workspace, report type and date.
-- The older email-only index can suppress a legitimate report in another workspace.

do $$
begin
  if exists (
    select 1
    from public.digest_logs
    where workspace_id is not null
    group by workspace_id, report_type, sent_for_date
    having count(*) > 1
  ) then
    raise exception 'B1 digest log duplicates require reviewed cleanup before the workspace-scoped unique index can be applied';
  end if;
end $$;

drop index if exists public.idx_digest_logs_once_per_day;
drop index if exists public.digest_logs_one_report_per_day_idx;

create unique index if not exists digest_logs_one_report_per_workspace_day_idx
  on public.digest_logs (workspace_id, report_type, sent_for_date)
  where workspace_id is not null;
