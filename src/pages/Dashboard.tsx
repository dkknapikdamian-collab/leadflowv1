import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ChevronRight, Clock, Filter, LayoutDashboard, LogOut, Plus, Search, Settings, Users, X } from 'lucide-react';
import { auth } from '../firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';


import { toast } from 'sonner';
import { Progress } from '../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  createCaseInSupabase,
  createClientInSupabase,
  fetchCasesFromSupabase,
  fetchCaseTemplatesFromSupabase,
  insertCaseItemToSupabase,
  isSupabaseConfigured,
} from '../lib/supabase-fallback';

type DashboardCase = {
  id: string;
  title?: string;
  clientName?: string;
  status?: string;
  completenessPercent?: number;
  updatedAt?: string | null;
};

type DashboardTemplate = {
  id: string;
  name?: string;
  items?: Array<{
    title?: string;
    description?: string;
    type?: string;
    isRequired?: boolean;
  }>;
};

function extractCreatedId(value: unknown) {
  if (!value || typeof value !== 'object') return '';
  const row = value as Record<string, unknown>;
  return typeof row.id === 'string' ? row.id : '';
}

function formatDate(value: unknown) {
  if (!value) return 'Brak';

  if (typeof value === 'object' && value && 'toDate' in (value as Record<string, unknown>)) {
    try {
      const date = (value as { toDate: () => Date }).toDate();
      return Number.isFinite(date.getTime()) ? date.toLocaleDateString() : 'Brak';
    } catch {
      return 'Brak';
    }
  }

  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleDateString() : 'Brak';
  }

  return 'Brak';
}

