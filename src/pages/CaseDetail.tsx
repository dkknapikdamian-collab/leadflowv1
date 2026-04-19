import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  doc,
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  setDoc,
  where,
} from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  ArrowLeft,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MoreVertical,
  Trash2,
  Check,
  X,
  ExternalLink,
  Copy,
  History,
  Paperclip,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { ScrollArea } from '../components/ui/scroll-area';
import Layout from '../components/Layout';
import {
  createClientPortalTokenInSupabase,
  fetchActivitiesFromSupabase,
  fetchCaseByIdFromSupabase,
  fetchCaseItemsFromSupabase,
  insertActivityToSupabase,
  insertCaseItemToSupabase,
  isSupabaseConfigured,
  updateCaseInSupabase,
  updateCaseItemInSupabase,
  deleteCaseItemFromSupabase,
} from '../lib/supabase-fallback';

function asDate(value: any) {
  if (!value) return null;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate();
  }
  return null;
}

function computeCaseStatus(items: any[]) {
  if (items.length === 0) {
    return { percent: 0, status: 'in_progress' };
  }

  const completed = items.filter((item) => item.status === 'accepted').length;
  const percent = (completed / items.length) * 100;
  const hasBlocked = items.some((item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected'));
  const hasToApprove = items.some((item) => item.status === 'uploaded');
  const allAccepted = items.every((item) => item.status === 'accepted');

  let status = 'in_progress';
  if (allAccepted) status = 'completed';
  else if (hasBlocked) status = 'blocked';
  else if (hasToApprove) status = 'to_approve';
  else status = 'waiting_on_client';

  return { percent, status };
}

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });

  async function refreshSupabaseCase() {
    if (!caseId) return;
    const [caseRow, caseItems, caseActivities] = await Promise.all([
      fetchCaseByIdFromSupabase(caseId),
      fetchCaseItemsFromSupabase(caseId),
      fetchActivitiesFromSupabase({ caseId, limit: 100 }),
    ]);
    setCaseData(caseRow);
    setItems(caseItems as any[]);
    setActivities(caseActivities as any[]);
  }

  useEffect(() => {
    if (!caseId) return;

    if (isSupabaseConfigured()) {
      let cancelled = false;
      const load = async () => {
        try {
          setLoading(true);
          await refreshSupabaseCase();
        } catch (error: any) {
          if (!cancelled) {
            toast.error(`Błąd sprawy: ${error.message}`);
            navigate('/cases');
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      void load();
      return () => {
        cancelled = true;
      };
    }

    const caseRef = doc(db, 'cases', caseId);
    const unsubscribeCase = onSnapshot(caseRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setCaseData({ id: docSnapshot.id, ...docSnapshot.data() });
      } else {
        toast.error('Sprawa nie istnieje');
        navigate('/');
      }
    });

    const itemsRef = collection(db, 'cases', caseId, 'items');
    const qItems = query(itemsRef, orderBy('order', 'asc'));
    const unsubscribeItems = onSnapshot(qItems, (snapshot) => {
      const itemsData = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as any));
      setItems(itemsData);
      setLoading(false);

      if (itemsData.length > 0) {
        const { percent, status } = computeCaseStatus(itemsData);
        updateDoc(caseRef, {
          completenessPercent: percent,
          status,
          updatedAt: serverTimestamp(),
        });
      }
    });

    const activitiesRef = collection(db, 'activities');
    const qActivities = query(
      activitiesRef,
      where('caseId', '==', caseId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeActivities = onSnapshot(qActivities, (snapshot) => {
      setActivities(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
    });

    return () => {
      unsubscribeCase();
      unsubscribeItems();
      unsubscribeActivities();
    };
  }, [caseId, navigate]);

  useEffect(() => {
    if (!isSupabaseConfigured() || !caseId || !caseData) return;
    const { percent, status } = computeCaseStatus(items);
    const currentPercent = Number(caseData.completenessPercent || 0);
    const currentStatus = String(caseData.status || 'in_progress');
    if (Math.round(currentPercent) === Math.round(percent) && currentStatus === status) return;

    let cancelled = false;
    const sync = async () => {
      try {
        await updateCaseInSupabase({
          id: caseId,
          completenessPercent: percent,
          status,
        });
        if (!cancelled) {
          setCaseData((prev: any) => ({ ...prev, completenessPercent: percent, status }));
        }
      } catch {
        // no toast, background sync only
      }
    };
    void sync();
    return () => {
      cancelled = true;
    };
  }, [items, caseId, caseData]);

  const handleAddItem = async () => {
    if (!newItem.title || !caseId) return;
    try {
      if (isSupabaseConfigured()) {
        await insertCaseItemToSupabase({
          caseId,
          title: newItem.title,
          description: newItem.description,
          type: newItem.type,
          isRequired: newItem.isRequired,
          dueDate: newItem.dueDate || null,
          order: items.length,
          status: 'missing',
        });
        await insertActivityToSupabase({
          caseId,
          ownerId: auth.currentUser?.uid || null,
          actorId: auth.currentUser?.uid || null,
          actorType: 'operator',
          eventType: 'item_added',
          payload: { title: newItem.title },
        });
        await refreshSupabaseCase();
      } else {
        await addDoc(collection(db, 'cases', caseId, 'items'), {
          ...newItem,
          caseId,
          status: 'missing',
          order: items.length,
          createdAt: serverTimestamp(),
        });

        await addDoc(collection(db, 'activities'), {
          caseId,
          ownerId: auth.currentUser?.uid,
          actorId: auth.currentUser?.uid,
          actorType: 'operator',
          eventType: 'item_added',
          payload: { title: newItem.title },
          createdAt: serverTimestamp(),
        });
      }

      setIsAddItemOpen(false);
      setNewItem({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
      toast.success('Element dodany');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleUpdateItemStatus = async (itemId: string, status: string, title: string) => {
    try {
      if (isSupabaseConfigured()) {
        await updateCaseItemInSupabase({
          id: itemId,
          caseId: caseId!,
          status,
          approvedAt: status === 'accepted' ? new Date().toISOString() : null,
        });
        await insertActivityToSupabase({
          caseId: caseId!,
          ownerId: auth.currentUser?.uid || null,
          actorId: auth.currentUser?.uid || null,
          actorType: 'operator',
          eventType: 'status_changed',
          payload: { title, status },
        });
        await refreshSupabaseCase();
      } else {
        await updateDoc(doc(db, 'cases', caseId!, 'items', itemId), {
          status,
          approvedAt: status === 'accepted' ? serverTimestamp() : null,
        });

        await addDoc(collection(db, 'activities'), {
          caseId,
          ownerId: auth.currentUser?.uid,
          actorId: auth.currentUser?.uid,
          actorType: 'operator',
          eventType: 'status_changed',
          payload: { title, status },
          createdAt: serverTimestamp(),
        });
      }
      toast.success('Status zaktualizowany');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      if (isSupabaseConfigured()) {
        await deleteCaseItemFromSupabase(itemId);
        await refreshSupabaseCase();
      } else {
        await deleteDoc(doc(db, 'cases', caseId!, 'items', itemId));
      }
      toast.success('Element usunięty');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const generatePortalLink = async () => {
    try {
      let token = '';
      if (isSupabaseConfigured()) {
        const result = await createClientPortalTokenInSupabase(caseId!);
        token = String((result as any).token || '');
        await refreshSupabaseCase();
      } else {
        token = Math.random().toString(36).substring(2, 15);
        const tokenRef = doc(db, 'client_portal_tokens', caseId!);
        await setDoc(tokenRef, {
          caseId,
          token,
          createdAt: serverTimestamp(),
        });
      }

      const url = `${window.location.origin}/portal/${caseId}/${token}`;
      await navigator.clipboard.writeText(url);
      toast.success('Link do panelu skopiowany!');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  };

  if (loading || !caseData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const updatedAt = asDate(caseData.updatedAt);

  return (
    <Layout>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/cases" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
                {caseData.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Klient: {caseData.clientName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={generatePortalLink}>
              <Copy className="w-4 h-4" />
              Kopiuj link dla klienta
            </Button>
            <Button size="sm" className="gap-2">
              <Send className="w-4 h-4" />
              Wyślij przypomnienie
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={caseData.status === 'blocked' ? 'destructive' : 'default'} className="px-3 py-1">
                    {caseData.status === 'new' ? 'Nowa' :
                     caseData.status === 'waiting_on_client' ? 'Czeka na klienta' :
                     caseData.status === 'in_progress' ? 'W realizacji' :
                     caseData.status === 'to_approve' ? 'Do akceptacji' :
                     caseData.status === 'blocked' ? 'Zablokowana' : 'Zakończona'}
                  </Badge>
                  <span className="text-sm text-slate-500 font-medium">
                    Ostatnia zmiana: {updatedAt ? updatedAt.toLocaleString() : '-'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-700">Postęp kompletności</span>
                    <span className="text-primary">{Math.round(caseData.completenessPercent || 0)}%</span>
                  </div>
                  <Progress value={caseData.completenessPercent || 0} className="h-3" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">Lista wymaganych elementów</h3>
                  <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Dodaj element
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dodaj wymagany element</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nazwa elementu</Label>
                          <Input placeholder="np. Logo w formacie SVG" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Opis / Instrukcja</Label>
                          <Textarea placeholder="Wyjaśnij klientowi co dokładnie ma zrobić..." value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Typ</Label>
                            <select
                              className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm"
                              value={newItem.type}
                              onChange={e => setNewItem({...newItem, type: e.target.value})}
                            >
                              <option value="file">Plik</option>
                              <option value="decision">Decyzja (Tak/Nie)</option>
                              <option value="text">Tekst / Odpowiedź</option>
                              <option value="access">Dostępy / Hasła</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2 pt-8">
                            <input
                              type="checkbox"
                              id="required"
                              checked={newItem.isRequired}
                              onChange={e => setNewItem({...newItem, isRequired: e.target.checked})}
                              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="required">Obowiązkowy</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Termin (opcjonalnie)</Label>
                          <Input type="date" value={newItem.dueDate} onChange={e => setNewItem({...newItem, dueDate: e.target.value})} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>Anuluj</Button>
                        <Button onClick={handleAddItem}>Dodaj element</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500">Brak elementów. Dodaj pierwszy element, aby zacząć.</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          item.status === 'accepted' ? 'bg-green-100 text-green-600' :
                          item.status === 'uploaded' ? 'bg-blue-100 text-blue-600' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          {item.status === 'accepted' ? <CheckCircle2 className="w-5 h-5" /> :
                           item.status === 'uploaded' ? <Clock className="w-5 h-5" /> :
                           item.status === 'rejected' ? <AlertCircle className="w-5 h-5" /> :
                           <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                            {item.isRequired && <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-red-200 text-red-500">Wymagane</Badge>}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="truncate">{item.description || 'Brak opisu'}</span>
                              {item.dueDate && (
                                <span className="flex items-center gap-1 text-amber-600 font-medium shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {new Date(item.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {(item.fileUrl || item.response) && (
                              <div className="mt-2 p-2 bg-slate-100 rounded-lg text-xs space-y-1">
                                {item.fileUrl && (
                                  <a
                                    href={item.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-primary hover:underline font-medium"
                                  >
                                    <Paperclip className="w-3 h-3" />
                                    {item.fileName || 'Pobierz plik'}
                                  </a>
                                )}
                                {item.response && (
                                  <p className="text-slate-600 italic flex items-start gap-1">
                                    <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                                    {item.response}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.status === 'uploaded' && (
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => handleUpdateItemStatus(item.id, 'accepted', item.title)}>
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleUpdateItemStatus(item.id, 'rejected', item.title)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteItem(item.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Usuń
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-400" />
                  Ostatnia aktywność
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] px-6 pb-6">
                  <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                    {activities.length === 0 ? (
                      <p className="text-center text-slate-400 py-8 text-sm">Brak aktywności</p>
                    ) : (
                      activities.map((activity) => {
                        const createdAt = asDate(activity.createdAt || activity.created_at);
                        const eventType = activity.eventType || activity.event_type;
                        const payload = activity.payload || {};
                        const actorType = activity.actorType || activity.actor_type;
                        return (
                          <div key={activity.id} className="relative pl-8">
                            <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                              actorType === 'operator' ? 'bg-primary' : 'bg-green-500'
                            }`} />
                            <p className="text-sm font-medium text-slate-900">
                              {actorType === 'operator' ? 'Ty' : 'Klient'}
                              <span className="font-normal text-slate-500 ml-1">
                                {eventType === 'item_added' ? `dodał element: ${payload.title}` :
                                 eventType === 'status_changed' ? `zmienił status ${payload.title} na ${payload.status}` :
                                 eventType === 'file_uploaded' ? `wgrał plik do: ${payload.title}` :
                                 eventType === 'decision_made' ? `podjął decyzję w: ${payload.title}` :
                                 'wykonał akcję'}
                              </span>
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {createdAt ? createdAt.toLocaleString() : ''}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary text-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Panel Klienta</h4>
                    <p className="text-xs text-white/70">Udostępnij ten link klientowi.</p>
                  </div>
                </div>
                <Button variant="secondary" className="w-full gap-2" onClick={generatePortalLink}>
                  <Copy className="w-4 h-4" />
                  Kopiuj link dostępu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  );
}
