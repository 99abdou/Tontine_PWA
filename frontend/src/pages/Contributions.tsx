import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Avatar } from '../components/ui/StatCard';
import { mockMatrixCells, mockMemberships } from '../services/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getWhatsAppUrl, generateWhatsAppMessage } from '../utils/whatsapp';
import { toast } from '../stores/toastStore';
import { useAuthStore } from '../stores/authStore';

export const ContributionsPage: React.FC = () => {
  const { role } = useAuthStore();
  const isParticipant = role === 'participant';

  const [filterPeriod, setFilterPeriod] = useState<number>(3); // Période 3 par défaut
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<any>(null);

  const [paymentForm, setPaymentForm] = useState({
    amount: 50000,
    payment_method: 'wave',
    reference: '',
    received_at: new Date().toISOString().split('T')[0],
  });

  const periodCells = mockMatrixCells.filter((c) => c.period_number === filterPeriod);

  const handleOpenPayment = (cell: any) => {
    setSelectedCell(cell);
    setPaymentForm({
      amount: cell.expected_amount - cell.paid_amount,
      payment_method: 'wave',
      reference: 'WAVE-TX-' + Math.floor(100000 + Math.random() * 900000),
      received_at: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Suivi des Cotisations</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {isParticipant
              ? 'Consultez les cotisations de votre groupe et l’état de vos reçus'
              : 'Vérifiez les paiements reçus et enregistrez les versements Wave / OM'}
          </p>
        </div>

        {!isParticipant && (
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenPayment(periodCells[3])}
          >
            Enregistrer un paiement
          </Button>
        )}
      </div>

      {/* Period Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[1, 2, 3, 4, 5, 6, 7].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPeriod(p)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterPeriod === p
                ? 'bg-primary-800 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Période {p} {p === 3 ? '(En cours)' : p < 3 ? '(Passée)' : '(À venir)'}
          </button>
        ))}
      </div>

      {/* Contributions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Participante</th>
                <th className="py-3.5 px-4">Échéance</th>
                <th className="py-3.5 px-4">Montant Attendu</th>
                <th className="py-3.5 px-4">Montant Reçu</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {periodCells.map((cell) => {
                const member = mockMemberships.find((m) => m.id === cell.member_id);
                const isOverdue = cell.status === 'en_retard';

                return (
                  <tr key={cell.contribution_id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-3">
                      <Avatar name={cell.member_name} src={member?.participant.avatar} size="sm" />
                      <div>
                        <p>{cell.member_name}</p>
                        <p className="text-[10px] text-gray-400 font-normal">{member?.participant.phone}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{formatDate(cell.due_date)}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {formatCurrency(cell.expected_amount)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {formatCurrency(cell.paid_amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          cell.status === 'paye'
                            ? 'success'
                            : cell.status === 'partiellement_paye'
                            ? 'warning'
                            : cell.status === 'en_retard'
                            ? 'danger'
                            : 'gray'
                        }
                        dot
                      >
                        {cell.status === 'paye'
                          ? 'Payé'
                          : cell.status === 'partiellement_paye'
                          ? 'Partiel'
                          : cell.status === 'en_retard'
                          ? 'En retard'
                          : 'À venir'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {cell.status !== 'paye' ? (
                        <div className="flex items-center justify-end gap-2">
                          {isOverdue && member && (
                            <a
                              href={getWhatsAppUrl(
                                member.participant.phone,
                                generateWhatsAppMessage({
                                  phone: member.participant.phone,
                                  participantName: cell.member_name,
                                  tontineName: 'Tontine Diamono',
                                  amount: cell.expected_amount,
                                  dueDate: cell.due_date,
                                  type: 'retard',
                                })
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              title="Relancer sur WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          {!isParticipant ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleOpenPayment(cell)}
                            >
                              Encaisser
                            </Button>
                          ) : (
                            <span className="text-[11px] font-semibold text-gray-400">
                              En attente
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reçu
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enregistrer un paiement"
        description={selectedCell ? `Cotisation pour ${selectedCell.member_name}` : ''}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
            toast.success(
              'Paiement validé avec succès !',
              `Reçu de ${formatCurrency(paymentForm.amount)} enregistré pour ${selectedCell?.member_name} (via ${paymentForm.payment_method.toUpperCase()})`
            );
          }}
          className="space-y-4"
        >
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
              { value: 'especes', label: 'Espèces' },
              { value: 'virement', label: 'Virement' },
            ]}
          />

          <Input
            label="Référence de transaction"
            value={paymentForm.reference}
            onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
            placeholder="Ex: WAVE-TX-1092"
          />

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" size="md" type="submit">
              Valider le reçu
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
