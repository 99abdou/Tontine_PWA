import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Coins,
  Send,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Avatar } from '../components/ui/StatCard';
import { mockPayouts } from '../services/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from '../stores/toastStore';

export const PayoutsPage: React.FC = () => {
  const [payouts, setPayouts] = useState(mockPayouts);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [payoutForm, setPayoutForm] = useState({
    amount: 350000,
    payment_method: 'wave',
    reference: '',
    paid_at: new Date().toISOString().split('T')[0],
  });

  const handleOpenPayoutModal = (p: any) => {
    setSelectedPayout(p);
    setPayoutForm({
      amount: p.actual_amount || p.expected_amount,
      payment_method: 'wave',
      reference: 'WAVE-PAY-' + Math.floor(100000 + Math.random() * 900000),
      paid_at: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleConfirmPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === selectedPayout.id
          ? {
              ...p,
              status: 'verse',
              actual_amount: payoutForm.amount,
              payment_method: payoutForm.payment_method as any,
              reference: payoutForm.reference,
              paid_at: payoutForm.paid_at,
            }
          : p
      )
    );
    const benName = `${selectedPayout.beneficiary.participant.first_name} ${selectedPayout.beneficiary.participant.last_name}`;
    toast.success(
      'Versement confirmé avec succès !',
      `La somme de ${formatCurrency(payoutForm.amount)} a été versée à ${benName} (Réf: ${payoutForm.reference})`
    );
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Bénéficiaires & Tours</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Suivi des cagnottes à distribuer et validation des versements effectués
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {payouts.map((payout) => {
          const ben = payout.beneficiary.participant;
          const benName = `${ben.first_name} ${ben.last_name}`;
          const isCurrent = payout.status === 'collecte_en_cours';

          return (
            <Card
              key={payout.id}
              className={`p-6 transition-all ${
                isCurrent ? 'ring-2 ring-amber-400 bg-amber-50/20 shadow-md' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${
                      payout.status === 'verse'
                        ? 'bg-emerald-100 text-emerald-800'
                        : isCurrent
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    #{payout.round_number}
                  </div>

                  <Avatar name={benName} src={ben.avatar} size="lg" />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-gray-900">{benName}</h3>
                      <Badge
                        variant={
                          payout.status === 'verse'
                            ? 'success'
                            : isCurrent
                            ? 'warning'
                            : 'gray'
                        }
                        dot
                      >
                        {payout.status === 'verse'
                          ? 'Versé au bénéficiaire'
                          : isCurrent
                          ? 'Tour en cours'
                          : 'À venir'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Téléphone : {ben.phone} • Date prévue : <strong>{formatDate(payout.planned_date)}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Montant cagnotte</p>
                    <p className="text-lg font-black text-gray-900">
                      {formatCurrency(payout.status === 'verse' ? payout.actual_amount : payout.expected_amount)}
                    </p>
                    {payout.status === 'verse' ? (
                      <p className="text-[10px] text-emerald-700 font-semibold">
                        Versé via {payout.payment_method?.toUpperCase()}
                      </p>
                    ) : isCurrent ? (
                      <p className="text-[10px] text-amber-700 font-semibold">
                        Collecté : {formatCurrency(payout.actual_amount)}
                      </p>
                    ) : null}
                  </div>

                  {isCurrent && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleOpenPayoutModal(payout)}
                      leftIcon={<Send className="w-4 h-4" />}
                    >
                      Confirmer le versement
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmer le versement de la cagnotte"
        description={selectedPayout ? `Bénéficiaire : ${selectedPayout.beneficiary.participant.first_name} ${selectedPayout.beneficiary.participant.last_name}` : ''}
      >
        <form onSubmit={handleConfirmPayout} className="space-y-4">
          <Input
            label="Montant versé (FCFA)"
            type="number"
            value={payoutForm.amount}
            onChange={(e) => setPayoutForm({ ...payoutForm, amount: Number(e.target.value) })}
            required
          />

          <Select
            label="Moyen de versement"
            value={payoutForm.payment_method}
            onChange={(e) => setPayoutForm({ ...payoutForm, payment_method: e.target.value })}
            options={[
              { value: 'wave', label: 'Wave (Transfert mobile)' },
              { value: 'orange_money', label: 'Orange Money' },
              { value: 'especes', label: 'Espèces (Remis en mains propres)' },
              { value: 'virement', label: 'Virement bancaire' },
            ]}
          />

          <Input
            label="Référence de la transaction"
            placeholder="Ex: WAVE-PAY-98124"
            value={payoutForm.reference}
            onChange={(e) => setPayoutForm({ ...payoutForm, reference: e.target.value })}
            required
          />

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" size="md" type="submit">
              Valider le versement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
