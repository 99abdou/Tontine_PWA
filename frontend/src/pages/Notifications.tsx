import React, { useState } from 'react';
import {
  Bell,
  MessageCircle,
  Send,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Input';
import { mockMemberships, mockTontines } from '../services/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getWhatsAppUrl, generateWhatsAppMessage } from '../utils/whatsapp';
import { toast } from '../stores/toastStore';
import { useAuthStore } from '../stores/authStore';

export const NotificationsPage: React.FC = () => {
  const { role } = useAuthStore();
  const isParticipant = role === 'participant';

  const [selectedMemberId, setSelectedMemberId] = useState(mockMemberships[3].id); // Khady Diop
  const [messageType, setMessageType] = useState<'rappel' | 'retard' | 'confirmation_paiement' | 'tour_beneficiaire'>('retard');

  const selectedMember = mockMemberships.find((m) => m.id === selectedMemberId) || mockMemberships[0];
  const memberName = `${selectedMember.participant.first_name} ${selectedMember.participant.last_name}`;

  // Generated message
  const preparedMessage = generateWhatsAppMessage({
    phone: selectedMember.participant.phone,
    participantName: memberName,
    tontineName: 'Tontine Diamono',
    amount: 50000,
    dueDate: '2024-05-05',
    payoutDate: '2024-05-10',
    type: messageType,
  });

  const whatsappLink = getWhatsAppUrl(selectedMember.participant.phone, preparedMessage);

  if (isParticipant) {
    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-950 tracking-tight">Mes Notifications</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Historique des rappels, reçus de cotisation et messages de votre organisatrice
            </p>
          </div>

          <a
            href="https://wa.me/221776543210?text=Bonjour%20Fatou,%20j'ai%20une%20question%20concernant%20la%20Tontine%20Diamono"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="success" size="sm" leftIcon={<MessageCircle className="w-4 h-4" />}>
              Contacter Fatou Sow (Organisatrice)
            </Button>
          </a>
        </div>

        <div className="space-y-3">
          <Card className="p-4 flex items-start gap-3.5 border-l-4 border-l-emerald-500">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Reçu de paiement confirmé</span>
                <span className="text-[10px] text-gray-400">02 Mai 2024</span>
              </div>
              <p className="text-gray-600">
                Votre cotisation de <strong>50.000 FCFA</strong> pour la période de Mai a bien été enregistrée par l’organisatrice.
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-start gap-3.5 border-l-4 border-l-amber-500">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Tour bénéficiaire en cours</span>
                <span className="text-[10px] text-gray-400">05 Mai 2024</span>
              </div>
              <p className="text-gray-600">
                Le tour #3 de la Tontine Diamono est en cours de collecte pour Aminata Ndiaye. Versement prévu le 10 Mai.
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-start gap-3.5 border-l-4 border-l-primary-700">
            <div className="p-2 rounded-xl bg-primary-50 text-primary-800 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Prochaine cotisation</span>
                <span className="text-[10px] text-gray-400">01 Juin 2024</span>
              </div>
              <p className="text-gray-600">
                Prochaine échéance fixée au <strong>05 Juin 2024</strong> (Période 4). Merci pour votre régularité !
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Centre de Notifications & WhatsApp</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Préparez et envoyez des messages personnalisés directement via WhatsApp Web / Mobile
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Form */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 space-y-5">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
              Générer un message WhatsApp
            </h3>

            <div className="space-y-4 text-xs">
              <Select
                label="Choisir la participante"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                options={mockMemberships.map((m) => ({
                  value: m.id,
                  label: `${m.participant.first_name} ${m.participant.last_name} (${m.participant.phone})`,
                }))}
              />

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type de notification
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'rappel', label: 'Rappel Échéance' },
                    { id: 'retard', label: 'Alerte Retard' },
                    { id: 'confirmation_paiement', label: 'Reçu de Paiement' },
                    { id: 'tour_beneficiaire', label: 'Félicitations Tour' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setMessageType(t.id as any)}
                      className={`p-3 rounded-xl border text-left font-bold transition-all ${
                        messageType === t.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Destinataire : {selectedMember.participant.phone}</span>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  toast.success(
                    'Lien WhatsApp ouvert',
                    `Message pré-rempli envoyé à ${selectedMember.participant.first_name} ${selectedMember.participant.last_name}`
                  );
                }}
              >
                <Button
                  variant="success"
                  size="md"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                >
                  Ouvrir dans WhatsApp
                </Button>
              </a>
            </div>
          </Card>
        </div>

        {/* Live WhatsApp Bubble Preview */}
        <div className="lg:col-span-5">
          <Card className="h-full bg-slate-100 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Aperçu du message WhatsApp
                </span>
              </div>

              {/* Chat bubble */}
              <div className="bg-[#DCF8C6] p-4 rounded-2xl rounded-tr-none shadow-sm text-xs text-gray-900 whitespace-pre-line leading-relaxed border border-[#c4e8a8]">
                {preparedMessage}
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              💡 Le clic sur le bouton ouvre directement l'application WhatsApp sur smartphone ou WhatsApp Web sur ordinateur.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
