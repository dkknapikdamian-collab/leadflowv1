# STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_SCAN

- data i godzina: 2026-06-17 15:10 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ: scan-first przed runtime bugfix
- runtime stage: STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX
- status: SCAN_DONE / NO_RUNTIME_CHANGE

## Werdykt

UWAGA: znaleziono slady STAGE232D_R1. Nie wdrazac w ciemno; najpierw ocen duplikat/czesciowe wdrozenie.

## Pliki sprawdzone jako routing / target

### Istnieja

- `AGENTS.md`
- `_project/CODEX_CONTEXT_INDEX.md`
- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232D_I_OWNER_CONTROL_AND_BRAKI_CASE_CLIENT_SOURCE_OF_TRUTH.md`
- `_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md`
- `src/pages/TodayStable.tsx`
- `src/lib/owner-control/owner-control-baseline.ts`
- `src/lib/owner-control/activity-truth.ts`
- `src/lib/owner-control/next-move-contract.ts`
- `src/components/ContextActionDialogs.tsx`
- `src/lib/activity-timeline.ts`
- `src/lib/supabase-fallback.ts`

### Brakuja

- `src/lib/api/leads.ts`
- `src/lib/api/tasks.ts`
- `src/lib/api/events.ts`


## Slady stage/guard/test STAGE232D

| file | line | pattern | text |
|---|---:|---|---|
| `_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md` | 29 | STAGE232D_R1 marker | - `STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX` - zapisany w `10_PROJEKTY/.../04_STAGE232D_I...`; ma byc traktowany jako aktywny etap 04 po `STAGE232J_R1`. |
| `_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md` | 37 | STAGE232D_R1 marker | 2. `STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX` |
| `_project/CODEX_CONTEXT_INDEX.md` | 95 | STAGE232D_R1 marker | 2. STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX |
| `_project/obsidian_updates/2026-06-16_OBSIDIAN_FILE_SEGREGATION_CLOSEFLOW.md` | 33 | STAGE232D_R1 marker | 2. `STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX` |
| `_project/obsidian_updates/2026-06-16_STAGE232D_I_CONTACT_SILENCE_AND_CASE_CLIENT_BRAKI_PLAN.md` | 43 | STAGE232D_R1 marker | STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX |
| `_project/obsidian_updates/2026-06-16_STAGE_QUEUE_PLACEMENT_SYNC.md` | 30 | STAGE232D_R1 marker | 2. STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX |



## Kontakt / cisza / lastContact / Owner Control - wyniki grep

| file | line | pattern | text |
|---|---:|---|---|
| `src/App.tsx` | 10 | contact event | import { isSupabaseEmailVerificationRequiredForUser, signOutFromSupabase } from './lib/supabase-auth'; |
| `src/App.tsx` | 15 | contact event | import EmailVerificationGate from './components/EmailVerificationGate'; |
| `src/App.tsx` | 51 | contact event | import './styles/closeflow-topic-contact-picker-readable-stage169.css'; |
| `src/App.tsx` | 132 | contact event | email: user?.email \|\| '', |
| `src/App.tsx` | 157 | contact event | email: user.email \|\| '', |
| `src/App.tsx` | 161 | contact event | if (isSupabaseEmailVerificationRequiredForUser(user)) { |
| `src/App.tsx` | 259 | contact event | if (isLoggedIn && user && isSupabaseEmailVerificationRequiredForUser(user)) { |
| `src/App.tsx` | 262 | contact event | <EmailVerificationGate user={user} /> |
| `src/components/ClientCreateDialog.tsx` | 34 | contact event | phone: string; |
| `src/components/ClientCreateDialog.tsx` | 35 | contact event | email: string; |
| `src/components/ClientCreateDialog.tsx` | 44 | contact event | phone: '', |
| `src/components/ClientCreateDialog.tsx` | 45 | contact event | email: '', |
| `src/components/ClientCreateDialog.tsx` | 55 | contact event | phone: form.phone.trim(), |
| `src/components/ClientCreateDialog.tsx` | 56 | contact event | email: form.email.trim(), |
| `src/components/ClientCreateDialog.tsx` | 81 | contact event | email?: string; |
| `src/components/ClientCreateDialog.tsx` | 82 | contact event | phone?: string; |
| `src/components/ClientCreateDialog.tsx` | 88 | contact event | const normalizedEmail = input.email.trim().toLowerCase(); |
| `src/components/ClientCreateDialog.tsx` | 89 | contact event | const normalizedPhone = input.phone.trim().replace(/\s+/g, ''); |
| `src/components/ClientCreateDialog.tsx` | 94 | contact event | const email = String(client.email \|\| '').trim().toLowerCase(); |
| `src/components/ClientCreateDialog.tsx` | 95 | contact event | const phone = String(client.phone \|\| '').trim().replace(/\s+/g, ''); |
| `src/components/ClientCreateDialog.tsx` | 99 | contact event | if (normalizedEmail && email === normalizedEmail) return true; |
| `src/components/ClientCreateDialog.tsx` | 100 | contact event | if (normalizedPhone && phone === normalizedPhone) return true; |
| `src/components/ClientCreateDialog.tsx` | 148 | contact event | phone: prepared.phone, |
| `src/components/ClientCreateDialog.tsx` | 149 | contact event | email: prepared.email, |
| `src/components/ClientCreateDialog.tsx` | 158 | contact event | email: prepared.email, |
| `src/components/ClientCreateDialog.tsx` | 159 | contact event | phone: prepared.phone, |
| `src/components/ClientCreateDialog.tsx` | 177 | contact event | clientEmail: prepared.email, |
| `src/components/ClientCreateDialog.tsx` | 178 | contact event | clientPhone: prepared.phone, |
| `src/components/ClientCreateDialog.tsx` | 240 | contact event | <Label>Telefon</Label> |
| `src/components/ClientCreateDialog.tsx` | 242 | contact event | value={form.phone} |
| `src/components/ClientCreateDialog.tsx` | 243 | contact event | onChange={(event) => updateForm({ phone: event.target.value })} |
| `src/components/ClientCreateDialog.tsx` | 251 | contact event | type="email" |
| `src/components/ClientCreateDialog.tsx` | 252 | contact event | value={form.email} |
| `src/components/ClientCreateDialog.tsx` | 253 | contact event | onChange={(event) => updateForm({ email: event.target.value })} |
| `src/components/ClientCreateDialog.tsx` | 254 | contact event | placeholder="kontakt@email.pl" |
| `src/components/CloseFlowPageHeaderV2.tsx` | 18 | contact event | description: 'Lista aktywnych tematów sprzedażowych. Tu zapisujesz kontakty, pilnujesz wartości i szybko widzisz, które leady wymagają ruchu.', |
| `src/components/CloseFlowPageHeaderV2.tsx` | 23 | contact event | description: 'Baza osób i firm w tle. Klient łączy kontakt, leady, sprawy i historię relacji.', |
| `src/components/ContextActionDialogs.tsx` | 129 | contact event | if (merged.includes('dodaj zadanie') \|\| merged.includes('zaplanuj telefon') \|\| merged.includes('follow-up')) return 'task'; |
| `src/components/CreateClientCaseDialog.tsx` | 68 | contact event | clientEmail: String(client?.email \|\| '').trim(), |
| `src/components/CreateClientCaseDialog.tsx` | 69 | contact event | clientPhone: String(client?.phone \|\| '').trim(), |
| `src/components/EmailVerificationGate.tsx` | 7 | contact event | resendEmailConfirmation, |
| `src/components/EmailVerificationGate.tsx` | 12 | contact event | type EmailVerificationGateProps = { |
| `src/components/EmailVerificationGate.tsx` | 16 | contact event | export default function EmailVerificationGate({ user }: EmailVerificationGateProps) { |
| `src/components/EmailVerificationGate.tsx` | 21 | contact event | const email = user.email \|\| ''; |
| `src/components/EmailVerificationGate.tsx` | 24 | contact event | if (!email) { |
| `src/components/EmailVerificationGate.tsx` | 31 | contact event | await resendEmailConfirmation(email); |
| `src/components/EmailVerificationGate.tsx` | 44 | contact event | if (refreshedUser?.emailVerified) { |
| `src/components/EmailVerificationGate.tsx` | 86 | contact event | <p className="mt-1 break-all text-base font-semibold text-slate-900">{email \|\| 'Brak e-maila na sesji'}</p> |
| `src/components/EmailVerificationGate.tsx` | 93 | contact event | <Button type="button" className="h-12 rounded-xl" onClick={handleResend} disabled={resending \|\| checking \|\| signingOut \|\| !email}> |
| `src/components/EntityConflictDialog.tsx` | 19 | contact event | email?: string \| null; |
| `src/components/EntityConflictDialog.tsx` | 20 | contact event | phone?: string \| null; |
| `src/components/EntityConflictDialog.tsx` | 35 | contact event | if (field === 'email') return 'e-mail'; |
| `src/components/EntityConflictDialog.tsx` | 36 | contact event | if (field === 'phone') return 'telefon'; |
| `src/components/EntityConflictDialog.tsx` | 60 | contact event | description = 'Znaleziono podobny rekord po e-mailu, telefonie, nazwie albo firmie. Sprawdź go przed zapisem albo świadomie dodaj mimo to.', |
| `src/components/EntityConflictDialog.tsx` | 96 | contact event | <p className="mt-1 text-xs text-slate-500">Pokrywa się: {(candidate.matchFields \|\| []).map(getMatchLabel).join(', ') \|\| 'dane kontaktowe'}.</p> |
| `src/components/EntityConflictDialog.tsx` | 97 | contact event | <p className="mt-2 text-sm text-slate-700">{[candidate.company, candidate.email, candidate.phone].filter(Boolean).join(' · ') \|\| 'Brak dodatkowych danych kontaktowych.'}</p> |
| `src/components/GlobalQuickActions.tsx` | 21 | contact event | Pasek działa jako toolbar i jest czytelny na telefonie: role="toolbar", aria-label="Szybkie akcje aplikacji", data-global-quick-actions-contract="v97". |
| `src/components/Layout.tsx` | 185 | contact event | function UserCard({ userInitial, name, email }: { userInitial: string; name: string; email?: string \| null }) { |
| `src/components/Layout.tsx` | 191 | contact event | <span className="truncate">{email}</span> |
| `src/components/Layout.tsx` | 510 | contact event | const userEmail = profile?.email \|\| supabaseUser?.email \|\| ''; |
| `src/components/Layout.tsx` | 511 | contact event | const userName = profile?.fullName \|\| supabaseUser?.displayName \|\| userEmail \|\| 'Użytkownik'; |
| `src/components/Layout.tsx` | 512 | contact event | const userInitial = (userName.trim().charAt(0) \|\| userEmail.trim().charAt(0) \|\| 'U').toUpperCase(); |
| `src/components/Layout.tsx` | 632 | contact event | <UserCard userInitial={userInitial} name={userName} email={userEmail} /> |
| `src/components/Layout.tsx` | 668 | contact event | <UserCard userInitial={userInitial} name={userName} email={userEmail} /> |
| `src/components/LeadAiFollowupDraft.tsx` | 26 | contact event | return asText(lead?.name \|\| lead?.company \|\| lead?.email \|\| lead?.phone) \|\| 'Lead'; |
| `src/components/LeadAiFollowupDraft.tsx` | 118 | contact event | <Input placeholder="np. email, SMS, Messenger" value={channel} onChange={(event) => setChannel(event.target.value)} /> |
| `src/components/LeadAiNextAction.tsx` | 25 | contact event | return String(lead?.name \|\| lead?.company \|\| lead?.email \|\| lead?.phone \|\| 'lead'); |
| `src/components/PwaInstallPrompt.tsx` | 2 | contact event | import { Download, Smartphone, X } from 'lucide-react'; |
| `src/components/PwaInstallPrompt.tsx` | 130 | contact event | <Smartphone className="h-5 w-5" /> |
| `src/components/PwaInstallPrompt.tsx` | 134 | contact event | <p className="text-sm font-bold text-slate-900">Dodaj CloseFlow do ekranu głównego telefonu</p> |
| `src/components/QuickAiCapture.tsx` | 48 | contact event | email: input.lead?.email \|\| '', |
| `src/components/QuickAiCapture.tsx` | 49 | contact event | phone: input.lead?.phone \|\| '', |
| `src/components/TaskCreateDialog.tsx` | 14 | contact event | import { TopicContactPicker } from './topic-contact-picker'; |
| `src/components/TaskCreateDialog.tsx` | 28 | contact event | buildTopicContactOptions, |
| `src/components/TaskCreateDialog.tsx` | 29 | contact event | findTopicContactOption, |
| `src/components/TaskCreateDialog.tsx` | 30 | contact event | resolveTopicContactLink, |
| `src/components/TaskCreateDialog.tsx` | 31 | contact event | type TopicContactOption, |
| `src/components/TaskCreateDialog.tsx` | 32 | contact event | } from '../lib/topic-contact'; |
| `src/components/TaskCreateDialog.tsx` | 94 | contact event | const [topicContactOptions, setTopicContactOptions] = useState<TopicContactOption[]>([]); |
| `src/components/TaskCreateDialog.tsx` | 111 | contact event | setTopicContactOptions(buildTopicContactOptions({ |
| `src/components/TaskCreateDialog.tsx` | 119 | contact event | if (!cancelled) setTopicContactOptions([]); |
| `src/components/TaskCreateDialog.tsx` | 128 | contact event | () => findTopicContactOption(topicContactOptions, { |
| `src/components/TaskCreateDialog.tsx` | 133 | contact event | [topicContactOptions, form.leadId, form.caseId, form.clientId, context?.leadId, context?.caseId, context?.clientId], |
| `src/components/TaskCreateDialog.tsx` | 136 | contact event | const handleSelectTaskRelation = (option: TopicContactOption \| null) => { |
| `src/components/TaskCreateDialog.tsx` | 137 | contact event | const relation = resolveTopicContactLink(option); |
| `src/components/TaskCreateDialog.tsx` | 163 | contact event | const relation = resolveTopicContactLink(selectedTaskRelationOption); |
| `src/components/TaskCreateDialog.tsx` | 223 | contact event | <TopicContactPicker |
| `src/components/TaskCreateDialog.tsx` | 224 | contact event | options={topicContactOptions} |
| `src/components/TaskCreateDialog.tsx` | 230 | contact event | placeholder="Wpisz lead, klienta, sprawę, e-mail lub telefon" |
| `src/components/TodayAiAssistant.tsx` | 224 | contact event | {item.phone ? <small>tel. {item.phone}</small> : null} |
| `src/components/TodayAiAssistant.tsx` | 225 | contact event | {item.email ? <small>{item.email}</small> : null} |
| `src/components/appearance-provider.tsx` | 70 | contact event | email: authSnapshot.email \|\| undefined, |
| `src/components/appearance-provider.tsx` | 99 | contact event | }, [authSnapshot.uid, authSnapshot.email, authSnapshot.fullName, isReady]); |
| `src/components/entity-contact-card.tsx` | 2 | contact event | import { Building2, Copy, Mail, Phone } from 'lucide-react'; |
| `src/components/entity-contact-card.tsx` | 4 | contact event | import '../styles/entity-contact-card.css'; |
| `src/components/entity-contact-card.tsx` | 6 | contact event | type ContactIcon = ComponentType<{ className?: string }>; |
| `src/components/entity-contact-card.tsx` | 8 | contact event | type EntityContactInfoListProps = { |
| `src/components/entity-contact-card.tsx` | 9 | contact event | phone?: string \| null; |
| `src/components/entity-contact-card.tsx` | 10 | contact event | email?: string \| null; |
| `src/components/entity-contact-card.tsx` | 12 | contact event | lastContact?: string \| null; |
| `src/components/entity-contact-card.tsx` | 16 | contact event | type EntityContactCardProps = EntityContactInfoListProps & { |
| `src/components/entity-contact-card.tsx` | 46 | contact event | function EntityContactInfoRow({ |
| `src/components/entity-contact-card.tsx` | 52 | contact event | icon: ContactIcon; |
| `src/components/entity-contact-card.tsx` | 57 | contact event | const copyLabel = label === 'Telefon' ? 'Kopiuj telefon' : label === 'E-mail' ? 'Kopiuj email' : `Kopiuj ${label}`; |
| `src/components/entity-contact-card.tsx` | 59 | contact event | <div className="client-detail-info-row cf-entity-contact-info-row"> |
| `src/components/entity-contact-card.tsx` | 60 | contact event | <span className="client-detail-info-icon cf-entity-contact-info-icon"> |
| `src/components/entity-contact-card.tsx` | 70 | contact event | className="client-detail-icon-button cf-entity-contact-copy-button" |
| `src/components/entity-contact-card.tsx` | 82 | contact event | export function EntityContactInfoList({ phone, email, company, lastContact, onCopy }: EntityContactInfoListProps) { |
| `src/components/entity-contact-card.tsx` | 84 | contact event | <div className="client-detail-contact-list cf-entity-contact-list" data-entity-contact-info-list="true"> |
| `src/components/entity-contact-card.tsx` | 85 | contact event | <EntityContactInfoRow icon={Phone} label="Telefon" value={asDisplayValue(phone)} onCopy={onCopy} /> |
| `src/components/entity-contact-card.tsx` | 86 | contact event | <EntityContactInfoRow icon={Mail} label="E-mail" value={asDisplayValue(email)} onCopy={onCopy} /> |
| `src/components/entity-contact-card.tsx` | 87 | contact event | <EntityContactInfoRow icon={Building2} label="Firma" value={asDisplayValue(company, 'Brak firmy')} /> |
| `src/components/entity-contact-card.tsx` | 88 | contact event | <EntityContactInfoRow icon={EventEntityIcon} label="Ostatni kontakt" value={asDisplayValue(lastContact)} /> |
| `src/components/entity-contact-card.tsx` | 93 | contact event | export default function EntityContactCard({ |
| `src/components/entity-contact-card.tsx` | 98 | contact event | phone, |
| `src/components/entity-contact-card.tsx` | 99 | contact event | email, |
| `src/components/entity-contact-card.tsx` | 101 | contact event | lastContact, |
| `src/components/entity-contact-card.tsx` | 106 | contact event | }: EntityContactCardProps) { |
| `src/components/entity-contact-card.tsx` | 112 | contact event | className={['client-detail-profile-card', 'client-detail-side-card', 'cf-entity-contact-card', className].filter(Boolean).join(' ')} |
| `src/components/entity-contact-card.tsx` | 113 | contact event | data-entity-contact-card={entity} |

Uwaga: pokazano 120/1591 wynikow.



## API update/activity/task/event - wyniki grep

| file | line | pattern | text |
|---|---:|---|---|
| `src/App.tsx` | 59 | tasks api | import './styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css'; |
| `src/App.tsx` | 102 | insertActivity | const Activity = lazyPage(() => import('./pages/Activity'), 'Activity'); |
| `src/App.tsx` | 107 | tasks api | const Tasks = lazyPage(() => import('./pages/TasksStable'), 'TasksStable'); |
| `src/App.tsx` | 285 | tasks api | <Route path="/tasks" element={isLoggedIn ? <Tasks /> : <Navigate to="/login" />} /> |
| `src/App.tsx` | 292 | insertActivity | <Route path="/activity" element={isLoggedIn ? <Activity /> : <Navigate to="/login" />} /> |
| `src/components/ActivityItemPreviewDialog.tsx` | 4 | insertActivity | formatRoadmapActivityTitle, |
| `src/components/ActivityItemPreviewDialog.tsx` | 6 | insertActivity | type ActivityRoadmapItem, |
| `src/components/ActivityItemPreviewDialog.tsx` | 7 | insertActivity | } from '../lib/activity-roadmap'; |
| `src/components/ActivityItemPreviewDialog.tsx` | 9 | insertActivity | type ActivityItemPreviewDialogProps = { |
| `src/components/ActivityItemPreviewDialog.tsx` | 11 | insertActivity | item: ActivityRoadmapItem \| null; |
| `src/components/ActivityItemPreviewDialog.tsx` | 13 | insertActivity | onEdit: (item: ActivityRoadmapItem) => void; |
| `src/components/ActivityItemPreviewDialog.tsx` | 14 | insertActivity | onDelete: (item: ActivityRoadmapItem) => void; |
| `src/components/ActivityItemPreviewDialog.tsx` | 30 | insertActivity | function relationLabel(item: ActivityRoadmapItem) { |
| `src/components/ActivityItemPreviewDialog.tsx` | 36 | insertActivity | export function ActivityItemPreviewDialog({ open, item, onOpenChange, onEdit, onDelete }: ActivityItemPreviewDialogProps) { |
| `src/components/ActivityItemPreviewDialog.tsx` | 47 | insertActivity | <div className="cf-activity-note-preview"> |
| `src/components/ActivityItemPreviewDialog.tsx` | 48 | insertActivity | <p className="cf-activity-note-preview__title">{formatRoadmapActivityTitle(item)}</p> |
| `src/components/ActivityItemPreviewDialog.tsx` | 49 | insertActivity | <div className="cf-activity-note-preview__body">{noteText \|\| 'Brak treści notatki.'}</div> |
| `src/components/ActivityItemPreviewDialog.tsx` | 50 | insertActivity | <dl className="cf-activity-note-preview__meta"> |
| `src/components/ActivityItemPreviewDialog.tsx` | 73 | insertActivity | export default ActivityItemPreviewDialog; |
| `src/components/ActivityRoadmap.tsx` | 6 | insertActivity | import ActivityItemPreviewDialog from './ActivityItemPreviewDialog'; |
| `src/components/ActivityRoadmap.tsx` | 7 | insertActivity | import EditActivityNoteDialog from './EditActivityNoteDialog'; |
| `src/components/ActivityRoadmap.tsx` | 9 | insertActivity | formatRoadmapActivityTitle, |
| `src/components/ActivityRoadmap.tsx` | 12 | insertActivity | type ActivityRoadmapItem, |
| `src/components/ActivityRoadmap.tsx` | 13 | insertActivity | type ActivityRoadmapItemKind, |
| `src/components/ActivityRoadmap.tsx` | 14 | insertActivity | } from '../lib/activity-roadmap'; |
| `src/components/ActivityRoadmap.tsx` | 16 | insertActivity | deleteActivityFromSupabase, |
| `src/components/ActivityRoadmap.tsx` | 17 | insertActivity | insertActivityToSupabase, |
| `src/components/ActivityRoadmap.tsx` | 18 | insertActivity | updateActivityInSupabase, |
| `src/components/ActivityRoadmap.tsx` | 21 | insertActivity | type ActivityRoadmapProps = { |
| `src/components/ActivityRoadmap.tsx` | 22 | insertActivity | items: ActivityRoadmapItem[]; |
| `src/components/ActivityRoadmap.tsx` | 43 | insertActivity | function getRoadmapIcon(kind: ActivityRoadmapItemKind) { |
| `src/components/ActivityRoadmap.tsx` | 54 | insertActivity | function getRoadmapTone(kind: ActivityRoadmapItemKind) { |
| `src/components/ActivityRoadmap.tsx` | 65 | insertActivity | function getActivitySourceId(item: ActivityRoadmapItem) { |
| `src/components/ActivityRoadmap.tsx` | 75 | insertActivity | item: ActivityRoadmapItem; |
| `src/components/ActivityRoadmap.tsx` | 76 | insertActivity | onPreview: (item: ActivityRoadmapItem) => void; |
| `src/components/ActivityRoadmap.tsx` | 77 | insertActivity | onEdit: (item: ActivityRoadmapItem) => void; |
| `src/components/ActivityRoadmap.tsx` | 78 | insertActivity | onDelete: (item: ActivityRoadmapItem) => void; |
| `src/components/ActivityRoadmap.tsx` | 85 | insertActivity | <article className="cf-activity-roadmap__row" data-roadmap-kind={item.kind} data-roadmap-tone={tone}> |
| `src/components/ActivityRoadmap.tsx` | 86 | insertActivity | <span className="cf-activity-roadmap__icon" aria-hidden="true"> |
| `src/components/ActivityRoadmap.tsx` | 89 | insertActivity | <span className="cf-activity-roadmap__body"> |
| `src/components/ActivityRoadmap.tsx` | 90 | insertActivity | <strong>{formatRoadmapActivityTitle(item)}</strong> |
| `src/components/ActivityRoadmap.tsx` | 94 | insertActivity | <span className="cf-activity-roadmap__meta"> |
| `src/components/ActivityRoadmap.tsx` | 96 | insertActivity | <span className="cf-activity-roadmap__actions" data-case-note-roadmap-actions="true"> |
| `src/components/ActivityRoadmap.tsx` | 107 | insertActivity | export function ActivityRoadmap({ |
| `src/components/ActivityRoadmap.tsx` | 115 | insertActivity | }: ActivityRoadmapProps) { |
| `src/components/ActivityRoadmap.tsx` | 117 | insertActivity | const [previewItem, setPreviewItem] = useState<ActivityRoadmapItem \| null>(null); |
| `src/components/ActivityRoadmap.tsx` | 118 | insertActivity | const [editItem, setEditItem] = useState<ActivityRoadmapItem \| null>(null); |
| `src/components/ActivityRoadmap.tsx` | 119 | insertActivity | const [deleteItem, setDeleteItem] = useState<ActivityRoadmapItem \| null>(null); |
| `src/components/ActivityRoadmap.tsx` | 122 | insertActivity | const [overrides, setOverrides] = useState<Record<string, ActivityRoadmapItem>>({}); |
| `src/components/ActivityRoadmap.tsx` | 139 | insertActivity | async function handleSaveNote(item: ActivityRoadmapItem, noteText: string) { |
| `src/components/ActivityRoadmap.tsx` | 140 | insertActivity | const sourceId = getActivitySourceId(item); |
| `src/components/ActivityRoadmap.tsx` | 159 | insertActivity | await updateActivityInSupabase({ |
| `src/components/ActivityRoadmap.tsx` | 167 | insertActivity | const nextItem: ActivityRoadmapItem = { |
| `src/components/ActivityRoadmap.tsx` | 189 | insertActivity | const sourceId = getActivitySourceId(item); |
| `src/components/ActivityRoadmap.tsx` | 196 | insertActivity | await deleteActivityFromSupabase(sourceId); |
| `src/components/ActivityRoadmap.tsx` | 197 | insertActivity | await insertActivityToSupabase({ |
| `src/components/ActivityRoadmap.tsx` | 203 | insertActivity | deletedActivityId: sourceId, |
| `src/components/ActivityRoadmap.tsx` | 221 | insertActivity | <section className="cf-activity-roadmap" data-closeflow-activity-roadmap="true" aria-label={title}> |
| `src/components/ActivityRoadmap.tsx` | 223 | insertActivity | <header className="cf-activity-roadmap__header"> |
| `src/components/ActivityRoadmap.tsx` | 233 | insertActivity | <div className="cf-activity-roadmap__list"> |
| `src/components/ActivityRoadmap.tsx` | 245 | insertActivity | <p className="cf-activity-roadmap__empty">{emptyText}</p> |
| `src/components/ActivityRoadmap.tsx` | 249 | insertActivity | <button type="button" className="cf-activity-roadmap__toggle" onClick={() => setExpanded((current) => !current)}> |
| `src/components/ActivityRoadmap.tsx` | 254 | insertActivity | <ActivityItemPreviewDialog |
| `src/components/ActivityRoadmap.tsx` | 262 | insertActivity | <EditActivityNoteDialog |
| `src/components/ActivityRoadmap.tsx` | 286 | insertActivity | export default ActivityRoadmap; |
| `src/components/AddCaseMissingItemDialog.tsx` | 8 | insertActivity | import { insertActivityToSupabase, insertCaseItemToSupabase } from '../lib/supabase-fallback'; |
| `src/components/AddCaseMissingItemDialog.tsx` | 73 | insertActivity | await insertActivityToSupabase({ |
| `src/components/CloseFlowPageHeaderV2.tsx` | 30 | tasks api | tasks: { |
| `src/components/CloseFlowPageHeaderV2.tsx` | 50 | insertActivity | activity: { |
| `src/components/ContextActionDialogs.tsx` | 7 | insertActivity | import { insertActivityToSupabase, insertCaseItemToSupabase, insertTaskToSupabase } from '../lib/supabase-fallback'; |
| `src/components/ContextActionDialogs.tsx` | 36 | insertActivity | const STAGE232A_R8_CONTEXT_ACTION_TASK_ID_ACTIVITY_BRIDGE = 'ContextActionDialogs stores taskId and explicit blocker status in missing_item activity payload for LeadDetail UI compatibility'; |
| `src/components/ContextActionDialogs.tsx` | 37 | insertActivity | void STAGE232A_R8_CONTEXT_ACTION_TASK_ID_ACTIVITY_BRIDGE; |
| `src/components/ContextActionDialogs.tsx` | 269 | insertActivity | await insertActivityToSupabase({ |
| `src/components/ContextActionDialogs.tsx` | 320 | insertActivity | await insertActivityToSupabase({ |
| `src/components/ContextNoteDialog.tsx` | 9 | insertActivity | import { insertActivityToSupabase } from '../lib/supabase-fallback'; |
| `src/components/ContextNoteDialog.tsx` | 82 | insertActivity | const createdNote = await insertActivityToSupabase(input); |
| `src/components/ContextNoteDialog.tsx` | 89 | insertActivity | activity: savedRecord, |
| `src/components/EditActivityNoteDialog.tsx` | 5 | insertActivity | import { getRoadmapItemNoteText, type ActivityRoadmapItem } from '../lib/activity-roadmap'; |
| `src/components/EditActivityNoteDialog.tsx` | 7 | insertActivity | type EditActivityNoteDialogProps = { |
| `src/components/EditActivityNoteDialog.tsx` | 9 | insertActivity | item: ActivityRoadmapItem \| null; |
| `src/components/EditActivityNoteDialog.tsx` | 12 | insertActivity | onSave: (item: ActivityRoadmapItem, noteText: string) => void \| Promise<void>; |
| `src/components/EditActivityNoteDialog.tsx` | 15 | insertActivity | export function EditActivityNoteDialog({ open, item, pending = false, onOpenChange, onSave }: EditActivityNoteDialogProps) { |
| `src/components/EditActivityNoteDialog.tsx` | 45 | insertActivity | export default EditActivityNoteDialog; |
| `src/components/GlobalAiAssistant.tsx` | 3 | tasks api | * leads={context.leads} tasks={context.tasks} events={context.events} cases={context.cases} clients={context.clients} |
| `src/components/GlobalAiAssistant.tsx` | 15 | tasks api | tasks?: unknown[]; |
| `src/components/GlobalAiAssistant.tsx` | 16 | events api | events?: unknown[]; |
| `src/components/GlobalAiAssistant.tsx` | 27 | tasks api | tasks?: unknown[]; |
| `src/components/GlobalAiAssistant.tsx` | 28 | events api | events?: unknown[]; |
| `src/components/GlobalAiAssistant.tsx` | 71 | tasks api | tasks: toArray(props.tasks).length ? props.tasks : toArray(snapshot.tasks), |
| `src/components/GlobalAiAssistant.tsx` | 72 | events api | events: toArray(props.events).length ? props.events : toArray(snapshot.events), |
| `src/components/GlobalQuickActions.tsx` | 136 | tasks api | to="/tasks" |
| `src/components/Layout.tsx` | 450 | tasks api | { icon: CheckSquare, label: 'Zadania', path: '/tasks' }, |
| `src/components/Layout.tsx` | 454 | insertActivity | { icon: History, label: 'Aktywność', path: '/activity' }, |
| `src/components/Layout.tsx` | 476 | tasks api | { icon: CheckSquare, label: 'Zadania', path: '/tasks' }, |
| `src/components/LeadAiFollowupDraft.tsx` | 15 | tasks api | tasks?: Record<string, unknown>[]; |
| `src/components/LeadAiFollowupDraft.tsx` | 16 | events api | events?: Record<string, unknown>[]; |
| `src/components/LeadAiFollowupDraft.tsx` | 29 | tasks api | export default function LeadAiFollowupDraft({ lead, tasks = [], events = [], activities = [], disabled = false }: LeadAiFollowupDraftProps) { |
| `src/components/LeadAiFollowupDraft.tsx` | 54 | tasks api | tasks, |
| `src/components/LeadAiFollowupDraft.tsx` | 55 | events api | events, |
| `src/components/LeadAiNextAction.tsx` | 17 | tasks api | tasks: Record<string, unknown>[]; |
| `src/components/LeadAiNextAction.tsx` | 18 | events api | events: Record<string, unknown>[]; |
| `src/components/LeadAiNextAction.tsx` | 59 | tasks api | export default function LeadAiNextAction({ lead, tasks, events, activities, disabled, onTaskCreated }: LeadAiNextActionProps) { |
| `src/components/LeadAiNextAction.tsx` | 65 | tasks api | const [taskSaving, setTaskSaving] = useState(false); |
| `src/components/LeadAiNextAction.tsx` | 76 | tasks api | tasks, |
| `src/components/LeadAiNextAction.tsx` | 77 | events api | events, |
| `src/components/LeadAiNextAction.tsx` | 119 | tasks api | setTaskSaving(true); |
| `src/components/LeadAiNextAction.tsx` | 135 | tasks api | setTaskSaving(false); |
| `src/components/LeadAiNextAction.tsx` | 198 | tasks api | <Button type="button" onClick={handleCreateSuggestedTask} disabled={taskSaving}> |
| `src/components/LeadAiNextAction.tsx` | 199 | tasks api | {taskSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />} |
| `src/components/StatShortcutCard.tsx` | 9 | tasks api | const ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR = 'ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR_2026_05_07'; |
| `src/components/StatShortcutCard.tsx` | 17 | tasks api | void ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR; |
| `src/components/StatShortcutCard.tsx` | 140 | tasks api | /* ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR_GUARD no-truncate metric-value line-height-safe */ |
| `src/components/TodayAiAssistant.tsx` | 84 | tasks api | tasks?: unknown[]; |
| `src/components/TodayAiAssistant.tsx` | 85 | events api | events?: unknown[]; |
| `src/components/TodayAiAssistant.tsx` | 126 | tasks api | tasks: props.tasks \|\| [], |
| `src/components/TodayAiAssistant.tsx` | 127 | events api | events: props.events \|\| [], |
| `src/components/TodayAiAssistant.tsx` | 131 | tasks api | [props.leads, props.clients, props.cases, props.tasks, props.events, props.activities, props.drafts], |
| `src/components/VisualFoundationRuntime.tsx` | 41 | insertActivity | #root .cf-html-shell .activity-vnext-page, |
| `src/components/VisualFoundationRuntimeStage212B.tsx` | 38 | insertActivity | #root .cf-html-shell .activity-vnext-page, |
| `src/components/VisualFoundationRuntimeStage212B.tsx` | 50 | insertActivity | #root .cf-html-shell :is(.activity-stats-grid, .tasks-operator-metric-grid, .cf-operator-metric-grid, .layout-list, .tasks-stage178-workspace, .tasks-stage178-main-stack, .calendar-week-layout, [class*="stats-grid"], [class*="toolbar"], [cl |

Uwaga: pokazano 120/2324 wynikow.


## Excerpty do nastepnego patcha

### src/pages/TodayStable.tsx:36

```ts
33: import { getAiLeadDraftsAsync, type AiLeadDraft } from '../lib/ai-drafts';
34: import { getNearestPlannedAction } from '../lib/work-items/planned-actions';
35: import { normalizeWorkItem } from '../lib/work-items/normalize';
36: import { buildOwnerControlBaseline } from '../lib/owner-control/owner-control-baseline';
37: import { readOwnerRiskSettings } from '../lib/owner-control/owner-risk-settings';
38: import { useWorkspace } from '../hooks/useWorkspace';
39: import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
```

### src/pages/TodayStable.tsx:37

```ts
34: import { getNearestPlannedAction } from '../lib/work-items/planned-actions';
35: import { normalizeWorkItem } from '../lib/work-items/normalize';
36: import { buildOwnerControlBaseline } from '../lib/owner-control/owner-control-baseline';
37: import { readOwnerRiskSettings } from '../lib/owner-control/owner-risk-settings';
38: import { useWorkspace } from '../hooks/useWorkspace';
39: import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
40: import WorkItemCard, { getWorkItemCardStatusTone } from '../components/work-item-card';
```

### src/pages/TodayStable.tsx:100

```ts
97: const STAGE213C_C_TODAY_FOCUS_VISIBILITY_THROTTLE = 'Stage213C-C: TodayStable focus/visibility refresh is TTL-gated';
98: const TODAY_STABLE_BACKGROUND_REFRESH_TTL_MS = 4 * 60 * 1000;
99: void STAGE213C_C_TODAY_FOCUS_VISIBILITY_THROTTLE;
100: const STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH = 'STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH: Today Wymaga ruchu uses explicit actionRequiredRows; upcoming 7 days uses full count plus preview; task tile label is truthful for overdue/today rows';
101: void STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH;
102: const STAGE232B_R6_TODAY_NO_DEV_HELPER_COPY = 'STAGE232B_R6: Today UI must not show developer explanatory helper copy under Wymaga ruchu';
103: void STAGE232B_R6_TODAY_NO_DEV_HELPER_COPY;
```

### src/pages/TodayStable.tsx:101

```ts
98: const TODAY_STABLE_BACKGROUND_REFRESH_TTL_MS = 4 * 60 * 1000;
99: void STAGE213C_C_TODAY_FOCUS_VISIBILITY_THROTTLE;
100: const STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH = 'STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH: Today Wymaga ruchu uses explicit actionRequiredRows; upcoming 7 days uses full count plus preview; task tile label is truthful for overdue/today rows';
101: void STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH;
102: const STAGE232B_R6_TODAY_NO_DEV_HELPER_COPY = 'STAGE232B_R6: Today UI must not show developer explanatory helper copy under Wymaga ruchu';
103: void STAGE232B_R6_TODAY_NO_DEV_HELPER_COPY;
104:
```

### src/pages/TodayStable.tsx:447

```ts
444:
445: const TODAY_SECTION_TITLES: Record<TodaySectionKey, string> = {
446:   no_action: 'Leady bez najbliższej akcji',
447:   risk: 'Wysoka wartość / ryzyko',
448:   waiting: 'Leady czekające',
449:   leads: 'Wymaga ruchu',
450:   tasks: 'Zadania dziś i zaległe',
```

### src/pages/TodayStable.tsx:522

```ts
519: function getTodaySectionFromTileText(value: string): TodaySectionKey | null {
520:   const text = normalizeSemanticLabel(value);
521:   if (text.includes('leady bez najblizszej akcji') || text.includes('bez najblizszej zaplanowanej akcji')) return 'no_action';
522:   if (text.includes('wysoka wartosc') || text.includes('ryzyko')) return 'risk';
523:   if (text.includes('leady czekajace') || text.includes('czeka za dlugo')) return 'waiting';
524:   if (text.includes('wymaga ruchu') || text.includes('do obslugi') || text.includes('co masz zrobic dzisiaj') || text.includes('leady do obslugi dzis') || text.includes('leady do ruchu')) return 'leads';
525:   if (text.includes('zadania dzis i zalegle') || text.includes('zalegle zadania') || text.includes('zadania do obslugi') || text.includes('zadania do wykonania dzis') || text.includes('zadania dzis')) return 'tasks';
```

### src/pages/TodayStable.tsx:1146

```ts
1143:       .sort(sortByMoment);
1144:   }, [data.tasks, todayKey]);
1145:
1146:   const ownerControlBaseline = useMemo(() => buildOwnerControlBaseline({
1147:     leads: data.leads,
1148:     cases: data.cases,
1149:     tasks: data.tasks,
```

### src/pages/TodayStable.tsx:1151

```ts
1148:     cases: data.cases,
1149:     tasks: data.tasks,
1150:     events: data.events,
1151:     settings: readOwnerRiskSettings(workspace),
1152:   }), [data.cases, data.events, data.leads, data.tasks, workspace]);
1153:   const leadById = useMemo(() => new Map(data.leads.map((lead: any) => [String(lead?.id || ''), lead])), [data.leads]);
1154:   const ownerControlLeadRows = useMemo(() => ownerControlBaseline.items
```

### src/pages/TodayStable.tsx:1154

```ts
1151:     settings: readOwnerRiskSettings(workspace),
1152:   }), [data.cases, data.events, data.leads, data.tasks, workspace]);
1153:   const leadById = useMemo(() => new Map(data.leads.map((lead: any) => [String(lead?.id || ''), lead])), [data.leads]);
1154:   const ownerControlLeadRows = useMemo(() => ownerControlBaseline.items
1155:     .filter((item) => item.entityType === 'lead')
1156:     .map((item) => ({ item, lead: leadById.get(item.entityId) }))
1157:     .filter((entry) => Boolean(entry.lead)), [leadById, ownerControlBaseline.items]);
```

### src/pages/TodayStable.tsx:1157

```ts
1154:   const ownerControlLeadRows = useMemo(() => ownerControlBaseline.items
1155:     .filter((item) => item.entityType === 'lead')
1156:     .map((item) => ({ item, lead: leadById.get(item.entityId) }))
1157:     .filter((entry) => Boolean(entry.lead)), [leadById, ownerControlBaseline.items]);
1158:   const noActionLeads = useMemo(() => ownerControlLeadRows.filter(({ item }) => item.signals.includes('Brak następnego kroku')), [ownerControlLeadRows]);
1159:   const highValueAtRiskRows = useMemo(() => ownerControlLeadRows.filter(({ item }) => item.valuePln >= ownerControlBaseline.settings.highValueThresholdPln), [ownerControlBaseline.settings.highValueThresholdPln, ownerControlLeadRows]);
1160:   const waitingLeadRows = useMemo(() => ownerControlLeadRows.filter(({ item }) => typeof item.silentDays === 'number' && item.silentDays >= ownerControlBaseline.settings.warningDays), [ownerControlBaseline.settings.warningDays, ownerControlLeadRows]);
```

### src/pages/TodayStable.tsx:1158

```ts
1155:     .filter((item) => item.entityType === 'lead')
1156:     .map((item) => ({ item, lead: leadById.get(item.entityId) }))
1157:     .filter((entry) => Boolean(entry.lead)), [leadById, ownerControlBaseline.items]);
1158:   const noActionLeads = useMemo(() => ownerControlLeadRows.filter(({ item }) => item.signals.includes('Brak następnego kroku')), [ownerControlLeadRows]);
1159:   const highValueAtRiskRows = useMemo(() => ownerControlLeadRows.filter(({ item }) => item.valuePln >= ownerControlBaseline.settings.highValueThresholdPln), [ownerControlBaseline.settings.highValueThresholdPln, ownerControlLeadRows]);
1160:   const waitingLeadRows = useMemo(() => ownerControlLeadRows.filter(({ item }) => typeof item.silentDays === 'number' && item.silentDays >= ownerControlBaseline.settings.warningDays), [ownerControlBaseline.settings.warningDays, ownerControlLeadRows]);
1161:   const actionRequiredRows = useMemo(() => ownerControlBaseline.items, [ownerControlBaseline.items]);
```

### src/pages/TodayStable.tsx:1159

```ts
1156:     .map((item) => ({ item, lead: leadById.get(item.entityId) }))
1157:     .filter((entry) => Boolean(entry.lead)), [leadById, ownerControlBaseline.items]);
1158:   const noActionLeads = useMemo(() => ownerControlLeadRows.filter(({ item }) => item.signals.includes('Brak następnego kroku')), [ownerControlLeadRows]);
1159:   const highValueAtRiskRows = useMemo(() => ownerControlLeadRows.filter(({ item }) => item.valuePln >= ownerControlBaseline.settings.highValueThresholdPln), [ownerControlBaseline.settings.highValueThresholdPln, ownerControlLeadRows]);
1160:   const waitingLeadRows = useMemo(() => ownerControlLeadRows.filter(({ item }) => typeof item.silentDays === 'number' && item.silentDays >= ownerControlBaseline.settings.warningDays), [ownerControlBaseline.settings.warningDays, ownerControlLeadRows]);
1161:   const actionRequiredRows = useMemo(() => ownerControlBaseline.items, [ownerControlBaseline.items]);
1162:
```

### src/pages/TodayStable.tsx:1160

```ts
1157:     .filter((entry) => Boolean(entry.lead)), [leadById, ownerControlBaseline.items]);
1158:   const noActionLeads = useMemo(() => ownerControlLeadRows.filter(({ item }) => item.signals.includes('Brak następnego kroku')), [ownerControlLeadRows]);
1159:   const highValueAtRiskRows = useMemo(() => ownerControlLeadRows.filter(({ item }) => item.valuePln >= ownerControlBaseline.settings.highValueThresholdPln), [ownerControlBaseline.settings.highValueThresholdPln, ownerControlLeadRows]);
1160:   const waitingLeadRows = useMemo(() => ownerControlLeadRows.filter(({ item }) => typeof item.silentDays === 'number' && item.silentDays >= ownerControlBaseline.settings.warningDays), [ownerControlBaseline.settings.warningDays, ownerControlLeadRows]);
1161:   const actionRequiredRows = useMemo(() => ownerControlBaseline.items, [ownerControlBaseline.items]);
1162:
1163:   const todayEvents = useMemo(() => {
```

### src/pages/TodayStable.tsx:1161

```ts
1158:   const noActionLeads = useMemo(() => ownerControlLeadRows.filter(({ item }) => item.signals.includes('Brak następnego kroku')), [ownerControlLeadRows]);
1159:   const highValueAtRiskRows = useMemo(() => ownerControlLeadRows.filter(({ item }) => item.valuePln >= ownerControlBaseline.settings.highValueThresholdPln), [ownerControlBaseline.settings.highValueThresholdPln, ownerControlLeadRows]);
1160:   const waitingLeadRows = useMemo(() => ownerControlLeadRows.filter(({ item }) => typeof item.silentDays === 'number' && item.silentDays >= ownerControlBaseline.settings.warningDays), [ownerControlBaseline.settings.warningDays, ownerControlLeadRows]);
1161:   const actionRequiredRows = useMemo(() => ownerControlBaseline.items, [ownerControlBaseline.items]);
1162:
1163:   const todayEvents = useMemo(() => {
1164:     return data.events
```

### src/pages/TodayStable.tsx:1312

```ts
1309:
1310:   const todaySectionLabels = {
1311:     no_action: 'Leady bez najbliższej akcji',
1312:     risk: 'Wysoka wartość / ryzyko',
1313:     waiting: 'Leady czekające',
1314:     leads: 'Wymaga ruchu',
1315:     tasks: taskTileLabel,
```

### src/lib/owner-control/activity-truth.ts:6

```ts
3: export type ActivityTruth = {
4:   entityType: 'lead' | 'case' | 'client';
5:   entityId: string;
6:   lastContactAt: string | null;
7:   lastContactSource: 'activity' | 'task' | 'event' | 'field' | null;
8:   lastActivityAt: string | null;
9:   lastActivitySource: ActivityTruthSource | null;
```

### src/lib/owner-control/activity-truth.ts:7

```ts
4:   entityType: 'lead' | 'case' | 'client';
5:   entityId: string;
6:   lastContactAt: string | null;
7:   lastContactSource: 'activity' | 'task' | 'event' | 'field' | null;
8:   lastActivityAt: string | null;
9:   lastActivitySource: ActivityTruthSource | null;
10:   contactSilentDays: number | null;
```

### src/lib/owner-control/activity-truth.ts:10

```ts
7:   lastContactSource: 'activity' | 'task' | 'event' | 'field' | null;
8:   lastActivityAt: string | null;
9:   lastActivitySource: ActivityTruthSource | null;
10:   contactSilentDays: number | null;
11:   activitySilentDays: number | null;
12:   lastContactIsFallback: boolean;
13:   lastActivityIsFallback: boolean;
```

### src/lib/owner-control/activity-truth.ts:12

```ts
9:   lastActivitySource: ActivityTruthSource | null;
10:   contactSilentDays: number | null;
11:   activitySilentDays: number | null;
12:   lastContactIsFallback: boolean;
13:   lastActivityIsFallback: boolean;
14: };
15:
```

### src/lib/owner-control/activity-truth.ts:28

```ts
25: };
26:
27: const DAY_MS = 86_400_000;
28: const STAGE223_ACTIVITY_TRUTH = 'distinguish real contact silence from generic activity silence; updatedAt is fallback only';
29: const STAGE223_ACTIVITY_TRUTH_FALLBACK_ORDER = 'updatedAt fallback is used only when no real activity/contact/payment candidate exists';
30: void STAGE223_ACTIVITY_TRUTH;
31: void STAGE223_ACTIVITY_TRUTH_FALLBACK_ORDER;
```

### src/lib/owner-control/activity-truth.ts:29

```ts
26:
27: const DAY_MS = 86_400_000;
28: const STAGE223_ACTIVITY_TRUTH = 'distinguish real contact silence from generic activity silence; updatedAt is fallback only';
29: const STAGE223_ACTIVITY_TRUTH_FALLBACK_ORDER = 'updatedAt fallback is used only when no real activity/contact/payment candidate exists';
30: void STAGE223_ACTIVITY_TRUTH;
31: void STAGE223_ACTIVITY_TRUTH_FALLBACK_ORDER;
32:
```

### src/lib/owner-control/activity-truth.ts:59

```ts
56:   return Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / DAY_MS));
57: }
58:
59: function isContactRecord(record: Record<string, unknown>) {
60:   const haystack = [
61:     readString(record, ['type', 'kind', 'category', 'channel', 'action', 'eventType', 'event_type', 'taskType', 'task_type']),
62:     readString(record, ['title', 'name', 'description', 'note', 'body', 'content']),
```

### src/lib/owner-control/activity-truth.ts:67

```ts
64:
65:   return [
66:     'kontakt',
67:     'contact',
68:     'telefon',
69:     'phone',
70:     'call',
```

### src/lib/owner-control/activity-truth.ts:112

```ts
109: export function buildActivityTruth(input: BuildActivityTruthInput): ActivityTruth {
110:   const now = input.now || new Date();
111:   const record = asRecord(input.record);
112:   const contactCandidates: { at: string; source: ActivityTruthSource; isFallback: boolean }[] = [];
113:   const realActivityCandidates: { at: string; source: ActivityTruthSource; isFallback: boolean }[] = [];
114:   const fallbackActivityCandidates: { at: string; source: ActivityTruthSource; isFallback: boolean }[] = [];
115:
```

### src/lib/owner-control/activity-truth.ts:116

```ts
113:   const realActivityCandidates: { at: string; source: ActivityTruthSource; isFallback: boolean }[] = [];
114:   const fallbackActivityCandidates: { at: string; source: ActivityTruthSource; isFallback: boolean }[] = [];
115:
116:   const explicitContactAt = candidateDate(record, ['lastContactAt', 'last_contact_at', 'contactedAt', 'contacted_at']);
117:   pushCandidate(contactCandidates, explicitContactAt, 'field', false);
118:   pushCandidate(realActivityCandidates, explicitContactAt, 'field', false);
119:
```

### src/lib/owner-control/activity-truth.ts:117

```ts
114:   const fallbackActivityCandidates: { at: string; source: ActivityTruthSource; isFallback: boolean }[] = [];
115:
116:   const explicitContactAt = candidateDate(record, ['lastContactAt', 'last_contact_at', 'contactedAt', 'contacted_at']);
117:   pushCandidate(contactCandidates, explicitContactAt, 'field', false);
118:   pushCandidate(realActivityCandidates, explicitContactAt, 'field', false);
119:
120:   const explicitActivityAt = candidateDate(record, ['lastActivityAt', 'last_activity_at']);
```

### src/lib/owner-control/activity-truth.ts:118

```ts
115:
116:   const explicitContactAt = candidateDate(record, ['lastContactAt', 'last_contact_at', 'contactedAt', 'contacted_at']);
117:   pushCandidate(contactCandidates, explicitContactAt, 'field', false);
118:   pushCandidate(realActivityCandidates, explicitContactAt, 'field', false);
119:
120:   const explicitActivityAt = candidateDate(record, ['lastActivityAt', 'last_activity_at']);
121:   pushCandidate(realActivityCandidates, explicitActivityAt, 'field', false);
```

### src/lib/owner-control/activity-truth.ts:127

```ts
124:     const row = asRecord(activity);
125:     const at = candidateDate(row, ['createdAt', 'created_at', 'dateAt', 'date_at', 'happenedAt', 'happened_at', 'updatedAt', 'updated_at']);
126:     pushCandidate(realActivityCandidates, at, 'activity', false);
127:     if (isContactRecord(row)) pushCandidate(contactCandidates, at, 'activity', false);
128:   }
129:
130:   for (const task of array(input.tasks)) {
```

### src/lib/owner-control/activity-truth.ts:134

```ts
131:     const row = asRecord(task);
132:     const at = candidateDate(row, ['completedAt', 'completed_at', 'scheduledAt', 'scheduled_at', 'dueAt', 'due_at', 'dateAt', 'date_at', 'createdAt', 'created_at']);
133:     pushCandidate(realActivityCandidates, at, 'task', false);
134:     if (isContactRecord(row)) pushCandidate(contactCandidates, at, 'task', false);
135:   }
136:
137:   for (const event of array(input.events)) {
```

### src/lib/owner-control/activity-truth.ts:141

```ts
138:     const row = asRecord(event);
139:     const at = candidateDate(row, ['startAt', 'start_at', 'scheduledAt', 'scheduled_at', 'dateAt', 'date_at', 'date', 'createdAt', 'created_at']);
140:     pushCandidate(realActivityCandidates, at, 'event', false);
141:     if (isContactRecord(row)) pushCandidate(contactCandidates, at, 'event', false);
142:   }
143:
144:   for (const payment of array(input.payments)) {
```

### src/lib/owner-control/activity-truth.ts:150

```ts
147:     pushCandidate(realActivityCandidates, at, 'payment', false);
148:   }
149:
150:   // Fallback activity only. This must not override real activity/contact/payment candidates.
151:   pushCandidate(fallbackActivityCandidates, candidateDate(record, ['updatedAt', 'updated_at', 'modifiedAt', 'modified_at']), 'field', true);
152:   pushCandidate(fallbackActivityCandidates, candidateDate(record, ['createdAt', 'created_at']), 'field', true);
153:
```

### src/lib/owner-control/activity-truth.ts:154

```ts
151:   pushCandidate(fallbackActivityCandidates, candidateDate(record, ['updatedAt', 'updated_at', 'modifiedAt', 'modified_at']), 'field', true);
152:   pushCandidate(fallbackActivityCandidates, candidateDate(record, ['createdAt', 'created_at']), 'field', true);
153:
154:   const lastContact = latestCandidate(contactCandidates);
155:   const lastRealActivity = latestCandidate(realActivityCandidates);
156:   const lastFallbackActivity = latestCandidate(fallbackActivityCandidates);
157:   const lastActivity = lastRealActivity || lastFallbackActivity;
```

### src/lib/owner-control/activity-truth.ts:162

```ts
159:   return {
160:     entityType: input.entityType,
161:     entityId: input.entityId,
162:     lastContactAt: lastContact?.at || null,
163:     lastContactSource: (lastContact?.source as ActivityTruth['lastContactSource']) || null,
164:     lastActivityAt: lastActivity?.at || null,
165:     lastActivitySource: lastActivity?.source || null,
```

### src/lib/owner-control/activity-truth.ts:163

```ts
160:     entityType: input.entityType,
161:     entityId: input.entityId,
162:     lastContactAt: lastContact?.at || null,
163:     lastContactSource: (lastContact?.source as ActivityTruth['lastContactSource']) || null,
164:     lastActivityAt: lastActivity?.at || null,
165:     lastActivitySource: lastActivity?.source || null,
166:     contactSilentDays: daysSince(lastContact?.at || null, now),
```

### src/lib/owner-control/activity-truth.ts:166

```ts
163:     lastContactSource: (lastContact?.source as ActivityTruth['lastContactSource']) || null,
164:     lastActivityAt: lastActivity?.at || null,
165:     lastActivitySource: lastActivity?.source || null,
166:     contactSilentDays: daysSince(lastContact?.at || null, now),
167:     activitySilentDays: daysSince(lastActivity?.at || null, now),
168:     lastContactIsFallback: false,
169:     lastActivityIsFallback: Boolean(lastActivity?.isFallback),
```

### src/lib/supabase-fallback.ts:18

```ts
15:   isRequired?: boolean;
16:   order?: number;
17: };
18: type LeadInsertInput = { name: string; email?: string; phone?: string; company?: string; source?: string; dealValue?: number; lastContactAt?: string | null; partialPayments?: Array<{ id: string; amount: number; paidAt?: string; createdAt: string }>; nextActionAt?: string; ownerId?: string; workspaceId?: string; allowDuplicate?: boolean };
19: type ClientUpsertInput = { id?: string; name?: string; company?: string; email?: string; phone?: string; lastContactAt?: string | null; notes?: string; tags?: string[]; sourcePrimary?: string; lastActivityAt?: string | null; archivedAt?: string | null; primaryCaseId?: string | null; workspaceId?: string; allowDuplicate?: boolean; forceDuplicate?: boolean };
20: type ServiceProfileUpsertInput = { id?: string; name?: string; description?: string; startRule?: string; winRule?: string; billingModel?: string; caseCreationMode?: string; isDefault?: boolean; isArchived?: boolean; workspaceId?: string };
21: type PaymentUpsertInput = { id?: string; clientId?: string | null; leadId?: string | null; caseId?: string | null; type?: string; status?: string; amount?: number; currency?: string; paidAt?: string | null; dueAt?: string | null; note?: string; workspaceId?: string };
```

### src/lib/supabase-fallback.ts:19

```ts
16:   order?: number;
17: };
18: type LeadInsertInput = { name: string; email?: string; phone?: string; company?: string; source?: string; dealValue?: number; lastContactAt?: string | null; partialPayments?: Array<{ id: string; amount: number; paidAt?: string; createdAt: string }>; nextActionAt?: string; ownerId?: string; workspaceId?: string; allowDuplicate?: boolean };
19: type ClientUpsertInput = { id?: string; name?: string; company?: string; email?: string; phone?: string; lastContactAt?: string | null; notes?: string; tags?: string[]; sourcePrimary?: string; lastActivityAt?: string | null; archivedAt?: string | null; primaryCaseId?: string | null; workspaceId?: string; allowDuplicate?: boolean; forceDuplicate?: boolean };
20: type ServiceProfileUpsertInput = { id?: string; name?: string; description?: string; startRule?: string; winRule?: string; billingModel?: string; caseCreationMode?: string; isDefault?: boolean; isArchived?: boolean; workspaceId?: string };
21: type PaymentUpsertInput = { id?: string; clientId?: string | null; leadId?: string | null; caseId?: string | null; type?: string; status?: string; amount?: number; currency?: string; paidAt?: string | null; dueAt?: string | null; note?: string; workspaceId?: string };
22: type CaseCostUpsertInput = { id?: string; caseId?: string | null; clientId?: string | null; kind?: string; status?: string; amount?: number; reimbursable?: boolean; reimbursableAmount?: number; reimbursedAmount?: number; currency?: string; incurredAt?: string | null; reimbursedAt?: string | null; note?: string; workspaceId?: string };
```

### src/lib/supabase-fallback.ts:699

```ts
696:   const query = new URLSearchParams(); if (params?.caseId) query.set('caseId', params.caseId); if (params?.leadId) query.set('leadId', params.leadId); if (params?.clientId) query.set('clientId', params.clientId); if (params?.limit) query.set('limit', String(params.limit));
697:   return callApi<Record<string, unknown>[]>(`/api/activities${query.toString() ? `?${query.toString()}` : ''}`).then(normalizeActivityListContract);
698: }
699: export async function insertActivityToSupabase(input: ActivityInput) { return callApi<SupabaseInsertResult>('/api/activities', { method: 'POST', body: JSON.stringify(input) }); }
700: export async function updateActivityInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/activities', { method: 'PATCH', body: JSON.stringify(input) }); }
701: export async function deleteActivityFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/activities?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
702: export async function fetchClientPortalTokenFromSupabase(caseId: string) { return callApi<Record<string, unknown>>(`/api/client-portal-tokens?caseId=${encodeURIComponent(caseId)}`); }
```

### src/lib/supabase-fallback.ts:729

```ts
726: export async function insertPortalActivityToSupabase(input: { caseId: string; portalSession: string; eventType: string; payload?: Record<string, unknown> }) {
727:   return callApi<Record<string, unknown>>('/api/activities', { method: 'POST', body: JSON.stringify({ caseId: input.caseId, portalSession: input.portalSession, actorType: 'client', eventType: input.eventType, payload: input.payload || {} }) });
728: }
729: export async function updateLeadInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/leads', { method: 'PATCH', body: JSON.stringify(input) }); }
730: export async function deleteLeadFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
731: export async function updateTaskInSupabase(input: Record<string, unknown> & { id: string }): Promise<SupabaseInsertResult> {
732:   const taskId = String(input?.id || '').trim();
```

### src/components/ContextActionDialogs.tsx:7

```ts
4: import { CONTEXT_ACTION_CONTRACT, STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1 } from '../lib/context-action-contract';
5: import { requireWorkspaceId } from '../lib/workspace-context';
6: import { buildMissingItemModalDraft, type MissingItemKind } from '../lib/missing-items/stage227c2-missing-item-modal-contract';
7: import { insertActivityToSupabase, insertCaseItemToSupabase, insertTaskToSupabase } from '../lib/supabase-fallback';
8: import { useWorkspace } from '../hooks/useWorkspace';
9: import TaskCreateDialog, { type TaskCreateDialogContext } from './TaskCreateDialog';
10: import EventCreateDialog from './EventCreateDialog';
```

### src/components/ContextActionDialogs.tsx:36

```ts
33: const STAGE232A_R4_CONTEXT_ACTION_MISSING_BLOCKER_METADATA = 'ContextActionDialogs persists explicit Brak/Blokada metadata from the missing item modal';
34: void STAGE232A_R4_CONTEXT_ACTION_MISSING_BLOCKER_METADATA;
35: const STAGE232A_R6_CONTEXT_ACTION_MISSING_BLOCKER_TASK_PERSISTENCE = 'ContextActionDialogs persists missingKind blocksProgress blockScope on task and no-flicker saved record for hard refresh truth';
36: const STAGE232A_R8_CONTEXT_ACTION_TASK_ID_ACTIVITY_BRIDGE = 'ContextActionDialogs stores taskId and explicit blocker status in missing_item activity payload for LeadDetail UI compatibility';
37: void STAGE232A_R8_CONTEXT_ACTION_TASK_ID_ACTIVITY_BRIDGE;
38: void STAGE232A_R6_CONTEXT_ACTION_MISSING_BLOCKER_TASK_PERSISTENCE;
39: const STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY = STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1;
```

### src/components/ContextActionDialogs.tsx:37

```ts
34: void STAGE232A_R4_CONTEXT_ACTION_MISSING_BLOCKER_METADATA;
35: const STAGE232A_R6_CONTEXT_ACTION_MISSING_BLOCKER_TASK_PERSISTENCE = 'ContextActionDialogs persists missingKind blocksProgress blockScope on task and no-flicker saved record for hard refresh truth';
36: const STAGE232A_R8_CONTEXT_ACTION_TASK_ID_ACTIVITY_BRIDGE = 'ContextActionDialogs stores taskId and explicit blocker status in missing_item activity payload for LeadDetail UI compatibility';
37: void STAGE232A_R8_CONTEXT_ACTION_TASK_ID_ACTIVITY_BRIDGE;
38: void STAGE232A_R6_CONTEXT_ACTION_MISSING_BLOCKER_TASK_PERSISTENCE;
39: const STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY = STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1;
40: const STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT = 'Explicit data-context-action-kind routes task, event, note and blocker through the same shared dialog host';
```

### src/components/ContextActionDialogs.tsx:76

```ts
73:   const recordId = parts[1];
74:   if (!recordId) return null;
75:
76:   if (section === 'leads') return { recordType: 'lead', recordId, leadId: recordId, recordLabel: readVisibleTitle('Lead') };
77:   if (section === 'clients') return { recordType: 'client', recordId, clientId: recordId, recordLabel: readVisibleTitle('Klient') };
78:   if (section === 'case' || section === 'cases') return { recordType: 'case', recordId, caseId: recordId, recordLabel: readVisibleTitle('Sprawa') };
79:   return null;
```

### src/components/ContextActionDialogs.tsx:90

```ts
87:   const recordId = String(explicitElement.getAttribute(CONTEXT_ACTION_RECORD_ID_ATTR) || '').trim();
88:   if (!recordType || !recordId) return null;
89:   const recordLabel = explicitElement.getAttribute('data-context-record-label')?.trim() || readVisibleTitle(recordType === 'lead' ? 'Lead' : recordType === 'client' ? 'Klient' : 'Sprawa');
90:   const explicitLeadId = explicitElement.getAttribute(CONTEXT_ACTION_LEAD_ID_ATTR)?.trim() || null;
91:   const explicitClientId = explicitElement.getAttribute(CONTEXT_ACTION_CLIENT_ID_ATTR)?.trim() || null;
92:   const explicitCaseId = explicitElement.getAttribute(CONTEXT_ACTION_CASE_ID_ATTR)?.trim() || null;
93:   return {
```

### src/components/ContextActionDialogs.tsx:97

```ts
94:     recordType,
95:     recordId,
96:     recordLabel,
97:     leadId: explicitLeadId || (recordType === 'lead' ? recordId : null),
98:     clientId: explicitClientId || (recordType === 'client' ? recordId : null),
99:     caseId: explicitCaseId || (recordType === 'case' ? recordId : null),
100:   };
```

### src/components/ContextActionDialogs.tsx:245

```ts
242:       blocksProgress: draft.blocksProgress,
243:       blockScope: draft.blockScope || null,
244:     };
245:     const leadId = request.leadId || (request.recordType === 'lead' ? request.recordId : null);
246:     const clientId = request.clientId || (request.recordType === 'client' ? request.recordId : null);
247:     const caseId = request.caseId || (request.recordType === 'case' ? request.recordId : null);
248:
```

### src/components/ContextActionDialogs.tsx:269

```ts
266:           dueDate: null,
267:         });
268:
269:         await insertActivityToSupabase({
270:           caseId,
271:           clientId: clientId || null,
272:           leadId: leadId || null,
```

### src/components/ContextActionDialogs.tsx:272

```ts
269:         await insertActivityToSupabase({
270:           caseId,
271:           clientId: clientId || null,
272:           leadId: leadId || null,
273:           actorType: 'operator',
274:           eventType: 'item_added',
275:           payload: {
```

### src/components/ContextActionDialogs.tsx:299

```ts
296:           type: 'missing_item',
297:           status: draft.blocksProgress ? 'blocking_missing_item' : 'missing_item',
298:           priority: draft.blocksProgress ? 'high' : 'medium',
299:           leadId: leadId || null,
300:           clientId: clientId || null,
301:           caseId: caseId || null,
302:           scheduledAt: now,
```

### src/components/ContextActionDialogs.tsx:320

```ts
317:           },
318:         } as any);
319:
320:         await insertActivityToSupabase({
321:           leadId: leadId || null,
322:           clientId: clientId || null,
323:           caseId: caseId || null,
```

### src/components/ContextActionDialogs.tsx:321

```ts
318:         } as any);
319:
320:         await insertActivityToSupabase({
321:           leadId: leadId || null,
322:           clientId: clientId || null,
323:           caseId: caseId || null,
324:           actorType: 'operator',
```

### src/components/ContextActionDialogs.tsx:355

```ts
352:           id: (createdMissingTask as any)?.id || null,
353:           recordType: request.recordType,
354:           recordId: request.recordId,
355:           leadId: leadId || null,
356:           clientId: clientId || null,
357:           caseId: caseId || null,
358:           source: 'stage228r48_context_blocker_create_no_flicker',
```

## Kontrakt do runtime patcha

- Klik `Kontakt wykonany` ma zapisac kontakt entity-scoped dla konkretnego leada.
- Reset ciszy kontaktowej tylko po jawnie kontaktowym event/polu.
- Zwykla notatka nie resetuje ciszy.
- Przyszly follow-up nie resetuje ciszy.
- Ogolne wydarzenie kalendarza nie resetuje ciszy.
- Spotkanie z innym leadem nie resetuje aktualnego leada.
- Jezeli brak trwalego pola lastContactAt/last_contact_at albo API go nie przyjmuje, runtime patch ma sie zatrzymac i wymagac osobnego R2 SQL/schema check.

## Czego nie ruszano

- runtime code
- SQL / Supabase RLS
- finanse/prowizje
- Braki/Blokady
- CaseDetail layout
- ClientDetail layout
- Google Calendar OAuth
- billing/trial
- scroll shell STAGE232J

## Nastepny krok

Na podstawie tego raportu przygotowac drugi ZIP: `STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX`, ale tylko po potwierdzeniu:
1. gdzie jest handler `Kontakt wykonany`,
2. czy istnieje trwaly zapis `lastContactAt`/odpowiednik,
3. ktore API zapisuje lead/contact/activity.


## 2026-06-17 16:05 Europe/Warsaw - SCAN_CONSUMED_BY_STAGE232D_R1_R1_RUNTIME_FIX

Skan wykorzystany do runtime patcha R1-R1:
- src/lib/supabase-fallback.ts
- src/lib/owner-control/activity-truth.ts
- guard/test STAGE232D_R1
