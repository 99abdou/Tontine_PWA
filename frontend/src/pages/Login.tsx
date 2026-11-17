import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coins, Smartphone, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { toast } from '../stores/toastStore';

export const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('77 654 32 10');
  const [password, setPassword] = useState('pass1234');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(phone);
    toast.success('Connexion réussie', 'Bienvenue sur votre espace TONTINE PRO');
    navigate('/dashboard');
  };

  const handleQuickLogin = (role: 'organizer' | 'participant' | 'admin') => {
    if (role === 'organizer') {
      login('77 654 32 10', 'organizer');
      toast.success('Connexion Organisatrice', 'Bienvenue Fatou Sow');
      navigate('/dashboard');
    } else if (role === 'participant') {
      login('77 123 45 67', 'participant');
      toast.success('Connexion Participante', 'Bienvenue Aïssatou Diallo');
      navigate('/participant');
    } else {
      login('77 000 00 00', 'admin');
      toast.success('Connexion Superviseur', 'Bienvenue sur la console Admin');
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-950 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-900/20">
            <Coins className="w-7 h-7 text-amber-300" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-primary-950">TONTINE<span className="text-amber-600">PRO</span></span>
            <span className="block text-[9px] font-bold text-primary-800 tracking-widest uppercase">Sénégal & Afrique</span>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-black text-gray-950 tracking-tight">Connexion à votre espace</h2>
        <p className="mt-1 text-xs text-gray-500">
          Entrez votre numéro de téléphone pour gérer ou suivre vos tontines
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Numéro de téléphone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 77 123 45 67"
              leftIcon={<Smartphone className="w-4 h-4" />}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary-700 focus:ring-primary-500" />
                <span>Se souvenir de moi</span>
              </label>
              <a href="#" className="font-semibold text-primary-800 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" className="w-full" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Se connecter
            </Button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center mb-3">
              ⚡ Accès rapide pour test démo
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('organizer')}
                className="p-2 rounded-xl border border-primary-200 bg-primary-50/60 hover:bg-primary-100 text-primary-900 text-xs font-bold text-center transition-colors"
              >
                Organisatrice
                <span className="block text-[10px] text-primary-600 font-normal">Fatou Sow</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('participant')}
                className="p-2 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-900 text-xs font-bold text-center transition-colors"
              >
                Participante
                <span className="block text-[10px] text-amber-600 font-normal">Aïssatou</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 text-xs font-bold text-center transition-colors"
              >
                Admin
                <span className="block text-[10px] text-gray-500 font-normal">Moussa</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-bold text-primary-800 hover:underline">
            Inscrivez-vous gratuitement
          </Link>
        </p>
      </div>
    </div>
  );
};
