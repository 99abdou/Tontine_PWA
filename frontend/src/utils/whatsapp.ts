import { formatCurrency, formatDate } from './formatters';

export interface WhatsAppMessageParams {
  phone: string;
  participantName: string;
  tontineName: string;
  amount?: number;
  dueDate?: string;
  payoutDate?: string;
  type: 'rappel' | 'retard' | 'confirmation_paiement' | 'tour_beneficiaire' | 'invitation';
}

export const generateWhatsAppMessage = (params: WhatsAppMessageParams): string => {
  const { participantName, tontineName, amount, dueDate, payoutDate, type } = params;
  const formattedAmount = amount ? formatCurrency(amount) : '';
  const formattedDueDate = dueDate ? formatDate(dueDate) : '';
  const formattedPayoutDate = payoutDate ? formatDate(payoutDate) : '';

  switch (type) {
    case 'rappel':
      return `Bonjour ${participantName} ! 👋\n\nPetit rappel : votre cotisation de *${formattedAmount}* pour la tontine *${tontineName}* est prévue pour le *${formattedDueDate}*.\n\nMerci de respecter le calendrier pour la bonne marche de notre groupe. 🙏\n\n_TONTINE PRO_`;

    case 'retard':
      return `Bonjour ${participantName} ! ⚠️\n\nNous constatons que votre cotisation de *${formattedAmount}* pour la tontine *${tontineName}* (échéance du ${formattedDueDate}) est en retard.\n\nMerci de bien vouloir régulariser votre situation au plus vite via Wave ou Orange Money.\n\nEn cas de souci, n'hésitez pas à me contacter.\n\n_TONTINE PRO_`;

    case 'confirmation_paiement':
      return `Bonjour ${participantName} ! ✅\n\nVotre versement de *${formattedAmount}* pour la tontine *${tontineName}* a bien été reçu et enregistré avec succès.\n\nMerci pour votre ponctualité !\n\n_TONTINE PRO_`;

    case 'tour_beneficiaire':
      return `Félicitations ${participantName} ! 🎉\n\nC'est votre tour de recevoir la cagnotte de la tontine *${tontineName}* d'un montant de *${formattedAmount}* prévue le *${formattedPayoutDate}*.\n\nJe vous contacterai pour organiser le versement sur votre numéro favori.\n\n_TONTINE PRO_`;

    case 'invitation':
      return `Bonjour ${participantName} ! 🤝\n\nVous êtes invitée à rejoindre la tontine *${tontineName}* sur TONTINE PRO.\nCotisation : *${formattedAmount}*.\n\nCliquez sur le lien pour confirmer votre participation : https://tontinepro.sn/join\n\n_TONTINE PRO_`;

    default:
      return `Bonjour ${participantName}, message concernant la tontine ${tontineName}.`;
  }
};

export const getWhatsAppUrl = (phone: string, message: string): string => {
  // Nettoyer le numéro pour le format international (Sénégal par défaut +221)
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 9) {
    cleanPhone = '221' + cleanPhone;
  }
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
