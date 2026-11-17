import React from 'react';
import {
  ShieldCheck,
  Users,
  Coins,
  CreditCard,
  Lock,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { mockUsers, mockTontines } from '../services/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Supervision & Administration</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Tableau de bord de l'administrateur général de la plateforme TONTINE PRO
          </p>
        </div>
        <Badge variant="primary">Mode Administrateur</Badge>
      </div>

      {/* Global Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Organisatrices Inscrites"
          value="48"
          subtitle="+12 ce mois-ci"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Tontines Totales"
          value="124"
          subtitle="92% de taux de succès"
          icon={Coins}
          color="sky"
        />
        <StatCard
          title="Volume Transigé"
          value="42.500.000 F"
          subtitle="En Francs CFA"
          icon={CreditCard}
          color="amber"
        />
        <StatCard
          title="Sécurité & Logs"
          value="100% Intègre"
          subtitle="Aucune alerte suspecte"
          icon={ShieldCheck}
          color="indigo"
        />
      </div>

      {/* Management Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card>
            <CardHeader
              title="Organisatrices Actives"
              subtitle="Gestion des comptes et abonnements SaaS"
            />
            <CardContent className="divide-y divide-gray-100 p-0">
              {[
                { name: 'Fatou Sow', phone: '77 654 32 10', tontines: 3, plan: 'Standard', status: 'Actif' },
                { name: 'Mariama Diallo', phone: '78 123 45 67', tontines: 2, plan: 'Standard', status: 'Actif' },
                { name: 'Khady Ndiaye', phone: '76 987 65 43', tontines: 1, plan: 'Gratuit', status: 'Actif' },
                { name: 'Aïda Ba', phone: '70 345 67 89', tontines: 4, plan: 'Premium', status: 'Actif' },
              ].map((org, i) => (
                <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-gray-50/50">
                  <div>
                    <p className="font-bold text-gray-900">{org.name}</p>
                    <p className="text-gray-500">{org.phone} • {org.tontines} tontines</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded-full">
                      {org.plan}
                    </span>
                    <Badge variant="success">{org.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card>
            <CardHeader
              title="Journal de Sécurité (Audit Logs)"
              subtitle="Conforme au cahier des charges"
            />
            <CardContent className="space-y-3 text-xs p-4">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-900">Enregistrement Paiement Wave</p>
                <p className="text-gray-500 text-[11px]">Par Fatou Sow pour Aïssatou Diallo (50.000 F)</p>
                <p className="text-gray-400 text-[10px]">17 Mai 2024 à 14:22</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-900">Modification Ordre Bénéficiaire</p>
                <p className="text-gray-500 text-[11px]">Motif : Accord préalable du groupe</p>
                <p className="text-gray-400 text-[10px]">16 Mai 2024 à 18:05</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
