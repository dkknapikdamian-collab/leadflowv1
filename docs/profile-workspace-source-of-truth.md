# Profile + Workspace Source Of Truth

| Field | Current source | Current write path | Target source | Target read path | Target write path |
| --- | --- | --- | --- | --- | --- |
| `profile.fullName` | Firestore `profiles` / `/api/me` | `Settings.tsx`, `api/me.ts`, legacy login bootstrap | Supabase `profiles.full_name` | `/api/me -> useWorkspace` | `/api/system?kind=profile-settings` |
| `profile.companyName` | Firestore `profiles.companyName` | `Settings.tsx` | Supabase `profiles.company_name` | `/api/me -> useWorkspace` | `/api/system?kind=profile-settings` |
| `profile.email` | Firebase Auth + Firestore mirror + `/api/me` | auth flows, legacy Firestore sync, `api/me.ts` | Firebase Auth for identity, Supabase `profiles.email` for metadata mirror | `/api/me -> useWorkspace` | auth flows + `/api/system?kind=profile-settings` mirror |
| `profile.role` / `profile.isAdmin` | Supabase `profiles` + admin email fallback | `api/me.ts` | Supabase `profiles.role`, `profiles.is_admin` | `/api/me -> useWorkspace` | backend only |
| `profile.appearanceSkin` | Firestore `profiles.appearanceSkin` + `localStorage` | `AppearanceProvider` | Supabase `profiles.appearance_skin` | `/api/me` / API hydrate in `AppearanceProvider` | `/api/system?kind=profile-settings` |
| `profile.planningConflictWarningsEnabled` | `localStorage` | `Settings.tsx` | Supabase `profiles.planning_conflict_warnings_enabled` | `/api/me -> useWorkspace` | `/api/system?kind=profile-settings` with local cache fallback |
| `profile.browserNotificationsEnabled` | `localStorage` | `Settings.tsx` | Supabase `profiles.browser_notifications_enabled` | `/api/me -> useWorkspace` | `/api/system?kind=profile-settings` with local cache fallback |
| `profile.forceLogoutAfter` | Firestore `profiles.forceLogoutAfter` | `Settings.tsx` | Supabase `profiles.force_logout_after` | `/api/me` in `App.tsx` | `/api/system?kind=profile-settings` |
| `workspaceId` | Firestore `profiles.workspaceId`, `/api/me`, `localStorage` header cache | login/bootstrap, workspace ensure, request headers | Supabase `profiles.workspace_id` + resolved workspace in `/api/me` | `/api/me -> useWorkspace` | backend bootstrap / workspace recovery |
| `workspace.planId` | Supabase `workspaces.plan_id`, legacy Firestore fallback | billing / `api/me.ts` | Supabase `workspaces.plan_id` | `/api/me -> useWorkspace` | `/api/workspace-settings` |
| `workspace.subscriptionStatus` | Supabase `workspaces.subscription_status`, legacy Firestore fallback | billing / `api/me.ts` | Supabase `workspaces.subscription_status` | `/api/me -> useWorkspace` | `/api/workspace-settings` |
| `workspace.trialEndsAt` | Supabase `workspaces.trial_ends_at`, legacy Firestore fallback | billing / `api/me.ts` | Supabase `workspaces.trial_ends_at` | `/api/me -> useWorkspace` | `/api/workspace-settings` |
| `workspace.billingProvider` | none / ad hoc | none | Supabase `workspaces.billing_provider` | `/api/me -> useWorkspace` | `/api/workspace-settings` |
| `workspace.providerCustomerId` | none | none | Supabase `workspaces.provider_customer_id` | `/api/me -> useWorkspace` | `/api/workspace-settings` |
| `workspace.providerSubscriptionId` | none | none | Supabase `workspaces.provider_subscription_id` | `/api/me -> useWorkspace` | `/api/workspace-settings` |
| `workspace.nextBillingAt` | none | none | Supabase `workspaces.next_billing_at` | `/api/me -> useWorkspace` | `/api/workspace-settings` |
| `workspace.cancelAtPeriodEnd` | none | none | Supabase `workspaces.cancel_at_period_end` | `/api/me -> useWorkspace` | `/api/workspace-settings` |
| `workspace.dailyDigestEnabled` | Supabase `profiles.daily_digest_email_enabled` | legacy profile writes | Supabase `workspaces.daily_digest_enabled` | `/api/me -> useWorkspace`, `api/daily-digest.ts` | `/api/workspace-settings` |
| `workspace.dailyDigestHour` | Supabase `profiles.daily_digest_hour` | legacy profile writes | Supabase `workspaces.daily_digest_hour` | `/api/me -> useWorkspace`, `api/daily-digest.ts` | `/api/workspace-settings` |
| `workspace.dailyDigestTimezone` | Supabase `profiles.timezone` / `workspaces.timezone` | legacy profile/workspace writes | Supabase `workspaces.daily_digest_timezone` | `/api/me -> useWorkspace`, `api/daily-digest.ts` | `/api/workspace-settings` |
| `workspace.dailyDigestRecipientEmail` | Supabase `profiles.daily_digest_recipient_email` | legacy profile writes | Supabase `workspaces.daily_digest_recipient_email` | `/api/me -> useWorkspace`, `api/daily-digest.ts` | `/api/workspace-settings` |
| `workspace.timezone` | Firestore / Supabase mixed | legacy bootstrap writes | Supabase `workspaces.timezone` | `/api/me -> useWorkspace` | `/api/workspace-settings` |
| `access.*` | client derivation + `/api/me` | derived only | Derived from Supabase workspace data | `/api/me -> useWorkspace -> getAccessSummary` | not persisted |
| Browser notification permission | Browser API | browser permission prompt | Browser API | runtime direct read | browser only |
| Auth provider methods / password / email verification | Firebase Auth | Firebase Auth | Firebase Auth | auth SDK | Firebase Auth |

## Notes

- `localStorage` remains a cache/bootstrap layer only for `workspaceId`, appearance fallback, planning warning fallback, and browser notification fallback.
- Firestore `profiles/workspaces` are no longer a source of truth for app settings in the Supabase path; they remain legacy-only fallback/bootstrap code paths where Supabase is unavailable.
- Digest reads only workspace-level settings after this package.
