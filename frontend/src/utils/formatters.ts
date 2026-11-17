// Currency formatting for FCFA
export const formatCurrency = (amount: number): string => {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted} FCFA`;
};

// Date formatting in French locale
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateRelative = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Demain';
  if (diffDays === -1) return 'Hier';
  if (diffDays > 0 && diffDays <= 7) return `Dans ${diffDays} jours`;
  if (diffDays < 0 && diffDays >= -7) return `Il y a ${Math.abs(diffDays)} jours`;
  return formatDate(dateStr);
};

// Status labels in French
export const tontineStatusLabel: Record<string, string> = {
  brouillon: 'Brouillon',
  active: 'Active',
  en_pause: 'En pause',
  terminee: 'Terminée',
  annulee: 'Annulée',
};

export const contributionStatusLabel: Record<string, string> = {
  a_venir: 'À venir',
  en_attente: 'En attente',
  partiellement_paye: 'Partiel',
  paye: 'Payé',
  en_retard: 'En retard',
  annule: 'Annulé',
  litige: 'Litige',
};

export const paymentMethodLabel: Record<string, string> = {
  wave: 'Wave',
  orange_money: 'Orange Money',
  free_money: 'Free Money',
  especes: 'Espèces',
  virement: 'Virement',
  autre: 'Autre',
};

export const payoutStatusLabel: Record<string, string> = {
  programme: 'Programmé',
  collecte_en_cours: 'Collecte en cours',
  pret: 'Prêt',
  verse: 'Versé',
  en_retard: 'En retard',
  suspendu: 'Suspendu',
};

export const frequencyLabel: Record<string, string> = {
  hebdomadaire: 'Hebdomadaire',
  bimensuel: 'Bimensuel',
  mensuel: 'Mensuel',
};

export const tontineTypeLabel: Record<string, string> = {
  rotative: 'Rotative',
  epargne: 'Épargne',
  personnalisee: 'Personnalisée',
};

export const membershipStatusLabel: Record<string, string> = {
  invite: 'Invité(e)',
  actif: 'Actif(ve)',
  suspendu: 'Suspendu(e)',
  archive: 'Archivé(e)',
};

// Get initials from name
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Percentage calculation
export const calcPercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Phone number formatting for Senegal
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `+221 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};
