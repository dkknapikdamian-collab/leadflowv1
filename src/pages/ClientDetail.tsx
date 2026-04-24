import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  Save,
  Target,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  fetchCasesFromSupabase,
  fetchClientByIdFromSupabase,
  fetchLeadsFromSupabase,
  fetchPaymentsFromSupabase,
  updateClientInSupabase,
} from '../lib/supabase-fallback';

type RelationItem = {
  id: string;
  kind: 'lead' | 'case' | 'payment';
  title: string;
  subtitle: string;
  status: string;
  date: string;
  amount?: number;
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asDate(value: unknown) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value: unknown) {
  const parsed = asDate(value);
  if (!parsed) return 'Brak daty';
  return parsed.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatMoney(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? `${amount.toLocaleString('pl-PL')} PLN` : '0 PLN';
}

function leadStatusLabel(status?: string) {
  switch (status) {
    case 'new':
      return 'Nowy';
    case 'contacted':
      return 'Skontaktowany';
    case 'qualification':
      return 'Kwalifikacja';
    case 'proposal_sent':
      return 'Oferta wysłana';
    case 'waiting_response':
      return 'Czeka na odpowiedź';
    case 'accepted':
      return 'Zaakceptowany';
    case 'moved_to_service':
      return 'W obsłudze';
    case 'won':
      return 'Wygrany';
    case 'lost':
      return 'Przegrany';
    case 'archived':
      return 'Archiwum';
    default:
      return status || 'Lead';
  }
}

function caseStatusLabel(status?: string) {
  switch (status) {
    case 'new':
      return 'Nowa';
    case 'waiting_on_client':
      return 'Czeka na klienta';
    case 'blocked':
      return 'Zablokowana';
    case 'to_approve':
      return 'Do akceptacji';
    case 'ready_to_start':
      return 'Gotowa do startu';
    case 'in_progress':
      return 'W realizacji';
    case 'on_hold':
      return 'Wstrzymana';
    case 'completed':
      return 'Zakończona';
    case 'canceled':
      return 'Anulowana';
    default:
      return status || 'Sprawa';
  }
}

function paymentStatusLabel(status?: string) {
  switch (status) {
    case 'paid':
    case 'fully_paid':
      return 'Opłacone';
    case 'partially_paid':
      return 'Częściowo opłacone';
    case 'awaiting_payment':
      return 'Czeka na płatność';
    case 'deposit_paid':
      return 'Zaliczka';
    case 'refunded':
      return 'Zwrot';
    case 'written_off':
      return 'Spisane';
    default:
      return status || 'Rozliczenie';
  }
}

function buildRelationTimeline(leads: any[], cases: any[], payments: any[]) {
  const leadItems: RelationItem[] = leads.map((lead) => ({
    id: String(lead.id || ''),
    kind: 'lead',
    title: String(lead.name || lead.company || 'Lead'),
    subtitle: `${formatMoney(lead.dealValue)} · ${leadStatusLabel(String(lead.status || 'new'))}`,
    status: leadStatusLabel(String(lead.status || 'new')),
    date: String(lead.updatedAt || lead.createdAt || ''),
    amount: Number(lead.dealValue || 0),
  }));

  const caseItems: RelationItem[] = cases.map((caseRecord) => ({
    id: String(caseRecord.id || ''),
    kind: 'case',
    title: String(caseRecord.title || caseRecord.clientName || 'Sprawa'),
    subtitle: `Kompletność ${Math.round(Number(caseRecord.completenessPercent || 0))}% · ${caseStatusLabel(String(caseRecord.status || 'in_progress'))}`,
    status: caseStatusLabel(String(caseRecord.status || 'in_progress')),
    date: String(caseRecord.updatedAt || caseRecord.createdAt || ''),
  }));

  const paymentItems: RelationItem[] = payments.map((payment) => ({
    id: String(payment.id || ''),
    kind: 'payment',
    title: formatMoney(payment.amount),
    subtitle: paymentStatusLabel(String(payment.status || 'not_started')),
    status: paymentStatusLabel(String(payment.status || 'not_started')),
    date: String(payment.paidAt || payment.dueAt || payment.updatedAt || payment.createdAt || ''),
    amount: Number(payment.amount || 0),
  }));

  return [...leadItems, ...caseItems, ...paymentItems]
    .filter((item) => item.id)
    .sort((left, right) => {
      const leftTime = asDate(left.date)?.getTime() ?? 0;
      const rightTime = asDate(right.date)?.getTime() ?? 0;
      return rightTime - leftTime;
    });
}

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', notes: '' });

  const reload = useCallback(async () => {
    if (!workspace?.id || !clientId) {
      setLoading(workspaceLoading);
      return;
    }
    setLoading(true);
    try {
      const [clientRow, leadRows, caseRows, paymentRows] = await Promise.all([
        fetchClientByIdFromSupabase(clientId),
        fetchLeadsFromSupabase({ clientId }),
        fetchCasesFromSupabase({ clientId }),
        fetchPaymentsFromSupabase({ clientId }),
      ]);
      setClient(clientRow);
      setLeads(leadRows as any[]);
      setCases(caseRows as any[]);
      setPayments(paymentRows as any[]);
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

  const paymentTotal = useMemo(
    () => payments.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0),
    [payments],
  );

  const openLeadCount = useMemo(
    () => leads.filter((lead) => !['moved_to_service', 'lost', 'archived'].includes(String(lead.status || ''))).length,
    [leads],
  );

  const activeCaseCount = useMemo(
    () => cases.filter((caseRecord) => !['completed', 'canceled'].includes(String(caseRecord.status || ''))).length,
    [cases],
  );

  const relationTimeline = useMemo(() => buildRelationTimeline(leads, cases, payments), [cases, leads, payments]);

  const handleSave = async () => {
    if (!clientId) return;
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    try {
      setSaving(true);
      await updateClientInSupabase({
        id: clientId,
        ...form,
      });
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
        <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="p-6 space-y-4">
          <Button variant="outline" onClick={() => navigate('/clients')}><ArrowLeft className="w-4 h-4 mr-2" /> Wróć</Button>
          <Card><CardContent className="p-6 text-slate-500">Nie znaleziono klienta.</CardContent></Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/clients')}><ArrowLeft className="w-4 h-4 mr-2" /> Klienci</Button>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Klient jako centrum relacji</p>
              <h1 className="text-2xl font-bold text-slate-950">{client.name || 'Klient'}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/leads')}><Target className="w-4 h-4 mr-2" /> Leady</Button>
            <Button variant="outline" onClick={() => navigate('/cases')}><Briefcase className="w-4 h-4 mr-2" /> Sprawy</Button>
            <Button onClick={() => void handleSave()} disabled={saving}><Save className="w-4 h-4 mr-2" /> {saving ? 'Zapisywanie...' : 'Zapisz'}</Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 md:p-5">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{openLeadCount} aktywne leady</Badge>
                  <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">{activeCaseCount} aktywne sprawy</Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{formatMoney(paymentTotal)}</Badge>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ten ekran zbiera całą ścieżkę klienta: leady, sprawy i rozliczenia. Dzięki temu nie trzeba szukać ręcznie,
                  z którego leada powstała sprawa i co jest aktualnym miejscem pracy.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-800 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Szybka kontrola</div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <span>Kontakt:</span><span className="text-right font-medium">{form.email || form.phone ? 'uzupełniony' : 'brak'}</span>
                  <span>Praca:</span><span className="text-right font-medium">{activeCaseCount > 0 ? 'sprawa aktywna' : openLeadCount > 0 ? 'lead aktywny' : 'brak aktywnej pracy'}</span>
                  <span>Rozliczenia:</span><span className="text-right font-medium">{payments.length > 0 ? `${payments.length} wpisów` : 'brak'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserRound className="w-5 h-5" /> Dane klienta</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Nazwa</Label><Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} /></div>
              <div className="space-y-1"><Label>Firma</Label><Input value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} /></div>
              <div className="space-y-1"><Label>E-mail</Label><Input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} /></div>
              <div className="space-y-1"><Label>Telefon</Label><Input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} /></div>
              <div className="space-y-1 md:col-span-2"><Label>Notatki</Label><Textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} rows={4} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Calendar className="w-4 h-4" /> Ścieżka klienta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {relationTimeline.length === 0 ? (
                <p className="text-sm text-slate-500">Brak historii powiązanej z tym klientem.</p>
              ) : relationTimeline.slice(0, 8).map((item) => (
                <div key={`${item.kind}:${item.id}`} className="flex gap-3 rounded-lg border border-slate-200 p-3">
                  <div className="mt-0.5 rounded-full bg-slate-100 p-2">
                    {item.kind === 'lead' ? <Target className="w-4 h-4 text-blue-600" /> : item.kind === 'case' ? <Briefcase className="w-4 h-4 text-violet-600" /> : <CreditCard className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-slate-900 truncate">{item.title}</p>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{formatDate(item.date)}</span>
                    </div>
                    <p className="text-sm text-slate-500">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Leady</p><p className="text-2xl font-bold">{leads.length}</p><p className="text-xs text-slate-500">Aktywne: {openLeadCount}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Sprawy</p><p className="text-2xl font-bold">{cases.length}</p><p className="text-xs text-slate-500">Aktywne: {activeCaseCount}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Rozliczenia</p><p className="text-2xl font-bold">{formatMoney(paymentTotal)}</p><p className="text-xs text-slate-500">Wpisy: {payments.length}</p></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Target className="w-4 h-4" /> Leady klienta</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {leads.length === 0 ? <p className="text-sm text-slate-500">Brak leadów.</p> : leads.map((lead) => (
                <div key={lead.id} className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">{lead.name || 'Lead'}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span>{formatMoney(lead.dealValue)}</span>
                        {asText(lead.email) ? <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span> : null}
                        {asText(lead.phone) ? <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span> : null}
                      </div>
                    </div>
                    <Badge variant="outline">{leadStatusLabel(String(lead.status || 'new'))}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/leads/${String(lead.id)}`)}>Otwórz lead <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    {lead.linkedCaseId ? (
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/case/${String(lead.linkedCaseId)}`)}>Otwórz sprawę</Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="w-4 h-4" /> Sprawy klienta</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {cases.length === 0 ? <p className="text-sm text-slate-500">Brak spraw.</p> : cases.map((caseRecord) => (
                <div key={caseRecord.id} className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">{caseRecord.title || 'Sprawa'}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span>Kompletność: {Math.round(Number(caseRecord.completenessPercent || 0))}%</span>
                        {caseRecord.clientName ? <span className="inline-flex items-center gap-1"><Building2 className="w-3 h-3" /> {caseRecord.clientName}</span> : null}
                      </div>
                    </div>
                    <Badge variant="outline">{caseStatusLabel(String(caseRecord.status || 'in_progress'))}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/case/${String(caseRecord.id)}`)}>Otwórz sprawę <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    {caseRecord.leadId ? (
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/leads/${String(caseRecord.leadId)}`)}>Otwórz lead</Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CreditCard className="w-4 h-4" /> Rozliczenia klienta</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {payments.length === 0 ? <p className="text-sm text-slate-500">Brak rozliczeń.</p> : payments.map((payment) => (
              <div key={payment.id} className="rounded-lg border border-slate-200 p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{formatMoney(payment.amount)}</p>
                  <p className="text-sm text-slate-500">{payment.note || paymentStatusLabel(String(payment.status || 'not_started'))}</p>
                </div>
                <Badge variant="outline">{paymentStatusLabel(String(payment.status || 'not_started'))}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
