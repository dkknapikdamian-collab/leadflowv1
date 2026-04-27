import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ClipboardList,
  History,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Search,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  fetchActivitiesFromSupabase,
  fetchCasesFromSupabase,
  fetchClientByIdFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  updateClientInSupabase,
} from '../lib/supabase-fallback';

type ClientTab = 'summary' | 'cases' | 'contact' | 'history';

type ClientAction = {
  title: string;
  subtitle: string;
  tone: 'orange' | 'red' | 'blue' | 'green' | 'slate';
  href?: string;
};

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function dateValue(value: unknown) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value: unknown) {
  const parsed = dateValue(value);
  if (!parsed) return 'Brak daty';
  return parsed.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(value: unknown) {
  const parsed = dateValue(value);
  if (!parsed) return 'Brak terminu';
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isDoneStatus(status: unknown) {
  return ['done', 'completed', 'archived', 'cancelled', 'canceled'].includes(String(status || '').toLowerCase());
}

function caseStatusLabel(status: unknown) {
  switch (String(status || '')) {
    case 'waiting_on_client':
      return 'czeka na klienta';
    case 'blocked':
      return 'blokada';
    case 'ready_to_start':
      return 'gotowa do startu';
    case 'in_progress':
      return 'w toku';
    case 'completed':
      return 'zakończona';
    case 'canceled':
      return 'anulowana';
    default:
      return String(status || 'w toku');
  }
}

function leadStatusLabel(status: unknown) {
  switch (String(status || '')) {
    case 'new':
      return 'nowy';
    case 'contacted':
      return 'kontakt';
    case 'proposal_sent':
      return 'oferta';
    case 'waiting_response':
      return 'czeka';
    case 'moved_to_service':
      return 'w obsłudze';
    case 'lost':
      return 'utracony';
    case 'archived':
      return 'archiwum';
    default:
      return String(status || 'lead');
  }
}

function getTaskDate(task: any) {
  return task?.scheduledAt || task?.reminderAt || task?.date || task?.createdAt || '';
}

function getEventDate(event: any) {
  return event?.startAt || event?.reminderAt || event?.createdAt || '';
}

function getCaseCompleteness(caseRecord: any) {
  return Math.round(Number(caseRecord?.completenessPercent || caseRecord?.completeness || 0));
}

function buildAction(cases: any[], tasks: any[], events: any[]): ClientAction {
  const openTasks = tasks
    .filter((task) => !isDoneStatus(task?.status))
    .map((task) => ({ task, time: dateValue(getTaskDate(task))?.getTime() ?? Number.MAX_SAFE_INTEGER }))
    .sort((left, right) => left.time - right.time);

  const firstTask = openTasks[0]?.task;
  if (firstTask) {
    const overdue = (dateValue(getTaskDate(firstTask))?.getTime() ?? Date.now()) < Date.now();
    return {
      title: overdue ? 'Zaległe' : 'Najbliższa akcja',
      subtitle: `${String(firstTask.title || 'Zadanie')} · ${formatDateTime(getTaskDate(firstTask))}`,
      tone: overdue ? 'red' : 'orange',
      href: '/tasks',
    };
  }

  const firstEvent = events
    .filter((event) => !isDoneStatus(event?.status))
    .map((event) => ({ event, time: dateValue(getEventDate(event))?.getTime() ?? Number.MAX_SAFE_INTEGER }))
    .sort((left, right) => left.time - right.time)[0]?.event;

  if (firstEvent) {
    return {
      title: 'Najbliższe wydarzenie',
      subtitle: `${String(firstEvent.title || 'Wydarzenie')} · ${formatDateTime(getEventDate(firstEvent))}`,
      tone: 'blue',
      href: '/calendar',
    };
  }

  const waitingCase = cases.find((caseRecord) => ['waiting_on_client', 'blocked'].includes(String(caseRecord.status || '')));
  if (waitingCase) {
    return {
      title: 'Wymaga ruchu',
      subtitle: `${String(waitingCase.title || 'Sprawa')} · ${caseStatusLabel(waitingCase.status)}`,
      tone: 'orange',
      href: `/cases/${String(waitingCase.id)}`,
    };
  }

  return {
    title: 'Brak pilnej akcji',
    subtitle: 'Nie widać teraz zadania ani wydarzenia wymagającego ruchu.',
    tone: 'slate',
  };
}

function actionToneClass(tone: ClientAction['tone']) {
  if (tone === 'red') return 'text-red-600';
  if (tone === 'orange') return 'text-orange-600';
  if (tone === 'green') return 'text-emerald-600';
  if (tone === 'blue') return 'text-blue-600';
  return 'text-slate-700';
}

function compactPhone(value: unknown) {
  const raw = text(value);
  return raw || 'Brak telefonu';
}

function compactEmail(value: unknown) {
  const raw = text(value);
  return raw || 'Brak e-maila';
}

function activityTitle(activity: any) {
  const title = text(activity?.payload?.title);
  const eventType = text(activity?.eventType) || 'aktywność';
  return title ? `${eventType}: ${title}` : eventType;
}

export default function ClientDetailV81() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [activeTab, setActiveTab] = useState<ClientTab>('summary');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', notes: '' });

  const reload = useCallback(async () => {
    if (!workspace?.id || !clientId) {
      setLoading(workspaceLoading);
      return;
    }

    setLoading(true);
    try {
      const [clientRow, leadRows, caseRows, taskRows, eventRows, activityRows] = await Promise.all([
        fetchClientByIdFromSupabase(clientId),
        fetchLeadsFromSupabase({ clientId }),
        fetchCasesFromSupabase({ clientId }),
        fetchTasksFromSupabase(),
        fetchEventsFromSupabase(),
        fetchActivitiesFromSupabase({ limit: 120 }),
      ]);

      setClient(clientRow);
      setLeads(leadRows as any[]);
      setCases(caseRows as any[]);
      setTasks(taskRows as any[]);
      setEvents(eventRows as any[]);
      setActivities(activityRows as any[]);
      setForm({
        name: String((clientRow as any)?.name || ''),
        company: String((clientRow as any)?.company || ''),
        email: String((clientRow as any)?.email || ''),
        phone: String((clientRow as any)?.phone || ''),
        notes: String((clientRow as any)?.notes || ''),
      });
    } catch (error: any) {
      toast.error(`Błąd odczytu klienta: ${error?.message || 'REQUEST_FAILED'}`);
      setClient(null);
    } finally {
      setLoading(false);
    }
  }, [clientId, workspace?.id, workspaceLoading]);

  useEffect(() => {
    if (workspaceLoading || !workspace?.id) {
      setLoading(workspaceLoading);
      return;
    }
    void reload();
  }, [reload, workspace?.id, workspaceLoading]);

  const relationIds = useMemo(() => {
    return {
      leadIds: new Set(leads.map((lead) => String(lead.id || '')).filter(Boolean)),
      caseIds: new Set(cases.map((caseRecord) => String(caseRecord.id || '')).filter(Boolean)),
    };
  }, [cases, leads]);

  const clientTasks = useMemo(() => {
    return tasks.filter((task) => relationIds.leadIds.has(String(task.leadId || '')) || relationIds.caseIds.has(String(task.caseId || '')));
  }, [relationIds.caseIds, relationIds.leadIds, tasks]);

  const clientEvents = useMemo(() => {
    return events.filter((event) => relationIds.leadIds.has(String(event.leadId || '')) || relationIds.caseIds.has(String(event.caseId || '')));
  }, [events, relationIds.caseIds, relationIds.leadIds]);

  const clientActivities = useMemo(() => {
    return activities
      .filter((activity) => relationIds.leadIds.has(String(activity.leadId || '')) || relationIds.caseIds.has(String(activity.caseId || '')))
      .sort((left, right) => (dateValue(right.createdAt)?.getTime() ?? 0) - (dateValue(left.createdAt)?.getTime() ?? 0));
  }, [activities, relationIds.caseIds, relationIds.leadIds]);

  const openCases = useMemo(() => cases.filter((caseRecord) => !['completed', 'canceled'].includes(String(caseRecord.status || ''))), [cases]);
  const blockingCases = useMemo(() => cases.filter((caseRecord) => ['waiting_on_client', 'blocked'].includes(String(caseRecord.status || ''))), [cases]);
  const mainCase = openCases[0] || cases[0] || null;
  const sourceLead = leads[0] || null;
  const mainAction = useMemo(() => buildAction(cases, clientTasks, clientEvents), [cases, clientEvents, clientTasks]);
  const averageCompleteness = cases.length
    ? Math.round(cases.reduce((sum, caseRecord) => sum + getCaseCompleteness(caseRecord), 0) / cases.length)
    : 0;

  const handleSave = async () => {
    if (!clientId) return;
    if (!hasAccess) return toast.error('Twój trial wygasł.');

    try {
      setSaving(true);
      await updateClientInSupabase({ id: clientId, ...form });
      toast.success('Klient zaktualizowany');
      await reload();
    } catch (error: any) {
      toast.error(`Błąd zapisu klienta: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="mx-auto max-w-5xl p-6">
          <Button variant="outline" onClick={() => navigate('/clients')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Klienci
          </Button>
          <Card className="mt-4">
            <CardContent className="p-6 text-slate-500">Nie znaleziono klienta.</CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl p-3 md:p-6" data-client-detail-simplified-card-view="true">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => navigate('/clients')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Klienci
          </Button>
          <Button onClick={() => void handleSave()} disabled={saving}>
            <Save className="mr-2 h-4 w-4" /> {saving ? 'Zapisywanie...' : 'Zapisz'}
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white">
                {String(client.name || 'K').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-black text-slate-950">{client.name || 'Klient'}</h1>
                <p className="line-clamp-2 text-xs text-slate-500">
                  Klient prywatny · ostatni kontakt dzisiaj · główna sprawa: {mainCase?.title || 'brak sprawy'}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3">
                <p className="text-2xl font-black text-orange-600">{mainAction.title === 'Brak pilnej akcji' ? 'OK' : '!'}</p>
                <p className="text-xs text-slate-600">{mainAction.subtitle}</p>
              </div>
              <InfoTile icon={<Phone className="h-4 w-4" />} label="Telefon" value={compactPhone(client.phone)} />
              <InfoTile icon={<Mail className="h-4 w-4" />} label="E-mail" value={compactEmail(client.email)} />
              <InfoTile icon={<MapPin className="h-4 w-4" />} label="Pierwsze źródło" value={sourceLead?.source || 'Brak źródła'} />
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
              <strong>Zasada tego panelu:</strong><br />
              Tu nie prowadzimy pracy. Tu widzimy klienta i wybieramy sprawę, którą chcemy prowadzić.
            </div>

            <div className="mt-4 grid gap-2">
              <Button onClick={() => navigate('/cases')} className="justify-start">
                + Nowa sprawa dla klienta
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('contact')} className="justify-start">
                Edytuj dane kontaktowe
              </Button>
            </div>
          </aside>

          <main className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm md:p-4">
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 text-sm font-bold md:grid-cols-4">
              <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} dataAttr="data-client-tab-summary">Podsumowanie</TabButton>
              <TabButton active={activeTab === 'cases'} onClick={() => setActiveTab('cases')} dataAttr="data-client-tab-cases">Sprawy</TabButton>
              <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} dataAttr="data-client-tab-contact">Kontakt</TabButton>
              <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} dataAttr="data-client-tab-history">Historia</TabButton>
            </div>

            {activeTab === 'summary' ? (
              <section className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <StatCard label="Jutro" value={clientTasks.length + clientEvents.length || 0} helper="Najbliższe akcje i terminy." tone="orange" />
                  <StatCard label="Blokady" value={blockingCases.length} helper="Sprawy wymagające decyzji." tone="red" />
                  <StatCard label="Kompletność" value={`${averageCompleteness}%`} helper="Średnia kompletność spraw." tone="green" />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-black text-slate-950">Najważniejsze dla tego klienta</h2>
                      <p className="text-xs text-slate-500">Krótki pulpit, nie CRM-owa tablica kontrolna. Tu są tylko rzeczy, które pomagają zdecydować, gdzie wejść.</p>
                    </div>
                    {mainAction.title !== 'Brak pilnej akcji' ? <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Wymaga ruchu</Badge> : null}
                  </div>

                  <div className="space-y-2">
                    {openCases.slice(0, 3).map((caseRecord) => (
                      <CaseRow key={caseRecord.id} caseRecord={caseRecord} navigate={navigate} />
                    ))}
                    {sourceLead ? (
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-slate-950">Historia pozyskania</p>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">informacyjne</Badge>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">Lead źródłowy · Źródło: {sourceLead.source || 'brak'} · status: {leadStatusLabel(sourceLead.status)}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('history')}>Pokaż historię</Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            {activeTab === 'cases' ? (
              <section className="space-y-3">
                <Header title="Sprawy klienta" helper="Główna praca ma prowadzić do sprawy, nie do klienta jako kolejnego kokpitu." />
                {cases.length === 0 ? <EmptyState text="Brak spraw tego klienta." /> : cases.map((caseRecord) => <CaseRow key={caseRecord.id} caseRecord={caseRecord} navigate={navigate} />)}
              </section>
            ) : null}

            {activeTab === 'contact' ? (
              <section className="space-y-4">
                <Header title="Kontakt" helper="Dane kontaktowe klienta i krótka notatka, bez rozbudowanego CRM-u." />
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Nazwa" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
                  <Field label="Firma" value={form.company} onChange={(value) => setForm((prev) => ({ ...prev, company: value }))} />
                  <Field label="Telefon" value={form.phone} onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))} />
                  <Field label="E-mail" value={form.email} onChange={(value) => setForm((prev) => ({ ...prev, email: value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Notatka</Label>
                  <Textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} rows={5} />
                </div>
              </section>
            ) : null}

            {activeTab === 'history' ? (
              <section className="space-y-4">
                <Header title="Historia" helper="Źródła, dawne leady i aktywności. To archiwum kontekstu, nie miejsce codziennej pracy." />
                <div className="rounded-2xl border border-slate-200 p-3">
                  <p className="text-sm font-black text-slate-950">Lead źródłowy</p>
                  <p className="mt-1 text-sm text-slate-600">Źródło: {sourceLead?.source || 'Brak'} · Status: {leadStatusLabel(sourceLead?.status)} · Data: {formatDate(sourceLead?.createdAt)}</p>
                </div>
                <div className="space-y-2">
                  {clientActivities.length === 0 ? <EmptyState text="Brak historii aktywności dla klienta." /> : clientActivities.slice(0, 12).map((activity) => (
                    <div key={String(activity.id)} className="rounded-2xl border border-slate-200 p-3">
                      <p className="text-sm font-bold text-slate-900">{activityTitle(activity)}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDateTime(activity.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </main>
        </div>
      </div>
    </Layout>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-slate-500">{icon}{label}</div>
      <p className="mt-1 break-words text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function TabButton({ active, onClick, dataAttr, children }: { active: boolean; onClick: () => void; dataAttr: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      {...{ [dataAttr]: 'true' }}
      onClick={onClick}
      className={active ? 'rounded-xl bg-white px-3 py-2 text-blue-700 shadow-sm' : 'rounded-xl px-3 py-2 text-slate-600 hover:bg-white/70'}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, helper, tone }: { label: string; value: string | number; helper: string; tone: 'orange' | 'red' | 'green' }) {
  const toneClass = tone === 'orange' ? 'text-orange-600' : tone === 'red' ? 'text-red-600' : 'text-emerald-600';
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className={`text-2xl font-black ${toneClass}`}>{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function CaseRow({ caseRecord, navigate }: { caseRecord: any; navigate: (path: string) => void }) {
  const completeness = getCaseCompleteness(caseRecord);
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-black text-slate-950">{caseRecord.title || 'Sprawa klienta'}</p>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700">{caseStatusLabel(caseRecord.status)}</Badge>
        </div>
        <p className="mt-1 text-xs text-slate-500">Kompletność: {completeness}% · Aktualizacja: {formatDate(caseRecord.updatedAt || caseRecord.createdAt)}</p>
      </div>
      <Button size="sm" onClick={() => navigate(`/cases/${String(caseRecord.id)}`)}>Otwórz sprawę</Button>
    </div>
  );
}

function Header({ title, helper }: { title: string; helper: string }) {
  return (
    <div>
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function EmptyState({ text: content }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
      {content}
    </div>
  );
}
