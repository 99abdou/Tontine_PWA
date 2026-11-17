import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Coins,
  Users,
  Calendar,
  CreditCard,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MessageCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
  Send,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Avatar } from '../components/ui/StatCard';
import {
  mockTontines,
  mockMemberships,
  mockMatrixCells,
  mockPayouts,
} from '../services/mockData';
import { formatCurrency, formatDate, contributionStatusLabel } from '../utils/formatters';
import { getWhatsAppUrl, generateWhatsAppMessage } from '../utils/whatsapp';
import { toast } from '../stores/toastStore';

export const TontineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tontine = mockTontines.find((t) => t.id === id) || mockTontines[0];
  const [activeTab, setActiveTab] = useState('matrix');

  // Payment Recording Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: 50000,
    payment_method: 'wave',
    reference: '',
    received_at: new Date().toISOString().split('T')[0],
    comment: '',
  });

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenPayment = (cell: any) => {
    setSelectedCell(cell);
    setPaymentForm({
      amount: cell.expected_amount - cell.paid_amount,
      payment_method: 'wave',
      reference: 'WAVE-TX-' + Math.floor(100000 + Math.random() * 900000),
      received_at: new Date().toISOString().split('T')[0],
      comment: '',
    });
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaymentModalOpen(false);
    toast.success(
      'Paiement validé avec succès !',
      `Reçu de ${formatCurrency(paymentForm.amount)} enregistré pour ${selectedCell?.member_name} (via ${paymentForm.payment_method.toUpperCase()})`
    );
  };

  const tabs = [
    { id: 'matrix', label: 'Matrice des cotisations', badge: 'Période 3' },
    { id: 'members', label: 'Participantes', badge: mockMemberships.length },
    { id: 'rounds', label: 'Calendrier des tours', badge: mockPayouts.length },
    { id: 'overview', label: 'Vue d’ensemble' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/tontines" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Toutes les tontines
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={tontine.status === 'active' ? 'success' : 'gray'} dot>
            {tontine.status === 'active' ? 'Active' : 'Brouillon'}
          </Badge>
        </div>
      </div>

      {/* Header Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm shadow-gray-200/50 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-800 bg-primary-50 px-2.5 py-1 rounded-md">
              Tontine {tontine.tontine_type}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              {tontine.name}
            </h1>
            <p className="text-xs text-gray-500 max-w-2xl">{tontine.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/reports">
              <Button variant="outline" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
                Télécharger Bilan
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenPayment(mockMatrixCells[11])}
              leftIcon={<CreditCard className="w-4 h-4" />}
            >
              Encaisser un paiement
            </Button>
          </div>
        </div>

        {/* Highlight Numbers Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100 text-xs">
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Cotisation</p>
            <p className="text-base font-extrabold text-gray-900 mt-0.5">
              {formatCurrency(tontine.contribution_amount)}
            </p>
            <p className="text-[10px] text-gray-500 capitalize">{tontine.frequency}</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Cagnotte par tour</p>
            <p className="text-base font-extrabold text-primary-800 mt-0.5">
              {formatCurrency(tontine.contribution_amount * tontine.participant_limit)}
            </p>
            <p className="text-[10px] text-gray-500">{tontine.participant_limit} participantes</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Collecté à ce jour</p>
            <p className="text-base font-extrabold text-emerald-700 mt-0.5">
              {formatCurrency(tontine.total_collected || 0)}
            </p>
            <p className="text-[10px] text-gray-500">Période {tontine.current_period} sur {tontine.total_periods}</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Prochain Versement</p>
            <p className="text-base font-extrabold text-amber-700 mt-0.5">
              10 Mai 2024
            </p>
            <p className="text-[10px] text-gray-500">Bénéficiaire : Aminata Ndiaye</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: MATRICE DES COTISATIONS (Coeur du projet) */}
      {activeTab === 'matrix' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-gray-900">Grille de suivi des cotisations</h3>
              <p className="text-xs text-gray-500">
                Cliquez sur une case pour enregistrer un paiement ou consulter le reçu
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Payé
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Partiel
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> En retard
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300" /> À venir
              </span>
            </div>
          </div>

          <Card className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80">
                  <th className="py-3.5 px-4 font-bold text-gray-700 uppercase tracking-wider text-[11px] sticky left-0 bg-gray-50 z-10">
                    Participante
                  </th>
                  {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                    <th key={period} className="py-3.5 px-4 font-bold text-gray-700 text-center whitespace-nowrap">
                      Période {period}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        {period === 1 ? 'Mars' : period === 2 ? 'Avril' : period === 3 ? 'Mai' : `Mois ${period}`}
                      </span>
                    </th>
                  ))}
                  <th className="py-3.5 px-4 font-bold text-gray-700 text-right uppercase tracking-wider text-[11px]">
                    Total Payé
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {mockMemberships.map((member) => {
                  const memberName = `${member.participant.first_name} ${member.participant.last_name}`;
                  const cellsForMember = mockMatrixCells.filter((c) => c.member_id === member.id);

                  const totalPaid = cellsForMember.reduce((acc, c) => acc + c.paid_amount, 0);

                  return (
                    <tr key={member.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center gap-2.5">
                        <Avatar name={memberName} src={member.participant.avatar} size="sm" />
                        <div>
                          <p className="leading-tight">{memberName}</p>
                          <p className="text-[10px] text-gray-400 font-normal">{member.participant.phone}</p>
                        </div>
                      </td>

                      {[1, 2, 3, 4, 5, 6, 7].map((pNum) => {
                        const cell = cellsForMember.find((c) => c.period_number === pNum);
                        if (!cell) {
                          return (
                            <td key={pNum} className="py-3.5 px-3 text-center text-gray-300">
                              -
                            </td>
                          );
                        }

                        let badgeStyle = 'bg-gray-100 text-gray-500 border-gray-200';
                        if (cell.status === 'paye') badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
                        else if (cell.status === 'partiellement_paye') badgeStyle = 'bg-amber-50 text-amber-900 border-amber-200 font-bold';
                        else if (cell.status === 'en_retard') badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200 font-bold';

                        return (
                          <td key={pNum} className="py-3 px-2 text-center">
                            <button
                              onClick={() => handleOpenPayment(cell)}
                              className={`w-full py-1.5 px-2 rounded-xl text-xs border transition-all hover:scale-105 ${badgeStyle}`}
                            >
                              <span className="block leading-none">
                                {cell.status === 'paye'
                                  ? '50.000 F'
                                  : cell.status === 'partiellement_paye'
                                  ? `${formatCurrency(cell.paid_amount)}`
                                  : cell.status === 'en_retard'
                                  ? 'Retard'
                                  : '0 F'}
                              </span>
                              <span className="text-[9px] opacity-75 capitalize block mt-0.5">
                                {cell.status === 'paye' ? '✓ Reçu' : cell.status === 'en_retard' ? 'Non payé' : 'À venir'}
                              </span>
                            </button>
                          </td>
                        );
                      })}

                      <td className="py-3.5 px-4 text-right font-extrabold text-primary-900">
                        {formatCurrency(totalPaid)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* TAB 2: PARTICIPANTES */}
      {activeTab === 'members' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Membres du groupe ({mockMemberships.length})</h3>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Inviter une participante
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockMemberships.map((m) => {
              const name = `${m.participant.first_name} ${m.participant.last_name}`;
              const whatsappMsg = generateWhatsAppMessage({
                phone: m.participant.phone,
                participantName: name,
                tontineName: tontine.name,
                amount: tontine.contribution_amount,
                type: 'rappel',
              });
              const whatsappUrl = getWhatsAppUrl(m.participant.phone, whatsappMsg);

              return (
                <Card key={m.id} className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={name} src={m.participant.avatar} size="lg" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{name}</span>
                        <span className="text-[10px] bg-primary-100 text-primary-800 font-bold px-2 py-0.5 rounded-full">
                          Tour #{m.position}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{m.participant.phone}</p>
                      <p className="text-[10px] text-gray-400">Rejointe le {formatDate(m.joined_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                      title="Envoyer un rappel WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <Link to={`/members/${m.id}`}>
                      <Button variant="outline" size="sm">
                        Fiche
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CALENDRIER DES TOURS */}
      {activeTab === 'rounds' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Calendrier des Bénéficiaires</h3>
              <p className="text-xs text-gray-500">
                Ordre de rotation de la cagnotte (350.000 FCFA par tour)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {mockPayouts.map((payout) => {
              const ben = payout.beneficiary.participant;
              const benName = `${ben.first_name} ${ben.last_name}`;

              return (
                <Card key={payout.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary-800 text-white font-black flex items-center justify-center text-sm shrink-0">
                      #{payout.round_number}
                    </div>
                    <Avatar name={benName} src={ben.avatar} size="md" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{benName}</span>
                        <Badge
                          variant={
                            payout.status === 'verse'
                              ? 'success'
                              : payout.status === 'collecte_en_cours'
                              ? 'warning'
                              : 'gray'
                          }
                          dot
                        >
                          {payout.status === 'verse'
                            ? 'Versé avec succès'
                            : payout.status === 'collecte_en_cours'
                            ? 'Collecte en cours'
                            : 'Programmé'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">Date prévue : {formatDate(payout.planned_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-gray-900">
                        {formatCurrency(payout.status === 'verse' ? payout.actual_amount : payout.expected_amount)}
                      </p>
                      {payout.status === 'verse' && (
                        <p className="text-[10px] text-emerald-700">Via {payout.payment_method?.toUpperCase()}</p>
                      )}
                    </div>

                    {payout.status === 'collecte_en_cours' && (
                      <Button variant="primary" size="sm">
                        Valider Versement
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: VUE D'ENSEMBLE */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          <Card className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Règles et Accord du Groupe
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-gray-100">
              {tontine.rules}
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Paramètres Techniques
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Mode de répartition :</span>
                <span className="font-semibold text-gray-800 capitalize">{tontine.distribution_mode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Ordre des bénéficiaires :</span>
                <span className="font-semibold text-gray-800 capitalize">{tontine.beneficiary_order}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Jour de cotisation :</span>
                <span className="font-semibold text-gray-800">Le {tontine.payment_day} du mois</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Date d'échéance finale :</span>
                <span className="font-semibold text-gray-800">{formatDate(tontine.end_date)}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Enregistrement de Paiement Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Enregistrer un paiement"
        description={selectedCell ? `Cotisation Période ${selectedCell.period_number} pour ${selectedCell.member_name}` : ''}
      >
        <form onSubmit={handleSavePayment} className="space-y-4">
          <Input
            label="Montant reçu (FCFA)"
            type="number"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
            required
          />

          <Select
            label="Moyen de paiement"
            value={paymentForm.payment_method}
            onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
            options={[
              { value: 'wave', label: 'Wave Money' },
              { value: 'orange_money', label: 'Orange Money' },
              { value: 'free_money', label: 'Free Money' },
              { value: 'especes', label: 'Espèces (Remis en main propre)' },
              { value: 'virement', label: 'Virement Bancaire' },
            ]}
          />

          <Input
            label="Référence de transaction (Wave / OM)"
            placeholder="Ex: WAVE-TX-984321"
            value={paymentForm.reference}
            onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
          />

          <Input
            label="Date de réception"
            type="date"
            value={paymentForm.received_at}
            onChange={(e) => setPaymentForm({ ...paymentForm, received_at: e.target.value })}
            required
          />

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setIsPaymentModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" size="md" type="submit">
              Confirmer le paiement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
