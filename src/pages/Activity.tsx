import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { History, User, Briefcase, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

export default function Activity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'activities'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : activities.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  Brak zarejestrowanej aktywności.
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="p-6 flex gap-4 items-start hover:bg-slate-50 transition-colors">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      activity.leadId ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {activity.leadId ? <Target className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-900">
                          {activity.actorType === 'operator' ? 'Operator' : 'Klient'}
                          <span className="font-normal text-slate-500 ml-1">
                            {activity.eventType === 'status_changed' ? `zmienił status na ${activity.payload.status}` :
                             activity.eventType === 'case_created' ? `uruchomił realizację: ${activity.payload.title}` :
                             activity.eventType === 'item_added' ? `dodał element: ${activity.payload.title}` :
                             activity.eventType === 'file_uploaded' ? `wgrał plik do: ${activity.payload.title}` :
                             'wykonał akcję'}
                          </span>
                        </p>
                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                          {activity.createdAt?.toDate().toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {activity.leadId ? 'Lead' : 'Sprawa'}: {activity.leadId || activity.caseId}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
