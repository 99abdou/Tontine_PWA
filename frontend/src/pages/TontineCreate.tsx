import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coins,
  Calendar,
  Users,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { formatCurrency } from '../utils/formatters';
import { toast } from '../stores/toastStore';

export const TontineCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    name: 'Tontine des Commerçantes',
    description: 'Groupe d’épargne rotatif pour soutenir nos activités commerciales.',
    tontine_type: 'rotative',
    contribution_amount: 50000,
    currency: 'XOF',
    frequency: 'mensuel',
    participant_limit: 10,
    start_date: '2024-06-01',
    payment_day: 5,
    first_payout_date: '2024-06-10',
    distribution_mode: 'rotation',
    beneficiary_order: 'fixe',
    rules: 'Paiement avant le 5 de chaque mois. Pénalité de 2.000 FCFA après 3 jours de retard.',
  });

  // Dynamic calculations
  const totalPoolPerPeriod = formData.contribution_amount * formData.participant_limit;
  
  // Calculate end date based on frequency and participant count
  const calculateEndDate = () => {
    const start = new Date(formData.start_date || '2024-06-01');
    if (formData.frequency === 'hebdomadaire') {
      start.setDate(start.getDate() + formData.participant_limit * 7);
    } else if (formData.frequency === 'bimensuel') {
      start.setDate(start.getDate() + formData.participant_limit * 15);
    } else {
      start.setMonth(start.getMonth() + formData.participant_limit);
    }
    return start.toISOString().split('T')[0];
  };

  const calculatedEndDate = calculateEndDate();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      toast.success(
        'Tontine créée avec succès !',
        `Le groupe "${formData.name}" a été initialisé avec un cycle prévisionnel jusqu'au ${calculatedEndDate}`
      );
      navigate('/tontines/t-1');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      {/* Back button */}
      <Link to="/tontines" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /> Retour aux tontines
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">Créer une nouvelle Tontine</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configurez les paramètres financiers, les membres et le calendrier des versements
          </p>
        </div>
        <span className="text-xs font-bold text-primary-800 bg-primary-50 px-3 py-1 rounded-full self-start">
          Étape {step} sur 4
        </span>
      </div>

      {/* Stepper indicator */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: 'Général' },
          { num: 2, label: 'Financier' },
          { num: 3, label: 'Tours & Dates' },
          { num: 4, label: 'Règles' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              step === s.num
                ? 'bg-primary-800 text-white border-primary-800 shadow-xs'
                : step > s.num
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            <p className="text-[10px] font-extrabold uppercase">Étape {s.num}</p>
            <p className="text-xs font-bold truncate">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-gray-900">Informations Générales</h3>
                <p className="text-xs text-gray-500">Donnez un nom clair à votre tontine</p>
              </div>

              <Input
                label="Nom de la tontine"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Tontine Diamono des Entrepreneures"
                required
              />

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Description ou Objectif
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez l'objectif du groupe..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-600 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type de Tontine
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'rotative',
                      title: 'Rotative Classique',
                      desc: 'Chaque période, la cagnotte collectée est remise à une participante différente.',
                    },
                    {
                      id: 'epargne',
                      title: 'Épargne Collective',
                      desc: 'Les fonds sont accumulés dans une caisse commune pour un retrait commun.',
                    },
                    {
                      id: 'personnalisee',
                      title: 'Personnalisée',
                      desc: 'Règles et échéances adaptées selon les souhaits spécifiques de votre groupe.',
                    },
                  ].map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setFormData({ ...formData, tontine_type: type.id })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        formData.tontine_type === type.id
                          ? 'border-primary-800 bg-primary-50/50 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-gray-900">{type.title}</span>
                        {formData.tontine_type === type.id && <Check className="w-4 h-4 text-primary-800" />}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{type.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-gray-900">Configuration Financière</h3>
                <p className="text-xs text-gray-500">Fixez le montant et le rythme des cotisations</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Montant de la cotisation"
                  type="number"
                  value={formData.contribution_amount}
                  onChange={(e) => setFormData({ ...formData, contribution_amount: Number(e.target.value) })}
                  helperText="En Francs CFA (XOF)"
                  required
                />

                <Select
                  label="Fréquence de cotisation"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  options={[
                    { value: 'hebdomadaire', label: 'Hebdomadaire (Chaque semaine)' },
                    { value: 'bimensuel', label: 'Bimensuel (2 fois par mois)' },
                    { value: 'mensuel', label: 'Mensuel (Chaque mois)' },
                  ]}
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-950 to-primary-800 text-white space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Simulation Automatique
                </p>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-xs text-primary-200 block">Cotisation par membre :</span>
                    <span className="text-lg font-black">{formatCurrency(formData.contribution_amount)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-primary-200 block">Cagnotte par tour :</span>
                    <span className="text-lg font-black text-amber-300">{formatCurrency(totalPoolPerPeriod)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-gray-900">Participantes & Dates Clés</h3>
                <p className="text-xs text-gray-500">Le système génère le calendrier des échéances</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre de participantes"
                  type="number"
                  value={formData.participant_limit}
                  onChange={(e) => setFormData({ ...formData, participant_limit: Number(e.target.value) })}
                  helperText="Minimum 2, maximum 50"
                  required
                />

                <Input
                  label="Date de démarrage"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Jour limite de paiement"
                  type="number"
                  value={formData.payment_day}
                  onChange={(e) => setFormData({ ...formData, payment_day: Number(e.target.value) })}
                  helperText="Ex: le 5 du mois"
                  required
                />

                <Input
                  label="Première date de versement"
                  type="date"
                  value={formData.first_payout_date}
                  onChange={(e) => setFormData({ ...formData, first_payout_date: e.target.value })}
                  required
                />
              </div>

              <Select
                label="Ordre d'attribution des bénéficiaires"
                value={formData.beneficiary_order}
                onChange={(e) => setFormData({ ...formData, beneficiary_order: e.target.value as any })}
                options={[
                  { value: 'fixe', label: 'Ordre fixe convenu à l’avance' },
                  { value: 'aleatoire', label: 'Tirage au sort aléatoire' },
                  { value: 'manuel', label: 'Attribution manuelle par l’organisatrice' },
                ]}
              />

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 flex justify-between items-center">
                <span>Date de fin calculée automatiquement :</span>
                <span className="font-bold text-gray-900">{calculatedEndDate}</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-gray-900">Règles du Groupe & Validation</h3>
                <p className="text-xs text-gray-500">
                  Définissez les pénalités éventuelles et les accords acceptés par toutes
                </p>
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Règlement intérieur du groupe
                </label>
                <textarea
                  rows={4}
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="Ex: Les retards sont soumis à une pénalité de 2.000 FCFA..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-600 outline-none"
                />
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200 space-y-3 text-xs">
                <h4 className="font-bold text-sm text-gray-900">Récapitulatif de la Tontine</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>Nom : <strong className="text-gray-900">{formData.name}</strong></div>
                  <div>Type : <strong className="text-gray-900 capitalize">{formData.tontine_type}</strong></div>
                  <div>Cotisation : <strong className="text-gray-900">{formatCurrency(formData.contribution_amount)}</strong></div>
                  <div>Membres : <strong className="text-gray-900">{formData.participant_limit} participantes</strong></div>
                  <div>Cagnotte par tour : <strong className="text-primary-800 font-bold">{formatCurrency(totalPoolPerPeriod)}</strong></div>
                  <div>Échéance de fin : <strong className="text-gray-900">{calculatedEndDate}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            {step > 1 ? (
              <Button variant="outline" size="md" onClick={() => setStep(step - 1)}>
                Précédent
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {step === 4 ? 'Valider et Démarrer' : 'Continuer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
