import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Briefcase, Loader2, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit, getDocs } from 'firebase/firestore';
import {
  fetchActivitiesFromSupabase,
  fetchCasesFromSupabase,
  fetchLeadsFromSupabase,
  isSupabaseConfigured,
} from '../lib/supabase-fallback';
import { toast } from 'sonner';

function formatActivityTime(value: any) {
  if (!value) return 'Brak daty';
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'Brak daty' : parsed.toLocaleString();
  }
  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleString();
  }
  return 'Brak daty';
}

function normalizeText(value: any) {
  return typeof value === 'string' ? value.trim() : '';
}

function getLeadDisplayName(record: any) {
  return (
    normalizeText(record?.clientName) ||
    normalizeText(record?.name) ||
    normalizeText(record?.title) ||
    normalizeText(record?.email) ||
    ''
  );
}

function getCaseDisplayName(record: any) {
  return (
    normalizeText(record?.title) ||
    normalizeText(record?.clientName) ||
    normalizeText(record?.type) ||
    ''
  );
}

function buildLeadLookup(items: any[]) {
  const lookup = new Map<string, string>();
  for (const item of items || []) {
    const id = normalizeText(item?.id);
    const label = getLeadDisplayName(item);
    if (id && label) lookup.set(id, label);
  }
  return lookup;
}

function buildCaseLookup(items: any[]) {
  const lookup = new Map<string, string>();
  for (const item of items || []) {
    const id = normalizeText(item?.id);
    const label = getCaseDisplayName(item);
    if (id && label) lookup.set(id, label);
  }
  return lookup;
}

function getActorLabel(activity: any) {
  return activity.actorType === 'client' ? 'Klient' : 'Operator';
}

function getActivityActionLabel(activity: any) {
  const title = normalizeText(activity?.payload?.title);
  const status = normalizeText(activity?.payload?.status);

  switch (activity?.eventType) {
    case 'status_changed':
      return status ? `zmienił status na ${status}` : 'zmienił status';
    case 'case_created':
      return title ? `uruchomił realizację: ${title}` : 'uruchomił realizację';
    case 'item_added':
      return title ? `dodał element: ${title}` : 'dodał element';
    case 'file_uploaded':
      return title ? `wgrał plik do: ${title}` : 'wgrał plik';
    case 'decision_made':
      return title ? `podjął decyzję w: ${title}` : 'podjął decyzję';
    case 'portal_token_created':
      return title ? `wygenerował link portalu dla: ${title}` : 'wygenerował link portalu';
    case 'case_reminder_requested':
      return 'wysłał przypomnienie i utworzył follow-up';
    case 'reminder_scheduled':
      return title ? `zaplanował przypomnienie: ${title}` : 'zaplanował przypomnienie';
    case 'task_created':
      return title ? `dodał zadanie: ${title}` : 'dodał zadanie';
    case 'task_updated':
      return title ? `zaktualizował zadanie: ${title}` : 'zaktualizował zadanie';
    case 'task_completed':
      return title ? `oznaczył jako zrobione: ${title}` : 'oznaczył zadanie jako zrobione';
    case 'event_created':
      return title ? `dodał wydarzenie: ${title}` : 'dodał wydarzenie';
    case 'event_updated':
      return title ? `zaktualizował wydarzenie: ${title}` : 'zaktualizował wydarzenie';
    case 'event_deleted':
      return title ? `usunął wydarzenie: ${title}` : 'usunął wydarzenie';
    case 'note_added':
      return title ? `dodał notatkę: ${title}` : 'dodał notatkę';
    default:
      return title ? `wykonał akcję: ${title}` : 'wykonał akcję';
  }
}

function getLeadContextLabel(activity: any, leadLookup: Map<string, string>) {
  const leadId = normalizeText(activity?.leadId);
  if (!leadId) return '';
  return leadLookup.get(leadId) || normalizeText(activity?.payload?.leadName) || normalizeText(activity?.payload?.title) || 'Powiązany lead';
}

function getCaseContextLabel(activity: any, caseLookup: Map<string, string>) {
  const caseId = normalizeText(activity?.caseId);
  if (!caseId) return '';
  return caseLookup.get(caseId) || normalizeText(activity?.payload?.caseTitle) || normalizeText(activity?.payload?.title) || 'Powiązana sprawa';
}

export default function Activity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadLookup, setLeadLookup] = useState<Map<string, string>>(new Map());
  const [caseLookup, setCaseLookup] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (isSupabaseConfigured()) {
      let cancelled = false;
      setLoading(true);

      Promise.all([
        fetchActivitiesFromSupabase({ limit: 50 }),
        fetchLeadsFromSupabase(),
        fetchCasesFromSupabase(),
      ])
        .then(([activityRows, leadRows, caseRows]) => {
          if (cancelled) return;
          setActivities(activityRows);
          setLeadLookup(buildLeadLookup(leadRows));
          setCaseLookup(buildCaseLookup(caseRows));
          setLoading(false);
        })
        .catch((error: any) => {
          if (cancelled) return;
          toast.error(`Błąd aktywności API: ${error.message}`);
          setActivities([]);
          setLeadLookup(new Map());
          setCaseLookup(new Map());
          setLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }

    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'activities'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const loadReferenceData = async () => {
      try {
        const [leadSnapshot, caseSnapshot] = await Promise.all([
          getDocs(query(collection(db, 'leads'), where('ownerId', '==', auth.currentUser!.uid))),
          getDocs(query(collection(db, 'cases'), where('ownerId', '==', auth.currentUser!.uid))),
        ]);

        setLeadLookup(buildLeadLookup(leadSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))));
        setCaseLookup(buildCaseLookup(caseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))));
      } catch (error) {
        console.warn('ACTIVITY_REFERENCE_LOAD_FAILED', error);
      }
    };

    void loadReferenceData();

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Aktywność</h1>
          <p className="text-slate-500">Historia wszystkich zdarzeń w Twoim systemie.</p>
        </header>

        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                </div>
              ) : activities.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  Brak zarejestrowanej aktywności.
                </div>
              ) : (
                activities.map((activity) => {
                  const leadLabel = getLeadContextLabel(activity, leadLookup);
                  const caseLabel = getCaseContextLabel(activity, caseLookup);
                  const actorLabel = getActorLabel(activity);
                  const actionLabel = getActivityActionLabel(activity);

                  return (
                    <div key={activity.id} className="p-6 flex gap-4 items-start hover:bg-slate-50 transition-colors">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        activity.leadId ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {activity.leadId ? <Target className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {actorLabel} {actionLabel}
                          </p>
                          <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                            {formatActivityTime(activity.createdAt)}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {leadLabel ? (
                            <p className="text-xs text-slate-400">
                              Lead: {leadLabel}
                            </p>
                          ) : null}
                          {caseLabel ? (
                            <p className="text-xs text-slate-400">
                              Sprawa: {caseLabel}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
