import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  where,
  deleteDoc
} from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  History, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Send,
  MoreVertical,
  Plus,
  Briefcase,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  Trash2,
  Edit2,
  FileText,
  User,
  Loader2,
  ExternalLink,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { format, parseISO, isPast } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

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

export default function LeadDetail() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { workspace, hasAccess } = useWorkspace();
  const [lead, setLead] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [associatedCase, setAssociatedCase] = useState<any>(null);
  
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editLead, setEditLead] = useState<any>(null);

  useEffect(() => {
    if (!leadId || !workspace) return;

    const leadRef = doc(db, 'leads', leadId);
    const unsubLead = onSnapshot(leadRef, (doc) => {
      if (doc.exists()) {
        const data = doc.id ? { id: doc.id, ...doc.data() } : null;
        setLead(data);
        setEditLead(data);
      } else {
        toast.error('Lead nie istnieje');
        navigate('/leads');
      }
    });

    const activitiesRef = collection(db, 'activities');
    const qActivities = query(
      activitiesRef, 
      where('leadId', '==', leadId),
      orderBy('createdAt', 'desc')
    );
    const unsubActivities = onSnapshot(qActivities, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qTemplates = query(collection(db, 'templates'), where('ownerId', '==', auth.currentUser?.uid));
    const unsubTemplates = onSnapshot(qTemplates, (snapshot) => {
      setTemplates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qCases = query(collection(db, 'cases'), where('leadId', '==', leadId));
    const unsubCases = onSnapshot(qCases, (snapshot) => {
      if (!snapshot.empty) {
        setAssociatedCase({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setAssociatedCase(null);
      }
      setLoading(false);
    });

    return () => {
      unsubLead();
      unsubActivities();
      unsubTemplates();
      unsubCases();
    };
  }, [leadId, navigate, workspace]);

  const handleUpdateStatus = async (status: string) => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    try {
      await updateDoc(doc(db, 'leads', leadId!), { 
        status,
        updatedAt: serverTimestamp()
      });
      
      await addDoc(collection(db, 'activities'), {
        leadId,
        ownerId: auth.currentUser?.uid,
        actorId: auth.currentUser?.uid,
        actorType: 'operator',
        eventType: 'status_changed',
        payload: { status },
        createdAt: serverTimestamp(),
      });

      toast.success('Status zaktualizowany');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !hasAccess) return;
    try {
      await addDoc(collection(db, 'activities'), {
        leadId,
        ownerId: auth.currentUser?.uid,
        actorId: auth.currentUser?.uid,
        actorType: 'operator',
        eventType: 'note_added',
        payload: { content: note },
        createdAt: serverTimestamp(),
      });
      setNote('');
      toast.success('Notatka dodana');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleUpdateLead = async () => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    try {
      await updateDoc(doc(db, 'leads', leadId!), {
        ...editLead,
        dealValue: Number(editLead.dealValue) || 0,
        updatedAt: serverTimestamp()
      });
      setIsEditing(false);
      toast.success('Dane zaktualizowane');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleDeleteLead = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć tego leada?')) return;
    try {
      await deleteDoc(doc(db, 'leads', leadId!));
      toast.success('Lead usunięty');
      navigate('/leads');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleCreateCase = async () => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    try {
      const caseRef = await addDoc(collection(db, 'cases'), {
        leadId,
        title: `Realizacja: ${lead.name}`,
        clientName: lead.name,
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        status: 'collecting_materials',
        completenessPercent: 0,
        isBlocked: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

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

      await addDoc(collection(db, 'activities'), {
        leadId,
        caseId: caseRef.id,
        ownerId: auth.currentUser?.uid,
        actorId: auth.currentUser?.uid,
        actorType: 'operator',
        eventType: 'case_created',
        payload: { title: lead.name },
        createdAt: serverTimestamp(),
      });

      toast.success('Sprawa została utworzona');
      navigate(`/case/${caseRef.id}`);
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  if (loading || !lead) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const currentStatus = STATUS_OPTIONS.find(s => s.value === lead.status) || STATUS_OPTIONS[0];

  return (
    <Layout>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/leads" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
                {lead.name}
              </h1>
              <div className="flex items-center gap-2">
                <Badge className={`${currentStatus.color} border-none text-[10px] uppercase font-bold h-5`}>
                  {currentStatus.label}
                </Badge>
                {lead.isAtRisk && <Badge variant="destructive" className="text-[10px] uppercase font-bold h-5 animate-pulse">Zagrożony</Badge>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl"><MoreVertical className="w-4 h-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4 mr-2" /> Edytuj dane</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteLead} className="text-rose-600"><Trash2 className="w-4 h-4 mr-2" /> Usuń leada</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20" onClick={() => handleUpdateStatus('won')} disabled={lead.status === 'won'}>
              <CheckCircle2 className="w-4 h-4" /> Wygrany
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-emerald-50 p-3 rounded-2xl"><DollarSign className="w-6 h-6 text-emerald-600" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wartość</p>
                    <p className="text-lg font-bold text-slate-900">{(lead.dealValue || 0).toLocaleString()} PLN</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-2xl"><Target className="w-6 h-6 text-blue-600" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Źródło</p>
                    <p className="text-lg font-bold text-slate-900 capitalize">{lead.source}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-amber-50 p-3 rounded-2xl"><Calendar className="w-6 h-6 text-amber-600" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Następny krok</p>
                    <p className={`text-lg font-bold ${lead.nextActionAt && isPast(parseISO(lead.nextActionAt)) ? 'text-rose-600' : 'text-slate-900'}`}>
                      {lead.nextActionAt ? format(parseISO(lead.nextActionAt), 'd MMM', { locale: pl }) : 'Brak'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none h-12 p-0 gap-8">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 font-bold">Przegląd</TabsTrigger>
                <TabsTrigger value="realization" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 font-bold">Realizacja</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-6 space-y-8">
                {/* Contact Info */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Informacje kontaktowe</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4" /></Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl"><Mail className="w-4 h-4 text-slate-400" /></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-mail</p>
                          <p className="text-sm font-medium">{lead.email || 'Brak'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl"><Phone className="w-4 h-4 text-slate-400" /></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telefon</p>
                          <p className="text-sm font-medium">{lead.phone || 'Brak'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl"><FileText className="w-4 h-4 text-slate-400" /></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Firma</p>
                          <p className="text-sm font-medium">{lead.company || 'Brak'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl"><Clock className="w-4 h-4 text-slate-400" /></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ostatni kontakt</p>
                          <p className="text-sm font-medium">{lead.updatedAt ? format(lead.updatedAt.toDate(), 'd MMMM HH:mm', { locale: pl }) : '-'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Planning */}
                <Card className="border-none shadow-sm">
                  <CardHeader><CardTitle className="text-lg">Planowanie ruchu</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Następny krok</Label>
                        <Input 
                          placeholder="np. Telefon z ofertą" 
                          value={lead.nextStep || ''} 
                          onChange={(e) => updateDoc(doc(db, 'leads', leadId!), { nextStep: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Termin ruchu</Label>
                        <Input 
                          type="date" 
                          value={lead.nextActionAt || ''} 
                          onChange={(e) => updateDoc(doc(db, 'leads', leadId!), { nextActionAt: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100">
                      <input 
                        type="checkbox" 
                        checked={lead.isAtRisk} 
                        onChange={(e) => updateDoc(doc(db, 'leads', leadId!), { isAtRisk: e.target.checked })}
                        className="w-4 h-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                      />
                      <Label className="text-rose-700 font-bold">Oznacz jako zagrożony (wymaga natychmiastowej uwagi)</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="realization" className="pt-6">
                {associatedCase ? (
                  <Card className="border-none shadow-sm border-l-4 border-l-emerald-500">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-50 p-3 rounded-2xl"><Briefcase className="w-6 h-6 text-emerald-600" /></div>
                        <div>
                          <h4 className="font-bold text-slate-900">Sprawa aktywna</h4>
                          <p className="text-sm text-slate-500">Realizacja projektu jest w toku.</p>
                        </div>
                      </div>
                      <Button className="rounded-xl gap-2" asChild>
                        <Link to={`/case/${associatedCase.id}`}>
                          Przejdź do sprawy <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : lead.status === 'won' ? (
                  <Card className="border-none shadow-sm">
                    <CardHeader><CardTitle className="text-lg">Uruchomienie realizacji</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-emerald-900">Lead wygrany!</p>
                          <p className="text-xs text-emerald-700">Możesz teraz utworzyć sprawę operacyjną i zacząć zbierać materiały.</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Szablon checklisty</Label>
                          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Wybierz szablon..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Brak szablonu</SelectItem>
                              {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20" onClick={handleCreateCase}>
                          <Plus className="w-5 h-5 mr-2" /> Utwórz sprawę i wyślij portal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                    <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">Realizacja nieuruchomiona</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">Zmień status na "Wygrany", aby odpalić moduł kompletności.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Timeline */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5 text-slate-400" /> Historia</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <Textarea 
                    placeholder="Dodaj notatkę z rozmowy..." 
                    className="rounded-xl bg-slate-50 border-none resize-none min-h-[100px]"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                  <Button type="submit" className="w-full rounded-xl" disabled={!note.trim()}>Dodaj notatkę</Button>
                </form>

                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                    {activities.map((activity) => (
                      <div key={activity.id} className="relative pl-8">
                        <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                          activity.eventType === 'status_changed' ? 'bg-indigo-500' :
                          activity.eventType === 'note_added' ? 'bg-amber-500' :
                          activity.eventType === 'case_created' ? 'bg-emerald-500' :
                          'bg-slate-400'
                        }`} />
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                          <p className="text-sm font-bold text-slate-900">
                            {activity.eventType === 'status_changed' ? `Status: ${STATUS_OPTIONS.find(s => s.value === activity.payload.status)?.label}` :
                             activity.eventType === 'note_added' ? 'Notatka' :
                             activity.eventType === 'case_created' ? 'Uruchomiono realizację' :
                             'Aktywność'}
                          </p>
                          {activity.payload?.content && <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{activity.payload.content}</p>}
                          <p className="text-[10px] text-slate-400 mt-2 font-medium">
                            {activity.createdAt ? format(activity.createdAt.toDate(), 'd MMM, HH:mm', { locale: pl }) : 'Teraz'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edytuj leada</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nazwa</Label>
              <Input value={editLead?.name || ''} onChange={e => setEditLead({...editLead, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Firma</Label>
              <Input value={editLead?.company || ''} onChange={e => setEditLead({...editLead, company: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editLead?.email || ''} onChange={e => setEditLead({...editLead, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input value={editLead?.phone || ''} onChange={e => setEditLead({...editLead, phone: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Wartość</Label>
                <Input type="number" value={editLead?.dealValue || ''} onChange={e => setEditLead({...editLead, dealValue: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Źródło</Label>
                <Select value={editLead?.source} onValueChange={v => setEditLead({...editLead, source: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SOURCE_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Anuluj</Button>
            <Button onClick={handleUpdateLead}>Zapisz zmiany</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
