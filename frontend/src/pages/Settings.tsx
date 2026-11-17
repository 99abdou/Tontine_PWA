import React from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { toast } from '../stores/toastStore';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();

  const handleSave = () => {
    toast.success('Paramètres enregistrés !', 'Vos coordonnées et préférences ont été mises à jour');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight">Paramètres du Compte</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Gérez vos préférences de notification, devise et sécurité
        </p>
      </div>

      <Card>
        <CardHeader title="Informations Personnelles" subtitle="Vos coordonnées visibles par vos membres" />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom" defaultValue={user?.first_name} />
            <Input label="Nom" defaultValue={user?.last_name} />
          </div>
          <Input label="Numéro de téléphone" defaultValue={user?.phone} />
          <Input label="Adresse email" defaultValue={user?.email} />
          <div className="pt-2 flex justify-end">
            <Button variant="primary" onClick={handleSave}>
              Enregistrer les modifications
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Préférences Régionales & Devise" subtitle="Configuration locale" />
        <CardContent className="space-y-4">
          <Select
            label="Devise Principale"
            defaultValue="XOF"
            options={[
              { value: 'XOF', label: 'Franc CFA (XOF) - Sénégal & UEMOA' },
              { value: 'GNF', label: 'Franc Guinéen (GNF)' },
              { value: 'EUR', label: 'Euro (EUR)' },
            ]}
          />
          <Select
            label="Fuseau horaire"
            defaultValue="Africa/Dakar"
            options={[{ value: 'Africa/Dakar', label: 'Dakar (GMT+0)' }]}
          />
        </CardContent>
      </Card>
    </div>
  );
};
