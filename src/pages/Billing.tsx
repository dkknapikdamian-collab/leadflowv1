import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useWorkspace } from '../hooks/useWorkspace';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  CheckCircle2, 
  CreditCard, 
  Zap, 
  Shield, 
  Clock, 
  AlertTriangle,
  Check,
  Loader2
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'solo',
    name: 'Forteca Solo',
    price: '99',
    description: 'Dla freelancerów i małych firm.',
    features: [
      'Nielimitowane leady',
      'Nielimitowane sprawy',
      'Portal klienta',
      'Automatyczne checklisty',
      'Wsparcie e-mail'
    ]
  },
  {
    id: 'pro',
    name: 'Forteca Pro',
    price: '249',
    description: 'Dla zespołów i agencji.',
    features: [
      'Wszystko w Solo',
      'Współpraca zespołowa',
      'Zaawansowane raporty',
      'Własna domena portalu',
      'Priorytetowe wsparcie'
    ],
    popular: true
  }
];

export default function Billing() {
  const { workspace, loading } = useWorkspace();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async (planId: string) => {
    if (!workspace) return;
    setUpgrading(true);
    try {
      await updateDoc(doc(db, 'workspaces', workspace.id), {
        subscriptionStatus: 'paid_active',
        planId,
        updatedAt: serverTimestamp()
      });
      toast.success('Subskrypcja aktywowana! (Symulacja)');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    } finally {
      setUpgrading(false);
    }
  };

  if (loading || !workspace) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const trialDaysLeft = workspace.trialEndsAt ? differenceInDays(parseISO(workspace.trialEndsAt), new Date()) : 0;
  const isTrial = workspace.subscriptionStatus === 'trial_active';

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Subskrypcja i Rozliczenia</h1>
          <p className="text-slate-500">Zarządzaj swoim planem i dostępem do Fortecy.</p>
        </header>

        {/* Current Status */}
        <Card className={`border-none shadow-sm ${isTrial ? 'bg-indigo-50 border-indigo-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isTrial ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {isTrial ? <Clock className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isTrial ? 'Jesteś w okresie próbnym' : 'Twoja subskrypcja jest aktywna'}
                </h2>
                <p className="text-slate-600">
                  {isTrial 
                    ? `Pozostało Ci ${trialDaysLeft} dni darmowego dostępu.` 
                    : `Twój plan: ${PLANS.find(p => p.id === workspace.planId)?.name || 'Forteca Solo'}`}
                </p>
              </div>
            </div>
            {isTrial && (
              <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-700 px-4 py-1 rounded-full font-bold">
                TRIAL: {trialDaysLeft} DNI
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLANS.map(plan => (
            <Card key={plan.id} className={`border-none shadow-lg relative overflow-hidden ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Najpopularniejszy
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{plan.price} PLN</span>
                  <span className="text-slate-500">/ mies.</span>
                </div>
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full rounded-xl h-12 font-bold text-base" 
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={workspace.planId === plan.id || upgrading}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {workspace.planId === plan.id ? 'Twój obecny plan' : 'Wybierz ten plan'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Security Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-6 space-y-2">
            <Shield className="w-8 h-8 text-slate-400" />
            <h4 className="font-bold text-slate-900">Bezpieczne płatności</h4>
            <p className="text-xs text-slate-500">Twoje dane są szyfrowane i bezpieczne dzięki Stripe.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 space-y-2">
            <Zap className="w-8 h-8 text-slate-400" />
            <h4 className="font-bold text-slate-900">Błyskawiczna aktywacja</h4>
            <p className="text-xs text-slate-500">Dostęp do wszystkich funkcji otrzymasz natychmiast po płatności.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 space-y-2">
            <CreditCard className="w-8 h-8 text-slate-400" />
            <h4 className="font-bold text-slate-900">Faktury VAT</h4>
            <p className="text-xs text-slate-500">Automatycznie generujemy faktury VAT za każdą płatność.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
