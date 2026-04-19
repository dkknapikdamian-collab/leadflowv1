import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Search, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  LayoutDashboard, 
  Users, 
  Settings,
  LogOut,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Progress } from '../components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';

export default function Dashboard() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'cases'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const casesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCases(casesData);
      setLoading(false);
    });

    // Fetch templates
    const qTemplates = query(
      collection(db, 'templates'),
      where('ownerId', '==', auth.currentUser.uid)
    );
    const unsubscribeTemplates = onSnapshot(qTemplates, (snapshot) => {
      setTemplates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribe();
      unsubscribeTemplates();
    };
  }, []);

  const handleCreateCase = async () => {
    if (!newCaseTitle || !newClientName || !newClientEmail) {
      toast.error('Wypełnij wszystkie pola');
      return;
    }

    try {
      // 1. Create client
      const clientRef = await addDoc(collection(db, 'clients'), {
        name: newClientName,
        email: newClientEmail,
        ownerId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
      });

      // 2. Create case
      const caseRef = await addDoc(collection(db, 'cases'), {
        title: newCaseTitle,
        clientId: clientRef.id,
        clientName: newClientName,
        ownerId: auth.currentUser?.uid,
        status: 'new',
        completenessPercent: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 3. Add items from template if selected
      if (selectedTemplateId) {
        const template = templates.find(t => t.id === selectedTemplateId);
        if (template && template.items) {
          for (let i = 0; i < template.items.length; i++) {
            const item = template.items[i];
            await addDoc(collection(db, 'cases', caseRef.id, 'items'), {
              ...item,
              caseId: caseRef.id,
              status: 'missing',
              order: i,
              createdAt: serverTimestamp(),
            });
          }
        }
      }

      toast.success('Sprawa została utworzona');
      setIsNewCaseOpen(false);
      setNewCaseTitle('');
      setNewClientName('');
      setNewClientEmail('');
      setSelectedTemplateId('');
      navigate(`/case/${caseRef.id}`);
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    active: cases.filter(c => c.status !== 'completed').length,
    waiting: cases.filter(c => c.status === 'waiting_on_client').length,
    toApprove: cases.filter(c => c.status === 'to_approve').length,
    blocked: cases.filter(c => c.status === 'blocked').length,
    completed: cases.filter(c => c.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
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
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => auth.signOut()}>
            <LogOut className="w-5 h-5" />
            Wyloguj się
          </Button>
        </div>
      </aside>

      {/* Main Content */}
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
                  <Input id="title" placeholder="np. Strona WWW dla Firmy X" value={newCaseTitle} onChange={e => setNewCaseTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Nazwa klienta</Label>
                  <Input id="client" placeholder="Imię i nazwisko lub nazwa firmy" value={newClientName} onChange={e => setNewClientName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email klienta</Label>
                  <Input id="email" type="email" placeholder="klient@example.com" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">Szablon listy (opcjonalnie)</Label>
                  <select 
                    id="template"
                    className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm bg-white"
                    value={selectedTemplateId}
                    onChange={e => setSelectedTemplateId(e.target.value)}
                  >
                    <option value="">Brak szablonu</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
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

        {/* Stats Grid */}
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
                  <p className="text-sm font-medium text-slate-500">Do akceptu</p>
                  <h3 className="text-2xl font-bold text-blue-600">{stats.toApprove}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Blokują</p>
                  <h3 className="text-2xl font-bold text-red-600">{stats.blocked}</h3>
                </div>
                <div className="bg-red-50 p-3 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-500" />
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

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Szukaj sprawy lub klienta..." 
              className="pl-10 bg-white border-slate-200 h-11"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 gap-2 bg-white">
            <Filter className="w-5 h-5" />
            Filtruj
          </Button>
        </div>

        {/* Cases List */}
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
            filteredCases.map((c) => (
              <Link key={c.id} to={`/case/${c.id}`}>
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden mb-4">
                  <CardContent className="p-0">
                    <div className="flex items-center p-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                            {c.title}
                          </h4>
                          <Badge variant={
                            c.status === 'blocked' ? 'destructive' :
                            c.status === 'completed' ? 'secondary' :
                            c.status === 'waiting_on_client' ? 'outline' : 'default'
                          } className="capitalize">
                            {c.status === 'new' ? 'Nowa' :
                             c.status === 'waiting_on_client' ? 'Czeka na klienta' :
                             c.status === 'in_progress' ? 'W realizacji' :
                             c.status === 'to_approve' ? 'Do akceptacji' :
                             c.status === 'blocked' ? 'Zablokowana' : 'Zakończona'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {c.clientName}
                        </p>
                      </div>
                      <div className="hidden lg:block w-48 mx-8">
                        <div className="flex justify-between text-xs font-medium mb-1.5">
                          <span className="text-slate-500">Kompletność</span>
                          <span className="text-slate-900">{Math.round(c.completenessPercent || 0)}%</span>
                        </div>
                        <Progress value={c.completenessPercent || 0} className="h-2" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ostatni ruch</p>
                          <p className="text-sm font-medium text-slate-700">
                            {c.updatedAt?.toDate().toLocaleDateString() || 'Brak'}
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
