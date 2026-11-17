import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coins, User, Smartphone, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { toast } from '../stores/toastStore';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(phone || '77 654 32 10', 'organizer');
    toast.success('Bienvenue sur TONTINE PRO !', 'Votre compte a été créé avec succès');
    navigate('/dashboard');
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
        <h2 className="mt-6 text-2xl font-black text-gray-950 tracking-tight">Créer un compte TONTINE PRO</h2>
        <p className="mt-1 text-xs text-gray-500">
          Rejoignez des centaines d'organisatrices qui simplifient leur gestion quotidienne
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100 sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Prénom"
                placeholder="Ex: Fatou"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Nom"
                placeholder="Ex: Sow"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <Input
              label="Numéro de téléphone"
              type="tel"
              placeholder="Ex: 77 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Smartphone className="w-4 h-4" />}
              helperText="Utilisé pour vos connexions et notifications Wave / WhatsApp"
              required
            />

            <Input
              label="Adresse e-mail (facultatif)"
              type="email"
              placeholder="fatou.sow@exemple.sn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Créer mon compte
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-bold text-primary-800 hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};
