import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, CreditCard, Loader2, Save, Target, UserRound } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import { fetchCaseByIdFromSupabase, fetchCasesFromSupabase, fetchClientByIdFromSupabase, fetchLeadsFromSupabase, fetchPaymentsFromSupabase, updateClientInSupabase } from '../lib/supabase-fallback';

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { workspace, hasAccess } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', notes: '' });

  const reload = useCallback(async () => {
    if (!workspace || !clientId) return;
    setLoading(true);
    try {
      const [clientRow, leadRows, caseRows, paymentRows] = await Promise.all([
        fetchClientByIdFromSupabase(clientId),
        fetchLeadsFromSupabase(),
        fetchCasesFromSupabase(),
        fetchPaymentsFromSupabase({ clientId }),
      ]);
      setClient(clientRow);
      setLeads((leadRows as any[]).filter((entry) => String(entry.clientId || '') === clientId));
      setCases((caseRows as any[]).filter((entry) => String(entry.clientId || '') === clientId));
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
  }, [clientId, workspace]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const paymentTotal = useMemo(
    () => payments.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0),
    [payments],
  );

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
      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => navigate('/clients')}><ArrowLeft className="w-4 h-4 mr-2" /> Klienci</Button>
          <Button onClick={() => void handleSave()} disabled={saving}><Save className="w-4 h-4 mr-2" /> {saving ? 'Zapisywanie...' : 'Zapisz'}</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserRound className="w-5 h-5" /> {client.name || 'Klient'}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Nazwa</Label><Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} /></div>
            <div className="space-y-1"><Label>Firma</Label><Input value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} /></div>
            <div className="space-y-1"><Label>E-mail</Label><Input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} /></div>
            <div className="space-y-1"><Label>Telefon</Label><Input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} /></div>
            <div className="space-y-1 md:col-span-2"><Label>Notatki</Label><Textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} rows={4} /></div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Leady</p><p className="text-2xl font-bold">{leads.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Sprawy</p><p className="text-2xl font-bold">{cases.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Rozliczenia</p><p className="text-2xl font-bold">{paymentTotal.toLocaleString()} PLN</p></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Target className="w-4 h-4" /> Leady klienta</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {leads.length === 0 ? <p className="text-sm text-slate-500">Brak leadów.</p> : leads.map((lead) => (
                <Link key={lead.id} to={`/leads/${lead.id}`} className="block rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                  <p className="font-medium text-slate-900">{lead.name || 'Lead'}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{Number(lead.dealValue || 0).toLocaleString()} PLN</span>
                    <Badge variant="outline">{lead.status || 'new'}</Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="w-4 h-4" /> Sprawy klienta</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {cases.length === 0 ? <p className="text-sm text-slate-500">Brak spraw.</p> : cases.map((caseRecord) => (
                <Link key={caseRecord.id} to={`/case/${caseRecord.id}`} className="block rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                  <p className="font-medium text-slate-900">{caseRecord.title || 'Sprawa'}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Kompletność: {Math.round(Number(caseRecord.completenessPercent || 0))}%</span>
                    <Badge variant="outline">{caseRecord.status || 'in_progress'}</Badge>
                  </div>
                </Link>
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
                  <p className="font-medium text-slate-900">{Number(payment.amount || 0).toLocaleString()} {payment.currency || 'PLN'}</p>
                  <p className="text-sm text-slate-500">{payment.note || 'Rozliczenie'}</p>
                </div>
                <Badge variant="outline">{payment.status || 'not_started'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
