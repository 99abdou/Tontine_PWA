import React from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  CheckCircle2,
  Calendar,
  CreditCard,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard, Avatar } from '../components/ui/StatCard';
import { mockTontines, mockUsers } from '../services/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ParticipantHomePage: React.FC = () => {
  const participant = mockUsers[1]; // Aïssatou Diallo
  const tontine = mockTontines[0];

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950">
              <Sparkles className="w-3.5 h-3.5" />
              Espace Participante
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Bonjour, Aïssatou Diallo 👋
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
              Félicitations, vous êtes à jour dans vos cotisations ! Vous avez déjà reçu votre cagnotte de <strong>350.000 FCFA</strong> au Tour #1.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/reports">
              <Button
                variant="secondary"
                size="md"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                leftIcon={<FileText className="w-4 h-4" />}
              >
                Mon relevé personnel
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Mes Tontines"
          value="1 Active"
          subtitle="Tontine Diamono"
          icon={Coins}
          color="emerald"
        />
        <StatCard
          title="Total Cotisé"
          value="150.000 F"
          subtitle="Périodes 1, 2 et 3"
          icon={CreditCard}
          color="sky"
        />
        <StatCard
          title="Cagnotte Reçue"
          value="350.000 F"
          subtitle="Tour #1 (Reçu le 10 Mars)"
          icon={CheckCircle2}
          color="amber"
        />
        <StatCard
          title="Statut Paiement"
          value="À jour"
          subtitle="0 FCFA de retard"
          icon={Sparkles}
          color="indigo"
        />
      </div>

      {/* Main Content: My Active Tontine Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader
              title="Ma Tontine : Tontine Diamono"
              subtitle="Organisée par Fatou Sow (77 654 32 10)"
              action={<Badge variant="success" dot>Active</Badge>}
            />
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 font-bold uppercase text-[10px]">Ma cotisation</p>
                  <p className="text-base font-extrabold text-gray-900 mt-0.5">50.000 FCFA</p>
                  <p className="text-gray-500 text-[10px]">Mensuel (Le 5 du mois)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 font-bold uppercase text-[10px]">Mon Tour</p>
                  <p className="text-base font-extrabold text-emerald-700 mt-0.5">Tour #1</p>
                  <p className="text-gray-500 text-[10px]">Déjà versé avec succès</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 font-bold uppercase text-[10px]">Prochaine Échéance</p>
                  <p className="text-base font-extrabold text-primary-900 mt-0.5">05 Juin 2024</p>
                  <p className="text-gray-500 text-[10px]">Période 4</p>
                </div>
              </div>

              {/* Mes paiements récents */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
                  Mes reçus de cotisation
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">Période 3 (Mai 2024)</p>
                      <p className="text-gray-400 text-[11px]">Payé le 02/05/2024 via Wave</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700">50.000 FCFA</p>
                      <Badge variant="success">✓ Reçu validé</Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">Période 2 (Avril 2024)</p>
                      <p className="text-gray-400 text-[11px]">Payé le 03/04/2024 via Wave</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700">50.000 FCFA</p>
                      <Badge variant="success">✓ Reçu validé</Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">Période 1 (Mars 2024)</p>
                      <p className="text-gray-400 text-[11px]">Payé le 02/03/2024 via Orange Money</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700">50.000 FCFA</p>
                      <Badge variant="success">✓ Reçu validé</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prochain bénéficiaire du groupe */}
        <div className="lg:col-span-4">
          <Card className="h-full bg-slate-50 border border-gray-100 p-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200/60 pb-3">
              Tour en cours dans mon groupe
            </h4>
            <div className="text-center p-4 rounded-2xl bg-white border border-gray-100 space-y-2">
              <span className="text-2xl">🎉</span>
              <h5 className="font-bold text-sm text-gray-900">Aminata Ndiaye</h5>
              <p className="text-xs text-gray-500">Bénéficiaire du 10 Mai 2024 (Tour #3)</p>
              <p className="text-base font-black text-emerald-700 mt-2">350.000 FCFA</p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              La transparence est essentielle : vous pouvez suivre le bon déroulement de chaque tour en temps réel.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
