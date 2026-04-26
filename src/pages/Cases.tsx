import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Briefcase, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Progress } from '../components/ui/progress';

export default function Cases() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'cases'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: cases.length,
    waiting: cases.filter(c => c.status === 'waiting_on_client').length,
    blocked: cases.filter(c => c.status === 'blocked').length,
    ready: cases.filter(c => c.status === 'ready_to_start').length,
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sprawy</h1>
            <p className="text-slate-500">Zarządzaj realizacją i kompletnością materiałów.</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Wszystkie</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <Briefcase className="w-6 h-6 text-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Czekają</p>
                  <h3 className="text-2xl font-bold text-amber-600">{stats.waiting}</h3>
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
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Zablokowane</p>
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
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Gotowe do startu</p>
                  <h3 className="text-2xl font-bold text-green-600">{stats.ready}</h3>
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
              <p className="text-slate-500 max-w-xs mx-auto">Sprawy pojawią się tutaj po wygraniu leada lub ręcznym utworzeniu.</p>
            </div>
          ) : (
            filteredCases.map((c) => (
              <Link key={c.id} to={`/case/${c.id}`}>
                <Card className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden mb-4">
                  <CardContent className="p-0">
                    <div className="flex items-center p-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                            {c.title}
                          </h4>
                          <Badge variant={
                            c.status === 'blocked' ? 'destructive' :
                            c.status === 'ready_to_start' ? 'secondary' :
                            'default'
                          } className="capitalize text-[10px]">
                            {c.status.replace('_', ' ')}
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
      </div>
    </Layout>
  );
}
