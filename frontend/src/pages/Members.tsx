import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  MessageCircle,
  ChevronRight,
  Phone,
  Calendar,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/StatCard';
import { mockMemberships, mockTontines } from '../services/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getWhatsAppUrl, generateWhatsAppMessage } from '../utils/whatsapp';
import { useAuthStore } from '../stores/authStore';

export const MembersPage: React.FC = () => {
  const { role } = useAuthStore();
  const isParticipant = role === 'participant';
  const [search, setSearch] = useState('');

  const filteredMembers = mockMemberships.filter((m) => {
    const fullName = `${m.participant.first_name} ${m.participant.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || m.participant.phone.includes(search);
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Participantes</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {isParticipant
              ? 'Membres de votre groupe de tontine'
              : 'Liste de toutes les participantes inscrites dans vos groupes'}
          </p>
        </div>

        {!isParticipant && (
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Ajouter une participante
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou numéro..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary-600 outline-none"
        />
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((m) => {
          const name = `${m.participant.first_name} ${m.participant.last_name}`;
          const isOverdue = m.position === 4 || m.position === 5; // Khady or Ndèye
          const msg = generateWhatsAppMessage({
            phone: m.participant.phone,
            participantName: name,
            tontineName: 'Tontine Diamono',
            amount: 50000,
            dueDate: '2024-05-05',
            type: isOverdue ? 'retard' : 'rappel',
          });
          const whatsappUrl = getWhatsAppUrl(m.participant.phone, msg);

          return (
            <Card key={m.id} hoverable className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={name} src={m.participant.avatar} size="lg" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{name}</h3>
                      <p className="text-xs text-gray-500">{m.participant.phone}</p>
                    </div>
                  </div>
                  <Badge variant={isOverdue ? 'danger' : 'success'} dot>
                    {isOverdue ? 'En retard' : 'À jour'}
                  </Badge>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Tontine :</span>
                    <strong className="text-gray-900">Tontine Diamono</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tour dans la rotation :</span>
                    <strong className="text-primary-800">#{m.position}</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Cotisations réglées :</span>
                    <strong className="text-emerald-700">
                      {isOverdue ? '100.000 FCFA' : '150.000 FCFA'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>

                <Link to={`/members/${m.id}`}>
                  <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    Voir fiche
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export const MemberDetailPage: React.FC = () => {
  const member = mockMemberships[0]; // Aïssatou Diallo
  const name = `${member.participant.first_name} ${member.participant.last_name}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      <Link to="/members" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /> Retour aux participantes
      </Link>

      {/* Profile Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar name={name} src={member.participant.avatar} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{name}</h1>
                <Badge variant="success" dot>À jour</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">{member.participant.phone} • {member.participant.email}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Membre depuis le {formatDate(member.joined_at)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/221${member.participant.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="success" size="sm" leftIcon={<MessageCircle className="w-4 h-4" />}>
                Contacter WhatsApp
              </Button>
            </a>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100 text-xs">
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Tontines actives</p>
            <p className="text-base font-extrabold text-gray-900 mt-0.5">1 groupe</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Total Cotisé</p>
            <p className="text-base font-extrabold text-emerald-700 mt-0.5">150.000 FCFA</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Cagnotte Reçue</p>
            <p className="text-base font-extrabold text-primary-800 mt-0.5">350.000 FCFA</p>
            <p className="text-[10px] text-gray-400">Reçu le 10/03/2024</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Dettes / Retards</p>
            <p className="text-base font-extrabold text-emerald-600 mt-0.5">0 FCFA</p>
          </div>
        </div>
      </Card>

      {/* Historique des paiements */}
      <Card>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900">Historique des transactions</h3>
          <span className="text-xs text-gray-400">Tous les paiements enregistrés</span>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { period: 'Période 3 (Mai 2024)', amount: 50000, date: '2024-05-02', method: 'Wave', ref: 'WAVE-PAY-78219' },
            { period: 'Période 2 (Avril 2024)', amount: 50000, date: '2024-04-03', method: 'Wave', ref: 'WAVE-PAY-44321' },
            { period: 'Période 1 (Mars 2024)', amount: 50000, date: '2024-03-02', method: 'Orange Money', ref: 'OM-TX-10923' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between text-xs hover:bg-gray-50/50">
              <div>
                <p className="font-bold text-gray-900">{item.period}</p>
                <p className="text-gray-500 text-[11px]">{item.method} • Réf: {item.ref} • {formatDate(item.date)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-700">+{formatCurrency(item.amount)}</p>
                <Badge variant="success">Confirmé</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
