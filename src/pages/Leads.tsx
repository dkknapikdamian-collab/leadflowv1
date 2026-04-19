import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  writeBatch,
  doc
} from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Target, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Clock,
  X,
  FileText,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Papa from 'papaparse';
import { format, parseISO, isPast, isAfter, subDays, startOfDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useWorkspace } from '../hooks/useWorkspace';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nowy', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Skontaktowany', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'qualification', label: 'Kwalifikacja', color: 'bg-purple-100 text-purple-700' },
  { value: 'proposal_sent', label: 'Oferta wysłana', color: 'bg-amber-100 text-amber-700' },
  { value: 'follow_up', label: 'Follow-up', color: 'bg-orange-100 text-orange-700' },
  { value: 'negotiation', label: 'Negocjacje', color: 'bg-pink-100 text-pink-700' },
  { value: 'won', label: 'Wygrany', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'lost', label: 'Przegrany', color: 'bg-slate-100 text-slate-700' },
];

const SOURCE_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'form', label: 'Formularz' },
  { value: 'phone', label: 'Telefon' },
  { value: 'referral', label: 'Polecenie' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'other', label: 'Inne' },
];

export default function Leads() {
  const { workspace, hasAccess } = useWorkspace();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [atRiskFilter, setAtRiskFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', source: 'other', dealValue: '', company: '', nextStep: '', nextActionAt: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    const q = query(
      collection(db, 'leads'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workspace]);

  const handleCreateLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    if (!newLead.name) return toast.error('Wpisz nazwę leada');

    try {
      await addDoc(collection(db, 'leads'), {
        ...newLead,
        dealValue: Number(newLead.dealValue) || 0,
        status: 'new',
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isAtRisk: false,
      });

      toast.success('Lead dodany');
      setIsNewLeadOpen(false);
      setNewLead({ name: '', email: '', phone: '', source: 'other', dealValue: '', company: '', nextStep: '', nextActionAt: '' });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleImportCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !workspace || !hasAccess) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const batch = writeBatch(db);
        let count = 0;

        for (const row of results.data as any[]) {
          if (!row.name) continue;
          const leadRef = doc(collection(db, 'leads'));
          batch.set(leadRef, {
            name: row.name,
            email: row.email || '',
            phone: row.phone || '',
            company: row.company || '',
            source: row.source || 'other',
            dealValue: Number(row.dealValue) || 0,
            status: 'new',
            ownerId: auth.currentUser?.uid,
            workspaceId: workspace.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isAtRisk: false,
          });
          count++;
          if (count >= 450) break; // Firestore batch limit is 500
        }

        try {
          await batch.commit();
          toast.success(`Zaimportowano ${count} leadów`);
        } catch (error: any) {
          toast.error('Błąd importu: ' + error.message);
        }
      }
    });
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         l.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
    const matchesAtRisk = atRiskFilter === 'all' || 
                         (atRiskFilter === 'at-risk' && l.isAtRisk) || 
                         (atRiskFilter === 'safe' && !l.isAtRisk);
    
    let matchesActivity = true;
    if (activityFilter !== 'all' && l.updatedAt) {
      const lastActivity = l.updatedAt.toDate();
      const now = new Date();
      if (activityFilter === 'today') {
        matchesActivity = isAfter(lastActivity, startOfDay(now));
      } else if (activityFilter === 'week') {
        matchesActivity = isAfter(lastActivity, subDays(now, 7));
      } else if (activityFilter === 'month') {
        matchesActivity = isAfter(lastActivity, subDays(now, 30));
      }
    }

    return matchesSearch && matchesStatus && matchesSource && matchesAtRisk && matchesActivity;
  });

  const stats = {
    total: leads.length,
    active: leads.filter(l => !['won', 'lost'].includes(l.status)).length,
    value: leads.reduce((acc, l) => acc + (l.dealValue || 0), 0),
    atRisk: leads.filter(l => l.isAtRisk).length,
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Leady</h1>
            <p className="text-slate-500">Zarządzaj procesem sprzedaży i domykaj deale.</p>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImportCSV} 
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="rounded-xl">
              <Upload className="w-4 h-4 mr-2" /> Import CSV
            </Button>
            
            <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4 mr-2" /> Dodaj leada
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Nowy lead</DialogTitle></DialogHeader>
                <form onSubmit={handleCreateLead} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Imię i nazwisko / Nazwa</Label>
                    <Input value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Firma</Label>
                    <Input value={newLead.company} onChange={e => setNewLead({...newLead, company: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon</Label>
                      <Input value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Wartość (PLN)</Label>
                      <Input type="number" value={newLead.dealValue} onChange={e => setNewLead({...newLead, dealValue: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Źródło</Label>
                      <Select value={newLead.source} onValueChange={v => setNewLead({...newLead, source: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SOURCE_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Kolejny krok</Label>
                      <Input value={newLead.nextStep} onChange={e => setNewLead({...newLead, nextStep: e.target.value})} placeholder="np. Telefon z ofertą" />
                    </div>
                    <div className="space-y-2">
                      <Label>Termin ruchu</Label>
                      <Input type="date" value={newLead.nextActionAt} onChange={e => setNewLead({...newLead, nextActionAt: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">Stwórz leada</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wszystkie</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl"><Target className="w-6 h-6 text-slate-400" /></div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Aktywne</p>
                <h3 className="text-2xl font-bold text-blue-600">{stats.active}</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-2xl"><TrendingUp className="w-6 h-6 text-blue-500" /></div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wartość</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.value.toLocaleString()} PLN</h3>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl"><TrendingUp className="w-6 h-6 text-slate-400" /></div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Zagrożone</p>
                <h3 className="text-2xl font-bold text-rose-600">{stats.atRisk}</h3>
              </div>
              <div className="bg-rose-50 p-3 rounded-2xl"><AlertTriangle className="w-6 h-6 text-rose-500" /></div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Szukaj po nazwie, emailu, firmie..." 
                className="pl-10 rounded-xl bg-slate-50 border-none h-11"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[140px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Źródło" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie źródła</SelectItem>
                  {SOURCE_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={atRiskFilter} onValueChange={setAtRiskFilter}>
                <SelectTrigger className="w-[140px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Ryzyko" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="at-risk">Zagrożone</SelectItem>
                  <SelectItem value="safe">Bezpieczne</SelectItem>
                </SelectContent>
              </Select>
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-[140px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Aktywność" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Kiedykolwiek</SelectItem>
                  <SelectItem value="today">Dzisiaj</SelectItem>
                  <SelectItem value="week">Ostatnie 7 dni</SelectItem>
                  <SelectItem value="month">Ostatnie 30 dni</SelectItem>
                </SelectContent>
              </Select>
              {(statusFilter !== 'all' || sourceFilter !== 'all' || atRiskFilter !== 'all' || activityFilter !== 'all' || searchQuery) && (
                <Button variant="ghost" onClick={() => { 
                  setStatusFilter('all'); 
                  setSourceFilter('all'); 
                  setAtRiskFilter('all');
                  setActivityFilter('all');
                  setSearchQuery(''); 
                }} className="h-11 rounded-xl">
                  <X className="w-4 h-4 mr-2" /> Wyczyść
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-slate-500">Ładowanie Twoich leadów...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Nie znaleziono leadów</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-1">Spróbuj zmienić filtry lub dodaj nowego leada.</p>
            </div>
          ) : (
            filteredLeads.map(lead => {
              const status = STATUS_OPTIONS.find(s => s.value === lead.status) || STATUS_OPTIONS[0];
              const isOverdue = lead.nextActionAt && isPast(parseISO(lead.nextActionAt));

              return (
                <Link key={lead.id} to={`/leads/${lead.id}`}>
                  <Card className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center p-5 gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                              {lead.name}
                            </h4>
                            <Badge className={`${status.color} border-none font-medium text-[10px] uppercase`}>
                              {status.label}
                            </Badge>
                            {lead.isAtRisk && (
                              <Badge variant="destructive" className="animate-pulse text-[10px] uppercase">Zagrożony</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            {lead.company && <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {lead.company}</span>}
                            <span className="flex items-center gap-1 capitalize"><Target className="w-3.5 h-3.5" /> {lead.source}</span>
                            {lead.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {lead.email}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right hidden lg:block w-32">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Wartość</p>
                            <p className="text-base font-bold text-slate-900">{(lead.dealValue || 0).toLocaleString()} PLN</p>
                          </div>

                          <div className="text-right w-32">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Następny krok</p>
                            {lead.nextActionAt ? (
                              <p className={`text-sm font-bold flex items-center justify-end gap-1 ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                                {isOverdue && <AlertTriangle className="w-3 h-3" />}
                                {format(parseISO(lead.nextActionAt), 'd MMM', { locale: pl })}
                              </p>
                            ) : (
                              <p className="text-sm font-bold text-amber-600 flex items-center justify-end gap-1">
                                <Clock className="w-3 h-3" /> Brak
                              </p>
                            )}
                          </div>

                          <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
