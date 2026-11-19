import React from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  ShieldCheck,
  Smartphone,
  CalendarCheck,
  Users2,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans overflow-x-hidden w-full max-w-full">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-primary-950 to-primary-700 flex items-center justify-center text-white shadow-md shadow-primary-900/20">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-primary-950">TONTINE<span className="text-amber-600">PRO</span></span>
              <span className="block text-[8px] sm:text-[9px] font-bold text-primary-800 tracking-widest uppercase">Gestion Numérique</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#features" className="hover:text-primary-800 transition-colors">Fonctionnalités</a>
            <a href="#how-it-works" className="hover:text-primary-800 transition-colors">Comment ça marche</a>
            <a href="#pricing" className="hover:text-primary-800 transition-colors">Tarifs</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="px-2.5 sm:px-3 text-xs sm:text-sm">Connexion</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="text-xs sm:text-sm px-3 sm:px-4" rightIcon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}>
                <span className="hidden sm:inline">Commencer Gratuitement</span>
                <span className="sm:hidden">S'inscrire</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-primary-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold tracking-wide">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                N°1 de la gestion de tontines au Sénégal & en Afrique
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.1]">
                Fini les cahiers et les calculs sur WhatsApp.
                <span className="text-primary-800 block mt-2">Gérez vos tontines en toute sérénité.</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Automatisez le suivi des cotisations, les alertes de retard, les bénéficiaires et les versements.
                Une PWA moderne, rapide et accessible sur smartphone pour toutes les organisatrices.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Créer ma première tontine
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explorer la démo interactive
                  </Button>
                </Link>
              </div>

              <div className="pt-6 border-t border-gray-200/60 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Calculs 100% automatiques</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Rappels WhatsApp en 1 clic</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Devise XOF (FCFA)</span>
                </div>
              </div>
            </div>

            {/* Hero Mockup Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-[2.5rem] p-3 bg-gray-900 shadow-2xl ring-1 ring-gray-900/10">
                <div className="rounded-[2rem] overflow-hidden bg-slate-50 border border-gray-800 p-4 space-y-4">
                  {/* Phone header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Tableau de bord</p>
                      <p className="text-sm font-bold text-gray-900">Tontine Diamono</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  </div>

                  {/* Summary card */}
                  <div className="bg-gradient-to-br from-primary-900 to-primary-700 text-white p-4 rounded-2xl shadow-sm">
                    <p className="text-[11px] text-primary-200 uppercase font-semibold">Total collecté (Période 3)</p>
                    <p className="text-2xl font-black text-white mt-1">275.000 FCFA</p>
                    <div className="mt-3 bg-primary-950/40 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-400 h-full w-[78%]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-primary-200 mt-1">
                      <span>78% encaissé</span>
                      <span>Objectif : 350.000 FCFA</span>
                    </div>
                  </div>

                  {/* Beneficiary alert */}
                  <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 font-bold flex items-center justify-center text-xs">
                      👑
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-bold text-gray-900">Bénéficiaire du 10 Mai</p>
                      <p className="text-gray-600 text-[11px]">Aminata Ndiaye (350.000 FCFA)</p>
                    </div>
                  </div>

                  {/* Recent contributions */}
                  <div className="space-y-2 text-left">
                    <p className="text-xs font-bold text-gray-800">Derniers versements</p>
                    <div className="p-2.5 rounded-xl bg-white border border-gray-100 flex items-center justify-between text-xs shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-gray-900">Aïssatou Diallo</span>
                      </div>
                      <span className="font-bold text-emerald-700">50.000 FCFA</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-gray-100 flex items-center justify-between text-xs shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="font-semibold text-gray-900">Khady Diop</span>
                      </div>
                      <span className="font-bold text-rose-600">En retard</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-800">Fonctionnalités Clés</h2>
            <p className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Tout ce dont une organisatrice moderne a besoin
            </p>
            <p className="text-gray-600">
              Conçu pour s'adapter aux réalités locales : Wave, Orange Money, réunions physiques et groupes WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-slate-50 border border-gray-100 space-y-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center font-bold">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Calendrier des tours automatique</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ordre aléatoire ou personnalisé. Chaque participante sait exactement quand viendra son tour de recevoir la cagnotte.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-gray-100 space-y-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Enregistrement Wave & OM</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tracez facilement les reçus Wave, Orange Money, Free Money ou espèces avec numéro de référence et justificatif.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-gray-100 space-y-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Relances WhatsApp en 1 Clic</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Messages pré-rédigés personnalisés qui s'ouvrent directement dans WhatsApp pour rappeler les échéances sans friction.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-gray-100 space-y-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Espace Participante Dédié</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Chaque membre peut se connecter pour consulter l'historique de ses paiements, ses reçus et son prochain tour.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-gray-100 space-y-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Sécurité & Traçabilité totale</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Aucune suppression silencieuse. Tout ajustement financier est journalisé avec motif et date pour une transparence absolue.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-gray-100 space-y-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Rapports PDF & Excel</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Générez en un clic les bilans de fin de cycle ou les fiches individuelles pour partager dans le groupe WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Modèle Économique (SaaS) */}
      <section id="pricing" className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-800">Nos Formules</h2>
            <p className="text-3xl font-black text-gray-950">Un tarif simple et adapté à chaque groupe</p>
            <p className="text-gray-600">Démarrez gratuitement et passez au niveau supérieur quand votre communauté grandit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Gratuit */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Formule Gratuite</h3>
                <p className="text-xs text-gray-500">Idéal pour tester avec un petit groupe d'amies.</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-gray-950">0 FCFA</span>
                  <span className="text-xs text-gray-500"> / mois</span>
                </div>
                <ul className="space-y-2.5 text-xs text-gray-600 pt-4 border-t border-gray-100">
                  <li className="flex items-center gap-2">✓ 1 tontine active</li>
                  <li className="flex items-center gap-2">✓ Jusqu'à 10 participantes</li>
                  <li className="flex items-center gap-2">✓ Gestion manuelle des paiements</li>
                  <li className="flex items-center gap-2">✓ Tableau de bord de base</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8">
                <Button variant="outline" className="w-full">Commencer Gratuit</Button>
              </Link>
            </div>

            {/* Standard */}
            <div className="bg-white rounded-3xl p-8 border-2 border-primary-800 shadow-xl flex flex-col justify-between relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary-800 text-white shadow-md">
                Recommandé
              </span>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Formule Standard</h3>
                <p className="text-xs text-gray-500">Pour les organisatrices actives avec plusieurs groupes.</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-primary-950">5.000 FCFA</span>
                  <span className="text-xs text-gray-500"> / mois</span>
                </div>
                <ul className="space-y-2.5 text-xs text-gray-700 pt-4 border-t border-gray-100">
                  <li className="flex items-center gap-2 font-medium">✓ Jusqu'à 5 tontines actives</li>
                  <li className="flex items-center gap-2 font-medium">✓ Participantes illimitées</li>
                  <li className="flex items-center gap-2 font-medium">✓ Rappels WhatsApp en 1 clic</li>
                  <li className="flex items-center gap-2 font-medium">✓ Rapports PDF & Excel complets</li>
                  <li className="flex items-center gap-2 font-medium">✓ Historique illimité</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8">
                <Button variant="primary" className="w-full">Choisir Standard</Button>
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Formule Premium</h3>
                <p className="text-xs text-gray-500">Pour les grandes associations et réseaux de femmes.</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-gray-950">15.000 FCFA</span>
                  <span className="text-xs text-gray-500"> / mois</span>
                </div>
                <ul className="space-y-2.5 text-xs text-gray-600 pt-4 border-t border-gray-100">
                  <li className="flex items-center gap-2">✓ Tontines illimitées</li>
                  <li className="flex items-center gap-2">✓ Notifications WhatsApp automatisées</li>
                  <li className="flex items-center gap-2">✓ Multi-administratrices</li>
                  <li className="flex items-center gap-2">✓ Support prioritaire 7j/7</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8">
                <Button variant="outline" className="w-full">Contacter l'équipe</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-primary-950 text-white py-12 border-t border-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-primary-300">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-950 to-primary-700 flex items-center justify-center text-white shadow-md shadow-primary-900/20">
              <Coins className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-black">TONTINE<span className="text-amber-600">PRO</span></span>
              <span className="block text-[9px] font-bold text-primary-800 tracking-widest uppercase">Gestion Numérique Sécurisée</span>
            </div>
          </div>
          <p className='text-black'>© 2026 TONTINE PRO. Tous droits réservés. Dakar, Sénégal.</p>
        </div>
      </footer>
    </div>
  );
};
