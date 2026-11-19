import React from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  Users,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  MessageCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { StatCard, Avatar } from '../components/ui/StatCard';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  mockDashboardStats,
  mockTontines,
  mockTransactions,
  mockPayouts,
  mockChartData,
  mockMemberships,
} from '../services/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getWhatsAppUrl, generateWhatsAppMessage } from '../utils/whatsapp';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const activeTontine = mockTontines[0];
  const nextPayout = mockPayouts.find((p) => p.status === 'collecte_en_cours') || mockPayouts[2];

  // Overdue members list
  const overdueMembers = [
    {
      name: 'Khady Diop',
      phone: '77 456 78 90',
      tontine: 'Tontine Diamono',
      amount: 50000,
      daysLate: 5,
      dueDate: '2024-05-05',
    },
    {
      name: 'Ndèye Sarr',
      phone: '70 567 89 01',
      tontine: 'Tontine Diamono',
      amount: 50000,
      daysLate: 5,
      dueDate: '2024-05-05',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-950/20">        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-primary-950">
              <Sparkles className="w-3.5 h-3.5" />
              Tableau de bord Organisatrice
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text ">
              Dalal ak jàmm, Fatou Sow 👋
            </h1>
            <p className="text-xs sm:text-sm text-primary-200 max-w-xl">
              Vos tontines se portent bien. La collecte de Mai pour la <strong>Tontine Diamono</strong> est à 78%.
              Pensez à relancer les 2 participantes en retard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/tontines/create">
              <Button
                variant="primary"
                size="md"
                className="bg-amber-400 hover:bg-amber-300 text-primary-950 font-bold border-0"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Créer une tontine
              </Button>
            </Link>
            <Link to="/contributions">
              <Button
                variant="secondary"
                size="md"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                leftIcon={<CreditCard className="w-4 h-4" />}
              >
                Encaisser
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tontines Actives"
          value={mockDashboardStats.active_tontines}
          subtitle="2 rotatives, 1 épargne"
          icon={Coins}
          color="emerald"
        />
        <StatCard
          title="Total Participantes"
          value={mockDashboardStats.total_participants}
          subtitle="100% enregistrées"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Encaissé"
          value={formatCurrency(mockDashboardStats.total_collected)}
          subtitle="Taux global : 78%"
          icon={CreditCard}
          color="sky"
        />
        <StatCard
          title="Cotisations en retard"
          value={mockDashboardStats.overdue_count}
          subtitle="Total restant : 100.000 F"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Critical Overdue Banner (if any) */}
      {overdueMembers.length > 0 && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-950">
                {overdueMembers.length} participantes ont dépassé la date limite du 5 Mai
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Envoyez un message WhatsApp personnalisé en un clic pour régulariser avant le versement.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {overdueMembers.map((m, idx) => {
              const msg = generateWhatsAppMessage({
                phone: m.phone,
                participantName: m.name,
                tontineName: m.tontine,
                amount: m.amount,
                dueDate: m.dueDate,
                type: 'retard',
              });
              const url = getWhatsAppUrl(m.phone, msg);

              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Relancer {m.name.split(' ')[0]}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Chart + Next Payout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Progression Chart */}
        <div className="lg:col-span-8 min-w-0">
          <Card className="h-full flex flex-col justify-between overflow-hidden">
            <CardHeader
              title="Progression des cotisations"
              subtitle="Montants encaissés vs prévus (en FCFA)"
              action={
                <span className="text-xs font-bold text-primary-800 bg-primary-50 px-2.5 py-1 rounded-full">
                  Année 2024
                </span>
              }
            />
            <CardContent className="pt-4 flex-1 min-w-0 overflow-hidden">
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) => `${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val: number) => [formatCurrency(val), '']}
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="expected"
                      name="Attendu"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorExpected)"
                    />
                    <Area
                      type="monotone"
                      dataKey="collected"
                      name="Encaissé"
                      stroke="#15803d"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCollected)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prochain Versement & Beneficiary Spotlight */}
        <div className="lg:col-span-4">
          <Card className="h-full bg-gradient-to-br from-white to-amber-50/40 border-amber-200/50">
            <CardHeader
              title="Prochain Versement"
              subtitle="Tour en cours"
              action={<Badge variant="warning" dot>Collecte en cours</Badge>}
            />
            <CardContent className="space-y-4">
              <div className="text-center p-4 rounded-2xl bg-white border border-amber-100 shadow-xs space-y-3">
                <Avatar
                  name={`${nextPayout.beneficiary.participant.first_name} ${nextPayout.beneficiary.participant.last_name}`}
                  src={nextPayout.beneficiary.participant.avatar}
                  size="xl"
                  className="mx-auto"
                />
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {nextPayout.beneficiary.participant.first_name} {nextPayout.beneficiary.participant.last_name}
                  </h3>
                  <p className="text-xs text-gray-500">{nextPayout.beneficiary.participant.phone}</p>
                </div>

                <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/60">
                  <p className="text-[10px] text-amber-900 uppercase font-bold tracking-wider">Cagnotte Théorique</p>
                  <p className="text-xl font-black text-amber-950 mt-0.5">
                    {formatCurrency(nextPayout.expected_amount)}
                  </p>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Déjà collecté : <strong>{formatCurrency(nextPayout.actual_amount)}</strong> (2 retards restants)
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Tontine</span>
                  <span className="font-semibold text-gray-800">{activeTontine.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Date prévue</span>
                  <span className="font-semibold text-gray-800">{formatDate(nextPayout.planned_date)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">Moyen favori</span>
                  <span className="font-semibold text-primary-800">Wave / Orange Money</span>
                </div>
              </div>

              <Link to="/payouts" className="block w-full">
                <Button variant="primary" size="md" className="w-full" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  Confirmer le versement
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Grid: Tontines Overview + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vos Tontines Actives */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader
              title="Mes Groupes de Tontine"
              subtitle="Statut et progression"
              action={
                <Link to="/tontines" className="text-xs font-bold text-primary-800 hover:underline">
                  Voir tout
                </Link>
              }
            />
            <CardContent className="divide-y divide-gray-100 p-0">
              {mockTontines.map((tontine) => (
                <Link
                  key={tontine.id}
                  to={`/tontines/${tontine.id}`}
                  className="p-5 flex items-center justify-between hover:bg-gray-50/80 transition-colors block"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{tontine.name}</span>
                      <Badge variant={tontine.status === 'active' ? 'success' : 'gray'}>
                        {tontine.status === 'active' ? 'Active' : 'Brouillon'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {tontine.member_count} participantes • {formatCurrency(tontine.contribution_amount)} / {tontine.frequency}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-32 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary-700 h-full"
                          style={{
                            width: `${Math.round(((tontine.total_collected || 0) / (tontine.total_expected || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {Math.round(((tontine.total_collected || 0) / (tontine.total_expected || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Dernières Transactions */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader
              title="Dernières Transactions"
              subtitle="Paiements Wave, OM et versements"
              action={
                <Link to="/transactions" className="text-xs font-bold text-primary-800 hover:underline">
                  Journal complet
                </Link>
              }
            />
            <CardContent className="divide-y divide-gray-100 p-0">
              {mockTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        tx.type === 'payment'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {tx.type === 'payment' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{tx.member_name}</p>
                      <p className="text-[11px] text-gray-500">
                        {tx.tontine_name} • {tx.method?.toUpperCase()} • {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-bold ${
                        tx.type === 'payment' ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {tx.type === 'payment' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </p>
                    <Badge variant={tx.status === 'Confirmé' ? 'success' : tx.status === 'Versé' ? 'info' : 'warning'}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