export default function Dashboard() {
  const [cases, setCases] = useState<DashboardCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [templates, setTemplates] = useState<DashboardTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const navigate = useNavigate();

  async function loadDashboardData() {
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        setCases([]);
        setTemplates([]);
        return;
      }

      const [caseRows, templateRows] = await Promise.all([
        fetchCasesFromSupabase(),
        fetchCaseTemplatesFromSupabase({ includeArchived: false }),
      ]);

      setCases((Array.isArray(caseRows) ? caseRows : []) as DashboardCase[]);
      setTemplates((Array.isArray(templateRows) ? templateRows : []) as DashboardTemplate[]);
    } catch (error: any) {
      toast.error(`Nie udało się pobrać spraw: ${error?.message || 'REQUEST_FAILED'}`);
      setCases([]);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboardData();
  }, []);

  const handleCreateCase = async () => {
    if (!newCaseTitle || !newClientName || !newClientEmail) {
      toast.error('Wypełnij wszystkie pola');
      return;
    }

    if (!isSupabaseConfigured()) {
      toast.error('Tworzenie spraw wymaga Supabase. Firestore nie jest już używany jako zapis.');
      return;
    }

    try {
      const client = await createClientInSupabase({
        name: newClientName,
        email: newClientEmail,
      });
      const clientId = extractCreatedId(client);

      const createdCase = await createCaseInSupabase({
        title: newCaseTitle,
        clientId: clientId || null,
        clientName: newClientName,
        clientEmail: newClientEmail,
        status: 'new',
        completenessPercent: 0,
      });
      const caseId = extractCreatedId(createdCase);

      if (!caseId) {
        throw new Error('CASE_ID_MISSING_AFTER_CREATE');
      }

      if (selectedTemplateId) {
        const template = templates.find((item) => item.id === selectedTemplateId);
        const items = Array.isArray(template?.items) ? template.items : [];

        for (let index = 0; index < items.length; index += 1) {
          const item = items[index];
          await insertCaseItemToSupabase({
            caseId,
            title: item.title || 'Element sprawy',
            description: item.description || '',
            type: item.type || 'file',
            isRequired: item.isRequired !== false,
            status: 'missing',
            order: index,
          });
        }
      }

      toast.success('Sprawa została utworzona');
      setIsNewCaseOpen(false);
      setNewCaseTitle('');
      setNewClientName('');
      setNewClientEmail('');
      setSelectedTemplateId('');
      await loadDashboardData();
      navigate(`/case/${caseId}`);
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'REQUEST_FAILED'));
    }
  };

  const filteredCases = cases.filter((caseItem) => {
    const haystack = `${caseItem.title || ''} ${caseItem.clientName || ''}`.toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });

  const stats = {
    active: cases.filter((caseItem) => caseItem.status !== 'completed').length,
    waiting: cases.filter((caseItem) => caseItem.status === 'waiting_on_client').length,
    toApprove: cases.filter((caseItem) => caseItem.status === 'to_approve').length,
    blocked: cases.filter((caseItem) => caseItem.status === 'blocked').length,
    completed: cases.filter((caseItem) => caseItem.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Panel Kompletności
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-slate-100 text-primary">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600">
            <Users className="w-5 h-5" />
            Klienci
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600">
            <Settings className="w-5 h-5" />
            Ustawienia
          </Button>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Button variant="ghost" className="cf-session-action-danger w-full justify-start gap-3" data-cf-session-action="logout" onClick={() => auth.signOut()}>
            <LogOut className="w-5 h-5" />
            Wyloguj się
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Witaj, {auth.currentUser?.displayName}</h2>
            <p className="text-slate-500">Oto co dzieje się w Twoich projektach.</p>
          </div>
          <Dialog open={isNewCaseOpen} onOpenChange={setIsNewCaseOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5" />
                Nowa sprawa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Utwórz nową sprawę</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Nazwa sprawy</Label>
                  <Input id="title" placeholder="np. Strona WWW dla Firmy X" value={newCaseTitle} onChange={(event) => setNewCaseTitle(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Nazwa klienta</Label>
                  <Input id="client" placeholder="Imię i nazwisko lub nazwa firmy" value={newClientName} onChange={(event) => setNewClientName(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email klienta</Label>
                  <Input id="email" type="email" placeholder="klient@example.com" value={newClientEmail} onChange={(event) => setNewClientEmail(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">Szablon listy (opcjonalnie)</Label>
                  <select
                    id="template"
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm bg-white"
                    value={selectedTemplateId}
                    onChange={(event) => setSelectedTemplateId(event.target.value)}
                  >
                    <option value="">Brak szablonu</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewCaseOpen(false)}>Anuluj</Button>
                <Button onClick={handleCreateCase}>Utwórz sprawę</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Aktywne</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stats.active}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <LayoutDashboard className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Czekają</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stats.waiting}</h3>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Do akceptacji</p>
                  <h3 className="text-2xl font-bold text-blue-600">{stats.toApprove}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm cf-severity-panel" data-cf-severity="error">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Blokują</p>
                  <h3 className="text-2xl font-bold cf-severity-text-error">{stats.blocked}</h3>
                </div>
                <div className="cf-severity-dot" data-cf-severity="error">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Gotowe</p>
                  <h3 className="text-2xl font-bold text-green-600">{stats.completed}</h3>
                </div>
                <div className="bg-green-50 p-3 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Szukaj sprawy lub klienta..."
              className="pl-10 bg-white border-slate-200 h-11"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 gap-2 bg-white">
            <Filter className="w-5 h-5" />
            Filtruj
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-slate-500">Ładowanie spraw...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Nie znaleziono spraw</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Zacznij od utworzenia nowej sprawy, aby śledzić postępy.</p>
            </div>
          ) : (
            filteredCases.map((caseItem) => (
              <Link key={caseItem.id} to={`/case/${caseItem.id}`}>
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden mb-4">
                  <CardContent className="p-0">
                    <div className="flex items-center p-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                            {caseItem.title}
                          </h4>
                          <Badge variant={
                            caseItem.status === 'blocked' ? 'destructive' :
                            caseItem.status === 'completed' ? 'secondary' :
                            caseItem.status === 'waiting_on_client' ? 'outline' : 'default'
                          } className="capitalize">
                            {caseItem.status === 'new' ? 'Nowa' :
                             caseItem.status === 'waiting_on_client' ? 'Czeka na klienta' :
                             caseItem.status === 'in_progress' ? 'W realizacji' :
                             caseItem.status === 'to_approve' ? 'Do akceptacji' :
                             caseItem.status === 'blocked' ? 'Zablokowana' : 'Zrobione'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {caseItem.clientName}
                        </p>
                      </div>
                      <div className="hidden lg:block w-48 mx-8">
                        <div className="flex justify-between text-xs font-medium mb-1.5">
                          <span className="text-slate-500">Kompletność</span>
                          <span className="text-slate-900">{Math.round(caseItem.completenessPercent || 0)}%</span>
                        </div>
                        <Progress value={caseItem.completenessPercent || 0} className="h-2" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ostatni ruch</p>
                          <p className="text-sm font-medium text-slate-700">
                            {formatDate(caseItem.updatedAt)}
                          </p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
